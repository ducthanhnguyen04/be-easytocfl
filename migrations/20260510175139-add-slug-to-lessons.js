'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Lessons', 'slug', {
      type: Sequelize.STRING,
      allowNull: true, // Để true trước để không lỗi dữ liệu cũ
      unique: true,    // Đảm bảo không trùng lặp URL
      after: 'isPremium' // (Chỉ dành cho MySQL) Đặt cột slug đứng sau cột levelName
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Lệnh để hoàn tác (rollback) nếu cần
    await queryInterface.removeColumn('Lessons', 'slug');
  }
};