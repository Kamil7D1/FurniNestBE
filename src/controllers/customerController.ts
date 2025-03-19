import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TypedRequestBody } from "../types/customer.types";
import { hashPassword } from "../utils/hash";

const secretKey = process.env.SECRET_KEY as string;

export const loginCustomer = async (
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

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "60s",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    await prisma.customer.update({
      where: { email: customer.email },
      data: { refreshToken: refreshToken },
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export const registerCustomer = async (
  req: TypedRequestBody<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }>,
  res: Response
): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({
        message: "First name, last name, email, and password are required",
      });
      return;
    }

    const existingCustomer = await prisma.customer.findUnique({
      where: {
        email,
      },
    });

    if (existingCustomer) {
      res.status(400).json({ message: "Email already exist" });
      return;
    }

    const hashedPassword = await hashPassword(password);

    await prisma.customer.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        refreshToken: null,
      },
    });

    res.status(201).json({ message: "Customer registered successfully" });

    return;
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export const updateCustomer = async (
  req: TypedRequestBody<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, password } = req.body;

    const customer = await prisma.customer.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!customer) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    if (email && email !== customer.email) {
      const existingCustomer = await prisma.customer.findUnique({
        where: { email },
      });

      if (existingCustomer) {
        res.status(400).json({ message: "Email already in use" });
        return;
      }
    }

    const updatedCustomer = await prisma.customer.update({
      where: {
        id: parseInt(id),
      },
      data: {
        firstName: firstName ?? customer.firstName,
        lastName: lastName ?? customer.lastName,
        email: email ?? customer.email,
        password: password ? await hashPassword(password) : customer.password,
      },
    });

    res.json(updatedCustomer);
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export const deleteCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(id) },
    });

    if (!customer) {
      res.status(404).json({ message: "User Not Found" });
      return;
    }

    await prisma.customer.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ message: "Customer deleted" });
    return;
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};
