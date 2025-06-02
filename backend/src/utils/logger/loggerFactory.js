import Logger from './logger.js';

const instaces = {};

export default function getLogger(type) {
  if (!instaces[type]) {
    instaces[type] = new Logger(type);
  }
  return instaces[type];
}