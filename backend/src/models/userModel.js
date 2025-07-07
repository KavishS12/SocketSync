import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    minlength: 6,
  },
  profilePic: {
    type: String,
    default: "",
  },
}, {
  timestamps: true,
});

const User = mongoose.model("User", userSchema);
export default User;