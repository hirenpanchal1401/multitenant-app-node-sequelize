module.exports = (sequelize, DataTypes) => {
    const tenants = sequelize.define(
        'tenants',
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            db_host: {
                type: DataTypes.STRING,
            },
            db_port: {
                type: DataTypes.STRING,
            },
            db_username: {
                type: DataTypes.STRING,
            },
            db_name: {
                type: DataTypes.STRING,
            },
            db_password: {
                type: DataTypes.STRING,
            },
            slug: {
                type: DataTypes.INTEGER,
            },
            createdAt: DataTypes.DATE,
        },
    );
    tenants.associate = function (models) {
        // associations can be defined here
    };
    return tenants;
}; 