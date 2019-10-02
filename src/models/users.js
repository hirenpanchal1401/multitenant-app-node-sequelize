module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING
      }
    },
    {
      timestamps: false
    }
  );
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};
