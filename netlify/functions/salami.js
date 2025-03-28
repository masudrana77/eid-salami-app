const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async event => {
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SECRET,
  });

  try {
    const data = JSON.parse(event.body);

    // ডাটা সেভ করুন
    const result = await client.query(q.Create(q.Collection('logs'), { data }));

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify(error) };
  }
};
const faunadb = require('https://cdn.jsdelivr.net/npm/faunadb@4.6.0/dist/faunadb.js');
