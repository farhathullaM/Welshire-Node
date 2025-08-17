import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(process.env.MONGODB_URI);
    console.log(
      `MongoDB connected: ${connect.connection.host}, ${connect.connection.name}`
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDb;
