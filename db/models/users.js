const client = require('../client');
const { hash } = require('../auth');

const users = {
  read: async () => {
    return (await client.query('SELECT * from users')).rows;
  },
  create: async ({ username, firstname, lastname, password, role, email }) => {
    const SQL = `INSERT INTO users(username, firstname, lastname, password, role, email) values($1, $2, $3, $4, $5, $6) returning *`;

    return (
      await client.query(SQL, [
        username,
        firstname,
        lastname,
        await hash(password),
        role || null,
        email,
      ])
    ).rows[0];
  },
};

module.exports = users;
