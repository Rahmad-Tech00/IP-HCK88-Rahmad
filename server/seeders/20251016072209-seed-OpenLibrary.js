'use strict';

const axios = require('axios');
const { Op, Sequelize } = require('sequelize');

function toJsonbLiteral(value) {
  const json = JSON.stringify(value).replace(/'/g, "''");
  return Sequelize.literal(`'${json}'::jsonb`);
}

function mapDoc(doc) {
  const workKey = (doc.key || '').replace('/works/', '').trim() || null;
  const coverUrl = doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : null;
  const authorsArr = Array.isArray(doc.author_name) ? doc.author_name : [];
  return {
    openLibraryId: workKey,
    title: doc.title || 'Untitled',
    authors: toJsonbLiteral(authorsArr),
    coverUrl,
    pages: Number.isInteger(doc.number_of_pages_median) ? doc.number_of_pages_median : null,
    publishedYear: Number.isInteger(doc.first_publish_year) ? doc.first_publish_year : null,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

async function fetchMany(queries, limitPerQ = 40) {
  const out = [];
  const seen = new Set();
  for (const q of queries) {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=${limitPerQ}`;
    const { data } = await axios.get(url, { timeout: 15000 });
    for (const d of (data?.docs || [])) {
      const key = (d.key || '').replace('/works/', '').trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(mapDoc(d));
    }
  }
  return out;
}

module.exports = {
  async up (queryInterface) {
    const queries = [
      'javascript','node.js','web development','database',
      'software engineering','algorithms','react','http','api design'
    ];
    const items = await fetchMany(queries, 50);
    const rows = items.filter(b => b.title && b.openLibraryId);
    if (!rows.length) {
      console.warn('[seed-OpenLibrary] no rows — skip');
      return;
    }
    await queryInterface.bulkInsert('Books', rows);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('Books', { openLibraryId: { [Op.ne]: null } }, {});
  }
};
