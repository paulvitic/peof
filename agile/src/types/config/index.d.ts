declare namespace NodeJS {

  export interface ProcessEnv {
    PORT: string;
  }

  export interface Global {
    log: {
      info: (message: string) => void,
      error: (message: string) => void,
      warn: (message: string) => void
      debug: (message: string) => void
    }
  }
}
