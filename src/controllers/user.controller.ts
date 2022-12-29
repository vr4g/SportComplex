import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "d501100953cbb8",
    pass: "8318dc6ed107f5",
  },
});

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, firstname, lastname, role } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "All fields are required" });
  }

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    return res.status(400).send({ message: "Email already in use" });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = new User({
    email: email,
    password: hashedPassword,
    firstname: firstname,
    lastname: lastname,
    role: role || "user",
  });
  await user.save();

  const confirmationURL = `http://localhost:8000/api/users/confirm/${user._id}`;

  //EMAIL FORMAT FOR CONFIRMATION AFTER REGISTRATION
  const message = {
    from: "test@test.com",
    to: user.email,
    subject: "Confirm your registration",
    html: `<p>Thank you for registering!</p>
           <p>Please click <a href="${confirmationURL}">here</a> to confirm your email address.</p>`,
  };
  await transporter.sendMail(message);
  res.status(200).send({ message: "User registered successfully" });
};

export const confirmEmail = async (req: Request, res: Response) => {
  const user = await User.findOne({ _id: req.params.id });
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  user.emailConfirmed = true;
  await user.save();
  res.status(200).send({ message: "Email confirmed successfully" });
};
