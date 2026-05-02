const axios = require('axios');
const config = require('../config/config');

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

module.exports = apiClient;
