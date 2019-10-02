require("dotenv").config();
import Sequelize from "sequelize";
import { getNamespace } from "continuation-local-storage";

import commonDBConnection from "./commonDBConnection";

let connectionMap = {};

export const connectAllDb = async () => {
  let tenants;

  try {
    commonDBConnection
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
      })
      .catch(err => {
        console.error("Unable to connect to the database:", err);
      });
    tenants = await commonDBConnection.query("SELECT * FROM tenants");
    console.log("xxxxx");
  } catch (e) {
    console.log("error", e);
    return;
  }

  connectionMap = await Promise.all(
    tenants[0].map(async tenant => {
      const teamp = await new Sequelize(
        tenant.db_name,
        tenant.db_username,
        tenant.db_password,
        {
          host: tenant.db_host,
          dialect: process.env.DB_CLIENT
        }
      );
      return {
        [tenant.slug]: teamp
      };
    })
  );

  return connectionMap.reduce((prev, next) => {
    return Object.assign({}, prev, next);
  }, {});
};

console.log("connectionMap", connectionMap);

export const allConnection = Object.keys(connectionMap).length
  ? connectionMap
  : {};
