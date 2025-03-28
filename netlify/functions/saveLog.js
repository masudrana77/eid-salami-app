const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event) => {
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SECRET
  });

  const data = JSON.parse(event.body);
  
  try {
    const result = await client.query(
      q.Create(
        q.Collection('salami_logs'),
        { data }
      )
    );
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify(error) };
  }
};
