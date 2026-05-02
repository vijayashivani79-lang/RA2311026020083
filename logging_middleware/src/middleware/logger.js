const apiClient = require('../utils/apiClient');
const authService = require('../services/authService');

const ALLOWED_STACKS = ['backend', 'frontend'];
const ALLOWED_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];

const ALLOWED_PACKAGES = {
  backend: ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'],
  frontend: ['api', 'component', 'hook', 'page', 'state', 'style'],
  both: ['auth', 'config', 'middleware', 'utils']
};

/**
 * Validates the package against the stack.
 */
function isValidPackage(stack, pkg) {
  if (ALLOWED_PACKAGES.both.includes(pkg)) return true;
  if (stack === 'backend' && ALLOWED_PACKAGES.backend.includes(pkg)) return true;
  if (stack === 'frontend' && ALLOWED_PACKAGES.frontend.includes(pkg)) return true;
  return false;
}

/**
 * Reusable logging middleware function that sends logs to the external API.
 * 
 * @param {string} stack - 'backend' or 'frontend'
 * @param {string} level - 'debug', 'info', 'warn', 'error', 'fatal'
 * @param {string} pkg - The package/module originating the log
 * @param {string} message - The log message
 */
async function Log(stack, level, pkg, message) {
  try {
    // 1. Validate Inputs
    if (!ALLOWED_STACKS.includes(stack)) {
      throw new Error(`Invalid stack: ${stack}. Allowed: ${ALLOWED_STACKS.join(', ')}`);
    }
    if (!ALLOWED_LEVELS.includes(level)) {
      throw new Error(`Invalid level: ${level}. Allowed: ${ALLOWED_LEVELS.join(', ')}`);
    }
    if (!isValidPackage(stack, pkg)) {
      throw new Error(`Invalid package '${pkg}' for stack '${stack}'.`);
    }
    if (!message || typeof message !== 'string') {
      throw new Error('Message must be a non-empty string.');
    }

    // 2. Fetch Authentication Token (handles auto-refresh)
    const token = await authService.authenticate();

    // 3. Prepare Payload
    const logPayload = {
      stack,
      level,
      package: pkg,
      message,
      // Bonus: Timestamp for local record, though the API may or may not process it
      timestamp: new Date().toISOString()
    };

    // 4. Send Log to API
    await apiClient.post('/logs', logPayload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log(`[LOCAL] Successfully logged: [${level.toUpperCase()}] ${message}`);
  } catch (error) {
    // Graceful Error Handling
    if (error.response) {
      console.error(`[LOGGER ERROR] API Failure (${error.response.status}):`, error.response.data);
    } else {
      console.error('[LOGGER ERROR]', error.message);
    }
    
    // Optional: We could implement retry logic here for network failures, 
    // but we'll stick to logging the error locally to prevent breaking the main app flow.
  }
}

module.exports = Log;
