const verifyLinearUser = async (email) => {
  try {
    if (!email) return null;

    const query = {
      query: `
        query CheckActiveUserMembership($email: String!) {
          users(filter: { 
            email: { eq: $email },
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
      variables: { email },
    };

    const response = await fetch("https://api.linear.app/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LINEAR_API_KEY}`,
      },
      body: JSON.stringify(query),
    });

    const result = await response.json();

    const user = result?.data?.users?.nodes?.[0];

    if (!user?.email) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };

  } catch (error) {
    console.error("Linear API error:", error.message);
    throw new Error("Linear verification failed");
  }
};

module.exports = verifyLinearUser;