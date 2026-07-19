import { BadRequestException, Injectable } from '@nestjs/common';
import { EnvService } from '@config/env';
import { UploadStorageEnum } from '@common/enums/upload';
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';
import { MultipartFile } from '@fastify/multipart';
import { v4 } from 'uuid';
import { Readable } from 'node:stream';

@Injectable()
export class S3Service {
  constructor(
    private readonly envService: EnvService,
    private readonly client: S3Client,
  ) {
    this.client = new S3Client({
      region: envService.awsRegion,
      credentials: {
        accessKeyId: envService.awsAccessKeyId,
        secretAccessKey: envService.awsSecretAccessKey,
      },
    });
  }

  setKey({
    path,
    originalname,
  }: {
    path: string;
    originalname: string;
  }): string {
    return `${this.envService.appName}/${path}/${v4()}__${originalname}`;
  }

  async uploadOneFile({
    file,
    path,
    ContentType,
    storageType = UploadStorageEnum.MEMORY,
  }: {
    file: MultipartFile;
    path: string;
    ContentType?: string;
    storageType?: UploadStorageEnum;
  }): Promise<string> {
    const Key = this.setKey({ path, originalname: file.filename });
    const calculatedContentType = file.mimetype || ContentType;

    //Resolve the file payload
    let bodyPayload: Buffer | Readable;

    if (storageType === UploadStorageEnum.MEMORY)
      bodyPayload = await file.toBuffer();
    else bodyPayload = file.file;

    //Determine file size
    const isSmallFile =
      storageType === UploadStorageEnum.MEMORY
        ? (bodyPayload as Buffer).length < this.envService.multerLimitFileSize
        : true;

    if (isSmallFile) {
      const command = new PutObjectCommand({
        Bucket: this.envService.awsBucketName,
        ACL: ObjectCannedACL.private,
        Key,
        Body: bodyPayload,
        ContentType: calculatedContentType,
      });

      if (!command.input.Key) throw new BadRequestException('Failed to Upload');
      await this.client.send(command);
      return command.input.Key;
    }

    //Multi-part manager for large streams
    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.envService.awsBucketName,
        ACL: ObjectCannedACL.private,
        Key,
        Body: bodyPayload,
        ContentType: calculatedContentType,
      },
    });

    await upload.done();
    return Key;
  }

  async uploadManyFiles({
    files,
    path,
    ContentType,
    storageType = UploadStorageEnum.MEMORY,
  }: {
    files: MultipartFile[];
    path: string;
    ContentType?: string;
    storageType?: UploadStorageEnum;
  }): Promise<string[]> {
    return await Promise.all(
      files.map((file) =>
        this.uploadOneFile({ file, path, ContentType, storageType }),
      ),
    );
  }

  async createPresignedUrl({
    expiresIn = this.envService.awsPresignExpiry,
    originalname,
    path,
    ContentType,
  }: {
    expiresIn?: number;
    originalname: string;
    path: string;
    ContentType: string;
  }) {
    const command = new PutObjectCommand({
      Bucket: this.envService.awsBucketName,
      ContentType,
      Key: this.setKey({ path, originalname }),
    });

    return {
      url: await getSignedUrl(this.client, command, { expiresIn }),
      Key: command.input.Key as string,
    };
  }

  async getFile(Key: string) {
    return await this.client.send(
      new GetObjectCommand({ Bucket: this.envService.awsBucketName, Key }),
    );
  }

  async getPreSignedUrl({
    Key,
    download,
    fileName,
  }: {
    Key: string;
    download: string;
    fileName: string;
  }) {
    return await getSignedUrl(
      this.client,
      new GetObjectCommand({
        Bucket: this.envService.awsBucketName,
        Key,
        ResponseContentDisposition:
          download === 'true'
            ? `attachment; filename="${fileName || Key.split('/').pop()}"`
            : undefined,
      }),
      {
        expiresIn: this.envService.awsPresignExpiry,
      },
    );
  }

  async deleteOneFile(Key: string) {
    return await this.client.send(
      new DeleteObjectCommand({ Bucket: this.envService.awsBucketName, Key }),
    );
  }
  async deleteManyFiles(Keys: string[]) {
    const Objects = Keys.map((Key) => ({ Key }));
    return await this.client.send(
      new DeleteObjectsCommand({
        Bucket: this.envService.awsBucketName,
        Delete: { Objects },
      }),
    );
  }

  async deleteFolder(Prefix: string) {
    const list = await this.client.send(
      new ListObjectsV2Command({
        Bucket: this.envService.awsBucketName,
        Prefix: `${this.envService.appName}/${Prefix}`,
      }),
    );
    const Keys = list?.Contents?.map((obj) => {
      return obj.Key as string;
    });

    return await this.deleteManyFiles(Keys as string[]);
  }
}
