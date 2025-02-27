import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TypedRequestBody } from "../types/customer.types";

const secretKey = process.env.SECRET_KEY as string;

export const login = async (
  req: TypedRequestBody<{ email: string; password: string }>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const customer = await prisma.customer.findUnique({
      where: {
        email: email,
      },
    });

    if (!customer) {
      res.status(401).json({ message: "Invalid Credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, customer.password);

    if (!isMatch) {
      res.status(401).json({ message: "Invalid Credentials" });
      return;
    }

    const token = jwt.sign(
      {
        sub: customer.id,
        role: customer.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      secretKey,
      { algorithm: "HS256" }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};
