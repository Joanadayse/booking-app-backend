module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Spaces", "created_at", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("NOW()") // ✅ Define um valor padrão
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Spaces", "created_at");
  }
};