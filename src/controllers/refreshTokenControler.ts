import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const handleRefreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  const { id, email, role } = req.body;

  console.log(cookies);

  if (!cookies.jwt) {
    res.sendStatus(401);
  }

  const refreshToken = cookies.jwt;

  const decoded = jwt.decode(refreshToken);

  console.log(decoded);

  const customer = await prisma.customer.findUnique({
    where: {
      id,
      email,
      role,
      refreshToken,
    },
  });

  if (!customer) {
    res.sendStatus(403);
    return;
  }

  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    throw new Error(
      "ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET is not set in the environment variables"
    );
  }
};
