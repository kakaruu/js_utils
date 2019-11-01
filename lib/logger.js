const winston = require('winston');
const path = require('path');

const commonLogFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.splat(),
);

const logTextFormat = winston.format.printf((info) => {
  const {
    timestamp, level, message
  } = info;

  const ts = timestamp.slice(0, 19).replace('T', ' ');
  return `[${level}] ${ts} ${message}`;
});

const consoleLogFormat = winston.format.combine(
  winston.format.colorize(),
  logTextFormat
);

const fileLogFormat = winston.format.combine(
  logTextFormat
);

function Logger(opts) {
  if(!(this instanceof Logger)) {
    return new Logger(opts);
  }

  Object.assign(this.options, opts);

  var transports = [
    new winston.transports.Console({
      format: consoleLogFormat
    })
  ];

  if(this.options.filename !== undefined) {
    transports.push(
      new winston.transports.File({
        format: fileLogFormat,
        filename: path.join('./log', this.options.filename),
        maxsize: this.options.maxsize
      })
    )
  }

  var wLogger = winston.createLogger({
    level: this.options.level,
    format: winston.format.combine(
      commonLogFormat
    ),
    transports: transports,
  });

  this.log = (level, name, tag, data) => {
    wLogger[level]('[%s]: %s - %s', name, tag, data);
  }
}

Logger.prototype = {
  options: {
    level: 'info',
    filename: undefined,
    maxsize: '20m'
  },
  log: (level, name, tag, data) => {},
}

module.exports = Logger;