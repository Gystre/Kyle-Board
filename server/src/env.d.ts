declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      REDIS_URL: string;
      PORT: string;
      SESSION_SECRET: string;
      CORS_ORIGIN: string;
      GMAIL_USERNAME: string;
      GMAIL_PASSWORD: string;
      B2_KEY_ID: string;
      B2_APPLICATION_KEY: string;
      B2_ENDPOINT_URL: string;
      B2_BUCKET: string;
      B2_BUCKET_ID: string;
    }
  }
}

export {}
