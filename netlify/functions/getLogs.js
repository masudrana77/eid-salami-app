const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async () => {
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SECRET
  });

  try {
    const result = await client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection('salami_logs'))),
        q.Lambda("x", q.Get(q.Var("x")))
      )
    );
    return { statusCode: 200, body: JSON.stringify(result.data) };
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify(error) };
  }
};
