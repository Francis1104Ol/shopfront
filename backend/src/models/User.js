const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    resetTokenHash:{type: String},
    resetTokenExpiry:{type:Date}
},
  { timestamps: true },
  

);

module.exports = mongoose.model("User", userSchema);
