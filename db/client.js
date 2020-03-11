const { Client } = require('pg');

const client = new Client(process.env.DATABASE_URL || 'postgres://localhost/university_grace_hopper');

client.connect();

module.exports = client;
