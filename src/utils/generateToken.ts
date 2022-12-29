import jwt from "jsonwebtoken";

export const generateToken = (userId: any, role: string) => {
  const token = jwt.sign(
    {
      _id: userId,
      role: role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return token;
};
