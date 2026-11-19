const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('[SERVER] BizMind AI Backend running on port ' + PORT);
    console.log('[SERVER] Environment: ' + process.env.NODE_ENV);
  });
}).catch(err => {
  console.error('[SERVER] Startup error:', err.message);
  process.exit(1);
});
