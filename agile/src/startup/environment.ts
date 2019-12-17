import { config } from 'dotenv';

export interface Environment {
    NODE_ENV: string;
    PORT: number;
    LOG_LEVEL: string;
    DATA_COLLECTION_CRON: string
    API_PREFIX: string,
    JIRA_URL: string,
    JIRA_USER: string,
    JIRA_API_TOKEN: string
}

const getStringValueOrThrow = (objectVariables: NodeJS.ProcessEnv, key: string): string => {
    const value = objectVariables[key];
    if (value) {
        return value;
    }
    throw Error(`invalid value '${value}' for environment variable ${key}`);
};

const getArrayFromCommaSeparated = (value?: string): string[] => {
    return value && value.trim() ? value.split(',').map((item) => item.trim()) : [];
};

const envFound = config();
if (!envFound) {
    throw new Error("Couldn't find .env file");
}

export async function getEnvironment(): Promise<Environment> {
    return {
        NODE_ENV: getStringValueOrThrow(process.env, 'NODE_ENV'),
        PORT: process.env.PORT ? parseInt(process.env.PORT) : 4000,
        LOG_LEVEL: process.env.LOG_LEVEL || "info",
        DATA_COLLECTION_CRON: process.env.DATA_COLLECTION_CRON || '* * * * *',
        API_PREFIX: process.env.API_PREFIX || '/api',
        JIRA_URL: getStringValueOrThrow(process.env, 'JIRA_URL'),
        JIRA_USER: getStringValueOrThrow(process.env, 'JIRA_USER'),
        JIRA_API_TOKEN: getStringValueOrThrow(process.env, 'JIRA_API_TOKEN'),
    };
}
