const verifyLinearUser = async (email) => {
  try {
    if (!email) return null;

    const query = {
      query: `query CheckActiveUserMembership {
  users(filter: { 
    email: { eq: "${email}" },
    active: { eq: true }
  }) {
    nodes {
      id
      name
      email
    }
  }
}
`,
    };

    const response = await fetch("https://api.linear.app/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.LINEAR_API_KEY,
      },
      body: JSON.stringify(query),
    });

    const { data } = await response.json();

    if (!data.users.nodes[0]?.email) return null;

    return {
      id: data.users.nodes[0].id,
      name: data.users.nodes[0].name,
      email: data.users.nodes[0].email,
    };

  } catch (error) {
    console.error("Linear API error:", error.message);
    throw new Error("Linear verification failed");
  }
};

module.exports = verifyLinearUser;