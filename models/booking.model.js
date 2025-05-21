export default (sequelize, DataTypes) => {
  const Booking = sequelize.define("Booking", {
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    date: DataTypes.DATEONLY,
    start_time: DataTypes.TIME,
    end_time: DataTypes.TIME,
    turno: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    space_id: DataTypes.INTEGER
  }, {
    tableName: 'bookings',
    underscored: true,
    timestamps: true
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.User, { foreignKey: "user_id" });
    Booking.belongsTo(models.Space, { foreignKey: "space_id" }); // ✅ IMPORTANTE
  };

  return Booking;
};
