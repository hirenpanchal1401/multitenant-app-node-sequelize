"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
import { connectAllDb, connectionMap } from "../connectionManager";

const allConnectionPool = {};

const connectionPool = async () => {
  const connectionObj = await connectAllDb();
  const connectionKey = Object.keys(connectionObj);

  for (let i = 0; i < connectionKey.length; i++) {
    const sequelize = connectionObj[connectionKey[i]];
    const db = {};

    await sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
      })
      .catch(err => {
        console.error("Unable to connect to the database:", err);
      });

    const files = fs.readdirSync(__dirname).filter(file => {
      return (
        file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
      );
    });

    for (let j = 0; j < files.length; j++) {
      const file = files[j];
      const model = sequelize["import"](path.join(__dirname, file));
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

export const getConnection = slug => {
  console.log(Object.keys(allConnectionPool));
  if (allConnectionPool[slug]) {
    return allConnectionPool[slug];
  } else {
    connectionPool();
  }
};

export const reinitializeDb = () => {
  connectionPool();
};
