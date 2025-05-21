export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('bookings', 'turno', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'manhã', // você pode trocar para 'tarde' ou 'integral' se preferir
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('bookings', 'turno');
  }
};

