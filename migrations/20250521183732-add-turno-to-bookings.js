// migrations/20250521182702-add-turno-to-bookings.js
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn('bookings', 'turno', {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'manhã' // ou outro valor padrão se preferir
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn('bookings', 'turno');
}
