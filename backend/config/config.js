const path = require('path');
const dns = require('dns');

// Configure reliable DNS servers to resolve MongoDB Atlas SRV records on any network
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore if not allowed
}

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Clean/sanitize Mongo URI (auto-encode password if it has unencoded @)
function formatMongoUri(uri) {
  if (!uri) return '';
  return uri;
}

module.exports = {
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // MongoDB Configuration
  mongoUri: process.env.MONGODB_URI || 'mongodb+srv://kiruthikbairavan13:Kiruthik%4013@cluster0.n8x1r2g.mongodb.net/StudentsManagementSystem?retryWrites=true&w=majority',

  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // Frontend URL (for CORS)
  frontendUrl: process.env.FRONTEND_URL || 'https://attendance-kiruthik.vercel.app',
  // API URL (for logs or other use)
  apiUrl: process.env.API_URL || 'https://student-attendance-tracker-w227.onrender.com',

  // Email Configuration
  emailUser: process.env.EMAIL_USER || 'kiruthikbairavan13@gmail.com',
  emailPassword: process.env.EMAIL_PASSWORD || 'ytduxlufdwyfvlcm',

  // Security
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12
};