import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "./models/User.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    connectDB();
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME;

    let admin = await User.findOne({ email });
    console.log("Seeding user....");
    if (admin) {
      console.log("Admin already exists.");
    } else {
      admin = await new User({
        name,
        email,
        password,
      });
      await admin.save();
      console.log("Admin created successfully.");
    }
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.log("Error seeding admin user", error);
  }
};

seedAdmin();
