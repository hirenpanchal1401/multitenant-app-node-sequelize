require('dotenv').config();
import Sequelize from 'sequelize';
import { getNamespace } from 'continuation-local-storage';

import commonDBConnection from './commonDBConnection';

let connectionMap;

/**
 * Create knex instance for all the tenants defined in common database and store in a map.
 **/
export async function connectAllDb() {
  let tenants;

  try {
    commonDBConnection
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.');
      })
      .catch((err) => {
        console.error('Unable to connect to the database:', err);
      });
    tenants = await commonDBConnection.query("SELECT * FROM tenants")
  } catch (e) {
    console.log('error', e);
    return;
  }

  connectionMap = await Promise.all(tenants[0]
    .map(async (tenant) => {
      const teamp = await new Sequelize(
        tenant.db_name,
        tenant.db_username,
        tenant.db_password,
        {
          host: tenant.db_host,
          dialect: process.env.DB_CLIENT,
        })
      return {
        [tenant.slug]: teamp
      };
    })
  );

  return connectionMap.reduce((prev, next) => {
    return Object.assign({}, prev, next);
  }, {});
}

/**
 *  Create configuration object for the given tenant.
 *  Not usefull for now.
 **/
function createConnectionConfig(tenant) {
  return {
    client: process.env.DB_CLIENT,
    connection: {
      host: tenant.db_host,
      port: tenant.db_port,
      user: tenant.db_username,
      database: tenant.db_name,
      password: tenant.db_password
    },
    pool: { min: 2, max: 20 }
  };
}

/**
 * Get the connection information (knex instance) for the given tenant's slug.
 */
export function getConnectionBySlug(slug) {
  if (connectionMap) {
    console.log(`Getting connection for ${slug}`);

    return connectionMap[slug];
  }
}

/**
 * Get the connection information (knex instance) for current context. Here we have used a
 * getNamespace from 'continuation-local-storage'. This will let us get / set any
 * information and binds the information to current request context.
 */
export function getConnection() {
  const nameSpace = getNamespace('unique context');
  const conn = nameSpace.get('connection');

  if (!conn) {
    throw 'Connection is not set for any tenant database.';
  }

  return conn;
}