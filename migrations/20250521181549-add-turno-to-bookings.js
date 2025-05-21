export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('bookings', 'turno', {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'Manhã', // ou o valor que fizer sentido
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('bookings', 'turno');
}
