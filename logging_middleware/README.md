# Logging Middleware System

A robust Node.js logging middleware built to interact with an external Evaluation Service API. This system features structured logging, input validation, and an automatic authentication flow that includes token caching and refreshing.

## 📌 Project Features
- **Structured Logging:** Enforces specific stack, level, and package formats.
- **Authentication System:** Auto-generates, caches, and refreshes the Bearer token for API communication.
- **Error Handling:** Gracefully handles invalid inputs and API errors.
- **Clean Architecture:** Modular structure dividing services, utilities, config, and middleware.

## 📁 Project Structure

```text
logging-middleware/
│
├── src/
│   ├── middleware/
│   │     └── logger.js       # Core logging logic and validation
│   │
│   ├── services/
│   │     └── authService.js  # Authentication and registration logic
│   │
│   ├── utils/
│   │     └── apiClient.js    # Axios instance configuration
│   │
│   ├── config/
│   │     └── config.js       # Environment variables loader
│   │
│   └── app.js                # Demo entry point
│
├── .env                      # Environment variables
├── package.json
└── README.md
```

## ⚙️ Setup Instructions

### 1. Install Dependencies
Make sure you have Node.js installed, then run:
```bash
npm install
```

### 2. Configure Environment Variables
Open the `.env` file and fill in your registration details under **Registration Details**. 
Leave `CLIENT_ID` and `CLIENT_SECRET` blank for now.

### 3. Register Client
Run the application to trigger the registration process:
```bash
node src/app.js
```
*If registration is successful, the console will output a `CLIENT_ID` and `CLIENT_SECRET`.*

### 4. Update Client Credentials
Copy the outputted `CLIENT_ID` and `CLIENT_SECRET` and paste them into your `.env` file under **Client Credentials**.

### 5. Run the Application
Run the demo again. This time, it will authenticate, get a token, and run several test logs:
```bash
node src/app.js
```

## 📝 API Explanation

### Registration (`POST /register`)
- **Purpose**: Obtain a long-lived `clientID` and `clientSecret`.
- **Trigger**: Automatically runs in `app.js` if the `.env` file is missing client credentials.

### Authentication (`POST /auth`)
- **Purpose**: Exchange client credentials + registration details for a short-lived `access_token`.
- **Handling**: `authService.js` automatically calls this before logging if no valid token is cached in memory.

### Logging (`POST /logs`)
- **Purpose**: Send the validated log to the external system.
- **Validation Rules**:
  - **Stack**: `backend`, `frontend`
  - **Level**: `debug`, `info`, `warn`, `error`, `fatal`
  - **Package (Backend)**: `cache`, `controller`, `cron_job`, `db`, `domain`, `handler`, `repository`, `route`, `service`
  - **Package (Frontend)**: `api`, `component`, `hook`, `page`, `state`, `style`
  - **Package (Both)**: `auth`, `config`, `middleware`, `utils`

## 🧪 Example Usage

You can use the `Log` function anywhere in your Node.js application by importing it:

```javascript
const Log = require('./src/middleware/logger');

// Example: Successful Log
Log('backend', 'error', 'handler', 'received string, expected bool');

// Example: Invalid Log (will be caught and handled gracefully)
Log('database', 'info', 'db', 'Connecting to DB...');
```
