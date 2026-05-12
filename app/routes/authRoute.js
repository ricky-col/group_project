import exp from "express"
import UserModel from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { authenticate } from "../services/authService.js"

export const authRouter = exp.Router()

authRouter.post("/register", async(req, res) => {
    try {
        const {name, email, password} = req.body;
        
        // Validation
        if (!email || !password || !name) {
            return res.status(400).json({message: "Missing required fields"});
        }
        if (password.length < 8) {
            return res.status(400).json({message: "Password must be at least 8 characters"});
        }
        
        const userExists = await UserModel.findOne({email});
        if (userExists) {
            return res.status(400).json({message: "Email already registered"});
        }
        
        // Let bcrypt handle salt generation
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new UserModel({
            name,
            email,
            password: hashedPassword
        });
        await user.save();
        
        return res.status(201).json({
  message: "User registered successfully",
  userId: user._id
});
    }
    catch(err) {
        console.log("Error in user registration", err);
        return res.status(500).json({message: "Internal server error"});
    }
});

// authRouter.post("/login", async (req,res)=>{
//   try{

//     const {email,password} = req.body;

//     const result = await authenticate({email,password});

// res.cookie("token", token, {
//   httpOnly: true,
//   secure: false, // true in production
//   sameSite: "lax"
// });

//     res.json({
//       message:"Login successful",
//       user: result.user
//     });

//   }catch(err){
//     res.status(500).json({message:"Internal server error"});
//   }
// });

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN BODY:", req.body); // 🔥 DEBUG

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userID: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.log("🔥 LOGIN ERROR:", err); // VERY IMPORTANT
    res.status(500).json({ message: err.message });
  }
});

authRouter.post("/logout", async (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});