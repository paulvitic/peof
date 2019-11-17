import expressLoader from './express';
import jobScheduler from './jobs'
//We have to import at least all the events once so they can be triggered
import './events';
import {Express} from "express";
import logger from "./logger";

export default async (expressApp: Express) => {
  await logger();
  global.log.info('✌️ Logger initialized');

  await expressLoader({ app: expressApp });
  global.log.info('✌️ Express loaded');

  await jobScheduler();
  global.log.info('✌️ Jobs scheduled');
};
