"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
import { connectAllDb, connectionMap } from "../connectionManager";
import commonDBConnection from "../commonDBConnection";

const allConnectionPool = {};
const db = {};

const commonConnectionPool = async () => {
  const sequelize = commonDBConnection
  await sequelize.authenticate()
  .then(() => {
    console.log("common_db Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

  fs.readdirSync(__dirname+'/common_db')
    .filter(file => (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    ))
    .forEach((file) => {
      const model = sequelize.import(path.join(__dirname+'/common_db', file));
      console.log('filename',model,model.name)
      db[model.name] = model;
    });

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  return db;
}

commonConnectionPool()

const connectionPool = async () => {
  const connectionObj = await connectAllDb();
  const connectionKey = Object.keys(connectionObj);

  for (let i = 0; i < connectionKey.length; i++) {
    const sequelize = connectionObj[connectionKey[i]];
    const db = {};

    await sequelize
      .authenticate()
      .then(() => {
        console.log("tenants_db Connection has been established successfully.");
      })
      .catch(err => {
        console.error("Unable to connect to the database:", err);
      });

    const files = fs.readdirSync(__dirname+'/tenant_db').filter(file => {
      return (
        file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
      );
    });

    for (let j = 0; j < files.length; j++) {
      const file = files[j];
      const model = sequelize["import"](path.join(__dirname+'/tenant_db', file));
      db[model.name] = model;
    }

    const models = Object.keys(db);

    for (let k = 0; k < models.length; k++) {
      const modelName = models[k];
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    }
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
    allConnectionPool[connectionKey[i]] = db;
  }
  return allConnectionPool;
};

// initialize all connection and set in global object
connectionPool();

export const getConnection = (req,res) => {
  if(req.query.slug){
    if (allConnectionPool[req.query.slug]) {
      return allConnectionPool[req.query.slug];
    } else {
      connectionPool();
      throw new Error('Connection is not set for given slug.')
    }
  }else{
    throw new Error(`Please provide tenant's slug to connect.`)
  }
};

export const getCommonConnection = () => {
    return db;
};

export const reinitializeDb = () => {
  connectionPool();
};
