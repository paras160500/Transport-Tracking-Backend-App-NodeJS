// -----------------------------------------------------------------------------------
//                              Import / Init Statements
// -----------------------------------------------------------------------------------

import http from "http";
import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();
const PORT = process.env.PORT;
await connectDB();

const server = http.createServer(app);

// -----------------------------------------------------------------------------------
//                                  Logic Statements
// -----------------------------------------------------------------------------------

server.listen(PORT, () => {
  console.log("Server Connected on PORT : ", PORT);
});
