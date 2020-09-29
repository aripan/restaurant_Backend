module.exports = {
  secretKey: "12345-67890-09876-54321",
  mongoUrl: process.env.MONGO_URL,
  facebook: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  },
};
