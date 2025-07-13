import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }
    
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        }
        
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
        
        try {
            cached.promise = mongoose.connect(`${mongoUri}/G11-Shop`, opts).then((mongoose) => {
                console.log("Connected to MongoDB successfully");
                return mongoose;
            });
        } catch (error) {
            console.error("MongoDB connection error:", error);
            throw error;
        }
    }
    
    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        cached.promise = null;
        console.error("Failed to connect to MongoDB:", error);
        throw error;
    }
}

export default connectDB;