const apiClient = require('../utils/apiClient');
const config = require('../config/config');

class AuthService {
  constructor() {
    this.accessToken = null;
    this.expiresAt = null;
  }

  /**
   * Registers a new client with the evaluation service.
   * This is typically run once to get the clientID and clientSecret.
   */
  async register() {
    try {
      const response = await apiClient.post('/register', config.registration);
      console.log('✅ Registration Successful!');
      console.log('Please save the following credentials in your .env file:\n');
      console.log(`CLIENT_ID=${response.data.clientID}`);
      console.log(`CLIENT_SECRET=${response.data.clientSecret}\n`);
      return response.data;
    } catch (error) {
      console.error('❌ Registration Failed:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Authenticates using the stored client credentials.
   * Returns a valid access token, refreshing it if necessary.
   */
  async authenticate() {
    // Check if we have a valid token that hasn't expired yet
    if (this.accessToken && this.expiresAt && Date.now() < this.expiresAt) {
      return this.accessToken;
    }

    if (!config.client.id || !config.client.secret) {
      throw new Error('Missing CLIENT_ID or CLIENT_SECRET. Please register first.');
    }

    try {
      const authPayload = {
        email: config.registration.email,
        name: config.registration.name,
        rollNo: config.registration.rollNo,
        accessCode: config.registration.accessCode,
        clientID: config.client.id,
        clientSecret: config.client.secret
      };

      const response = await apiClient.post('/auth', authPayload);
      
      this.accessToken = response.data.access_token;
      
      // Calculate expiration time (subtracting 5 seconds for a safe buffer)
      const expiresInMs = (response.data.expires_in || 3600) * 1000;
      this.expiresAt = Date.now() + expiresInMs - 5000; 

      return this.accessToken;
    } catch (error) {
      console.error('❌ Authentication Failed:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new AuthService();
