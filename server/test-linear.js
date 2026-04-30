require('dotenv').config({ path: './.env' });
const fetch = require('node-fetch') || global.fetch;

async function test() {
  const query = {
    query: `
      query {
        viewer {
          id
          name
          email
        }
      }
    `
  };

  const response = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LINEAR_API_KEY}`,
    },
    body: JSON.stringify(query),
  });

  const text = await response.text();
  console.log("Status:", response.status);
  console.log("Response:", text);
}

test();
