import mongoose from 'mongoose';
import config from './config';
import logger from '../utils/logger';

mongoose.connect(config.mongoUri || '')
  .then(() => logger.info('MongoDB connected'))
  .catch((error) => logger.error('MongoDB connection error:', error));

export default mongoose;
