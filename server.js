const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan'); 
const colors = require('colors'); 
const connectDB = require('./config/db'); 
const cors = require('cors'); 

// Getting env variables
dotenv.config({ path: './config/config.env' }); 

const hiketrails = require('./routes/hiketrails'); 

// Connect to database
connectDB();  

const app = express(); 
app.use(express.json()); 

//Dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev')); 
}

app.use(cors()); 

app.use('/hiketrails', hiketrails); 

const PORT = process.env.PORT || 3002; 

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
})

// Handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red); 
    // close server and exit process
    server.close(() => process.exit(1));
})