import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_URL}`);
        console.log(
            `DATABASE CONNECTION SUCCEED [MONGODB] ${connection.connection.host}`
        );
    } catch (error) {
        console.log(`XXX DATABASE CONNECTION FAILED [MONGODB] ${error}`);
    }
};

export default connectMongoDB;
