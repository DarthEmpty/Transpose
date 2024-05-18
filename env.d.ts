declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SPOTIFY_CLIENT_ID: string;
      SPOTIFY_CLIENT_SECRET: string;
      AMAZON_CLIENT_ID: string;
      AMAZON_CLIENT_SECRET: string;
    }
  }
}

export {};
