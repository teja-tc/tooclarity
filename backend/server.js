const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Institution } = require('./models/Institution');
// const {Course} =require('./models/Course')

dotenv.config();
const app = require('./app');

const DB = process.env.MONGO_URI;
mongoose.connect(DB).then(() => console.log('✅ MongoDB connection successful!'));

const port = process.env.PORT || 3000;
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
