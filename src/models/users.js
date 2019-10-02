module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define(
    'users',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      username: {
        type: DataTypes.STRING,
      },
      createdAt: DataTypes.DATE,
    },
  );
  users.associate = function (models) {
    // associations can be defined here
  };
  return users;
}; 