import { user as User } from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMail from "../middleware/sendMail.js";

// New user Registration
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, contact } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "Email Already Register",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(Math.random() * 1000000);
    user = { name, email, hashPassword, contact };
    const activationToken = jwt.sign(
      { user, otp },
      process.env.ACTIVATION_SECRET,
      { expiresIn: "5m" }
    );
    const message = `Please verify your account using your otp ${otp}`;
    await sendMail(email, "Welcome to site", message);
    return res.status(200).json({
      message: "Otp sent to mail",
      activationToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Verfiy otp

export const verifyUser = async (req, res) => {
  try {
    const { otp, activationToken } = req.body;
    const verify = jwt.verify(activationToken, process.env.ACTIVATION_SECRET);
    if (!verify) {
      return res.json({
        message: "Expired otp",
      });
    }
    if (verify.otp !== otp) {
      return res.json({
        message: "Invalid otp",
      });
    }
    await User.create({
      name: verify.user.name,
      email: verify.user.email,
      password: verify.user.hashPassword,
      contact: verify.user.contact,
    });
    return res.status(200).json({
      message: "User Registration Success",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Login user

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credential",
      });
    }
    // Verify password

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(400).json({
        message: " Invalid Credential",
      });
    }

    // Hide password

    const { password: userPassword, ...userDetails } = user.toObject();

    // Generate Singed Token
    const token = jwt.sign({ _id: user.id }, process.env.JWT_SCRECT, {
      expiresIn: "15d",
    });
    return res.status(200).json({
      message: "Welcome " + user.name,
      token,
      userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
