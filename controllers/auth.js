import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import createError from "../utils/createError.js";

export const register = async (req, res, next) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return next(
      createError({
        status: 400,
        message: "name, email and password are required",
      })
    );
  }

  try {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(req.body.password, salt);

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    await newUser.save();
    return res.status(201).json("New user created");
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const login = async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return next(
      createError({ status: 400, message: "email and password are required" })
    );
  }
  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "name email password"
    );
    if (!user) {
      return next(createError({ status: 404, message: "no user found" }));
    }
    const isPasswordCorrect = await bcryptjs.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return next(
        createError({ status: 400, message: "password is incorrect" })
      );
    }
    const payload = {
      id: user._id,
      name: user.name,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
      
    });
    const user1 =await User.findOneAndUpdate(user._id,{$addToSet:{tokens:token}},
      {new:true});
      return res
      .status(200)
      .cookie("jwt", token, { sameSite: "Strict", httpOnly: true })
      .json({ data: user1 });
 
    
  } catch (err) {
    console.log(err);
    return next(err);
  }
  
};


