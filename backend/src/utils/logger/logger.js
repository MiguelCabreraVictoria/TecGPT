import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export default class Logger {
  constructor(logName) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const logsDir = path.join(__dirname, '../../../../logs');
    this.logFilePath = path.join(logsDir, `${logName}.log`);

    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    if (!fs.existsSync(this.logFilePath)) {
      fs.writeFileSync(this.logFilePath, `=== ${logName.toUpperCase()} LOG ===\n`);
    }
  }

  _write(level, message) {
    const timestamp = new Date().toISOString();
    const formatted = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
    fs.appendFileSync(this.logFilePath, formatted);
  }

  info(message) {
    this._write('info', message);
  }

  warn(message) {
    this._write('warn', message);
  }

  error(message) {
    this._write('error', message);
  }
}