const Constants = require('../config/Constants');

module.exports =  Constants.is_local ? {
    HOST: 'localhost',
    port: '3306',
    USER: "username",
    PASSWORD: 'password',
    DB: "testUpwork",
    logging :false,
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
} : {
    HOST: 'db4free.net',
    port: '3306',
    USER: "vaoxpod_hiren",
    PASSWORD: 'vaoxpod_hiren',
    DB: "vaoxpod_hiren",
    logging :false,
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
