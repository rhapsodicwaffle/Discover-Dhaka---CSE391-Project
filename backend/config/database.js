const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('\n⚠️  Make sure MongoDB is installed and running!');
    console.log('To install MongoDB:');
    console.log('  - Download from: https://www.mongodb.com/try/download/community');
    console.log('  - Or install via Chocolatey: choco install mongodb');
    console.log('\nTo start MongoDB:');
    console.log('  - Run: mongod');
    console.log('  - Or start MongoDB service in Services app\n');
    process.exit(1);
  }
};

module.exports = connectDB;
