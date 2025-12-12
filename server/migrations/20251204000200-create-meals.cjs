/**
 * Create meals table (CommonJS)
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('meals', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      foodId: { type: Sequelize.STRING },
      foodName: { type: Sequelize.STRING },
      servingSize: { type: Sequelize.FLOAT },
      servingUnit: { type: Sequelize.STRING },
      servings: { type: Sequelize.INTEGER, defaultValue: 1 },
      nutrition: { type: Sequelize.JSON },
      date: { type: Sequelize.DATEONLY },
      isPlanned: { type: Sequelize.BOOLEAN, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('meals');
  }
};
