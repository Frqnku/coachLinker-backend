const mongoose = require("mongoose")
const connectionString = process.env.DATABASE_URL
mongoose.set("strictQuery", true)

mongoose
  .connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log("Successfully connected to the Coach Linker Database 💪🏅 !"))
  .catch((errorMessage) => console.error(errorMessage))