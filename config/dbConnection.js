const mongoose = require("mongoose");

let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDb = async() => {
    try {
        if (cached.conn) {
            return cached.conn;
        }

        if (!cached.promise) {
            if (!process.env.CONNECTION_STRING) {
                throw new Error("Missing CONNECTION_STRING environment variable");
            }
            cached.promise = mongoose.connect(process.env.CONNECTION_STRING).then((mongooseInstance) => {
                console.log(
                    "Database Connected:",
                    mongooseInstance.connection.host,
                    mongooseInstance.connection.name
                );
                return mongooseInstance;
            });
        }

        cached.conn = await cached.promise;
        return cached.conn;
    } catch (err) {
        cached.promise = null;
        console.error(err);
        throw err;
    }
};

module.exports = connectDb;