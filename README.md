## PROJECT SETUP

> git clone <https://github.com/hirenpanchal1401/multitenant-app-node-sequelize.git>

> npm install
---
### DATABASE SETUP

**1. common_db**

**Database which holds the information about all the tenant databases. It also stores the configuration for each tenant databases (in 'tenants' table) which can be used to enable/disable features for each tenant.**

### *set config of common_db in .env file*

#### FIELDS IN TABLE (TENANTS)

    - id
    - db_host
    - db_port
    - db_name
    - db_dialect
    - db_username
    - db_password
    - slug

**2. tenant_db**

**Separate database for every tenant that holds data as per tenant needs.This should be same as a *db_name* field of *tenants* table of *common_db.***

**Ex. tenant_db1 , tenant_db2**

**3. Different Tables In Tenant DBs**

**Create new tables with same fiels in all tenant database as per your requirement.**

**Ex. users table for tenant_db1 , tenant_db2 having same field**

### RUN PROJECT

> npm start