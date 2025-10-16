'use strict';

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

module.exports = {
  async up (queryInterface) {
    const filePath = path.join(__dirname, '..', 'data', 'user.json');
    const raw = fs.readFileSync(filePath, 'utf8');
    const now = new Date();

    const rows = JSON.parse(raw).map(u => ({
      name: u.name,
      email: u.email,
      password: bcrypt.hashSync(u.password, 10), // HASH password
      createdAt: now,
      updatedAt: now
    }));

    await queryInterface.bulkInsert('Users', rows);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete(
      'Users',
      { email: { [Op.in]: ['rahmad@mail.com','tester1@mail.com','tester2@mail.com'] } },
      {}
    );
  }
};
