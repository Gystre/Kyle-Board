declare global {
  namespace NodeJS {
    interface ProcessEnv {
      LOCAL_DATABASE_URL: string;
      LOCAL_REDIS_URL: string;
      LOCAL_PORT: string;
      LOCAL_CORS_ORIGIN: string;
      SESSION_SECRET: string;
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
