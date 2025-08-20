const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = require('./app');

const DB = process.env.MONGO_URI;
mongoose.connect(DB).then(() => console.log('✅ MongoDB connection successful!'));

const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
    console.log(`🚀 App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});