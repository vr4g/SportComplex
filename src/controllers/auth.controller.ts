import { Request, Response } from "express";
import User from "../models/user.model";
import { generateToken } from "../utils/generateToken";

export const handleLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "Both fields are required" });
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).send({ message: "Invalid email or password" });
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(400).send({ message: "Invalid email or password" });
  }

  if (!user.emailConfirmed) {
    return res
      .status(400)
      .send({ message: "Please confirm your email to continue" });
  }

  const token = generateToken(user._id, user.role);

  res.status(200).send({
    token,
    user: {
      id: user._id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      sports: user.enrolledSports,
      role: user.role,
    },
  });
};
