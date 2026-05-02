require('dotenv').config();

const config = {
  apiBaseUrl: process.env.API_BASE_URL || 'http://20.207.122.201/evaluation-service',
  
  // Registration Details
  registration: {
    email: process.env.USER_EMAIL,
    name: process.env.USER_NAME,
    mobileNo: process.env.USER_MOBILE,
    githubUsername: process.env.USER_GITHUB,
    rollNo: process.env.USER_ROLL_NO,
    accessCode: process.env.USER_ACCESS_CODE,
  },

  // Client Credentials (Needed for Auth)
  client: {
    id: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET,
  }
};

module.exports = config;
