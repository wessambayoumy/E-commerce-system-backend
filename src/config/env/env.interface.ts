export interface IEnvService {
  appName: string;
  port: number;
  mongoUri: string;
  redisUri: string;
  saltRounds: number;
  ivLength: number;
  encryptionKey: string;
  jwtIssuer: string;
  jwtExpiryAccess: number;
  jwtExpiryRefresh: number;
  jwtSignatureAdminAccess: string;
  jwtSignatureAdminRefresh: string;
  jwtSignatureUserAccess: string;
  jwtSignatureUserRefresh: string;
  emailUser: string;
  emailPass: string;
  emailSecret: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  awsRegion: string;
  awsBucketName: string;
  awsPresignExpiry: number;
  rateLimitCount: number;
  rateLimitTime: number;
  corsOrigins: string;
  multerLimitFileSize: number;
}
