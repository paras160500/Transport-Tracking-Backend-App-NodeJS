// -----------------------------------------------------------------------------------
//                              Import / Init Statements
// -----------------------------------------------------------------------------------

import mongoose from "mongoose";

// -----------------------------------------------------------------------------------
//                              Import / Init Statements
// -----------------------------------------------------------------------------------

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "courier-delivery-app",
    });
    console.log("Connected ✅");
  } catch (error) {
    console.log("Error in DB Connection :- ", error.message);
    process.exit(1);
  }
};
