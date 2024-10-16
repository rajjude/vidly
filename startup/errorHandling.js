const winston = require('winston')
require('winston-mongodb')

module.exports = function () {
    const logger = winston.createLogger({
        level: 'error',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
            winston.format.colorize(),
            winston.format.simple(),
            winston.format.prettyPrint()
        ),
        transports: [
            new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly' }),
            new winston.transports.File({ filename: 'app.log' })
        ]
    });
    logger.error('This is an info message');
    logger
    //To handle uncaught exceptions
    logger.exceptions.handle(
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'app.log' }))
    //To handle unhandled promise rejections
    logger.rejections.handle(new winston.transports.File({ filename: 'app.log' }))
}