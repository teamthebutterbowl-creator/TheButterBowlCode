import mongoose from "mongoose";

/**
 * User schema for optional customer accounts and staff roles.
 * Password is stored as plain text in the schema only — hash it in auth logic before save.
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please provide a valid email address",
      ],
    },
    // Hashed in controllers later (e.g. bcrypt); min length enforced at registration
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: {
        values: ["customer", "admin", "superAdmin"],
        message: "Role must be customer, admin, or superAdmin",
      },
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);

// "User" is the model name; MongoDB collection will be "users"
const User = mongoose.model("User", userSchema);

export default User;
