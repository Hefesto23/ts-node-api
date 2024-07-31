export default {
  jwt: {
    secret: process.env.APP_SECRET || 'mySuperSecret',
    expiresIn: '1d',
  },
};
