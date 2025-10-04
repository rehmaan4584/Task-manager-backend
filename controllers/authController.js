import bcrypt from "bcrypt";
import User from "../models/user.js";
import { jwtSign } from "../lib/jwt.js";
import { v4 as uuid } from "uuid";
import { client } from "../lib/redis.js";

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({
        success: false,
        message: "Email already exist",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ email, hashPassword });
    // console.log(user._id,'id');

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const user = await User.findOne({ email });
     if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    
    const passwordMatch = await bcrypt.compare(password, user.hashPassword);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    
    const sessionId = uuid();
    const token = await jwtSign({ id: user._id, sessionId });

    await client.set(sessionId, JSON.stringify({userId: user._id,email}), { EX: Number(process.env.SESSION_DURATION) } );
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token,
      user

    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Something went wrong",
    });
  }
};

export default { registerUser, loginUser };
