const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  logging: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
async function connectionDb(sequelize) {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    if(error.code === 'PROTOCOL_CONNECTION_LOST') { 
      console.error('Unable to connect to the database:', error);// Connection to the MySQL server is usually
      connectionDb(sequelize);                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw error;                                  // server variable configures this)
    }
   
  }
}
connectionDb(sequelize);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./UserModel.js")(sequelize, Sequelize);
db.contactUs = require("./ContactUsModel.js")(sequelize, Sequelize);

module.exports = db;