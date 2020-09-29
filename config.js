module.exports = {
  secretKey: process.env.SECRET_KEY,
  mongoUrl: process.env.MONGO_URL,
  facebook: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  },
};
