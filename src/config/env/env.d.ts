declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URI: string;
      PORT: string;
      ENCRYPTION_KEY: string;
      IV_LENGTH: string;
      JWT_SECRET: string;
      JWT_EXPIRES_IN: string;
      JWT_ISSUER: string;
      SALT_ROUNDS: string;
    }
  }
}
export {};
