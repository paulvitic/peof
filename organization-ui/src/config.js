import * as config from './properties.json';

// If NODE_ENV environment variable is not set use dev
const env = process.env.NODE_ENV || 'dev';
console.log('[info] running in ' + env + ' mode.' );

export default config[env];