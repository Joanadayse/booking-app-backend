export default (sequelize, DataTypes) => {
  const Space = sequelize.define("Space", {
    name: DataTypes.STRING,
    location: DataTypes.STRING,
    capacity: DataTypes.INTEGER
  }, {
    tableName: 'spaces',
    underscored: true,
    timestamps: true
  });

  Space.associate = (models) => {
    Space.hasMany(models.Booking, { foreignKey: "space_id" }); // ✅
  };

  return Space;
};
