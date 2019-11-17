declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
  }
  export interface Global {
    log: {
      info: (message: string) => void,
      error: (message: string) => void
    }
  }
}
