import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

enum Role {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
}

interface decodedPayload extends JwtPayload {
  id: number;
  email: string;
  role: Role;
}

export const handleRefreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies.jwt) {
    res.sendStatus(401);
  }

  const refreshToken = cookies.jwt;

  const decoded = jwt.decode(refreshToken) as decodedPayload;
  const { id, email, role } = decoded;

  const customer = await prisma.customer.findUnique({
    where: {
      id: id,
      email: email,
      role: role,
      refreshToken: refreshToken,
    },
  });

  if (!customer) {
    res.sendStatus(403);
    return;
  }

  const payload = {
    id: customer.id,
    email: customer.email,
    role: customer.role,
  };

  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    throw new Error(
      "ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET is not set in the environment variables"
    );
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
    (
      err: jwt.VerifyErrors | null,
      decoded: jwt.JwtPayload | string | undefined
    ) => {
      if (err) {
        return res.sendStatus(403);
      }

      if (!decoded || typeof decoded !== "object") {
        return res.sendStatus(403);
      }

      const accessToken = jwt.sign(
        { username: decoded.username },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "60s" }
      );

      res.json({ accessToken });
    }
  );
};
