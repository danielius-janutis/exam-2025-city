import { body, validationResult } from "express-validator";
import crypto from "crypto";
import * as PasswordReset from "../models/PasswordReset.js";
import * as User from "../models/User.js";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import domainErrors from "../utils/domainErrors.js";

export const requestValidator = () => [body("email").trim().isEmail().withMessage("Invalid email")];

// POST /api/password-reset
export const request = async (req, res) => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) return domainErrors.validation(res, validation.errors);

  const { email } = req.body;
  const user = await User.selectByEmail(email);
  if (!user) return res.status(200).json({ status: "ok" }); // do not reveal

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  await PasswordReset.insert({ userId: user.id, token, expiresAt });

  // Send email (if SMTP configured). For development log the reset link.
  const resetLink = `http://localhost:81/auth/reset-password?token=${token}`;

  // try send email if transporter configured, otherwise just log
  try {
    // create a default transporter (this will fail without SMTP settings)
    const transporter = nodemailer.createTransport({ sendmail: true });
    await transporter.sendMail({
      from: "no-reply@example.com",
      to: email,
      subject: "Password reset",
      text: `Reset your password: ${resetLink}`,
    });
  } catch (err) {
    console.log("Password reset link:", resetLink);
  }

  res.json({ status: "ok" });
};

export const confirmValidator = () => [
  body("token").trim().notEmpty(),
  body("newPassword").trim().isLength({ min: 8 }).withMessage("Password too short"),
];
// POST /api/password-reset/confirm
export const confirm = async (req, res) => {
  const { token, newPassword } = req.body;
  const pr = await PasswordReset.findByToken(token);
  if (!pr) return domainErrors.conflict(res, "Invalid token");
  if (new Date(pr.expiresAt) < new Date()) return domainErrors.conflict(res, "Token expired");

  const hashed = await bcryptjs.hash(newPassword, 10);
  await User.updatePassword(pr.userId, hashed);
  await PasswordReset.deleteById(pr.id);

  res.json({ status: "ok" });
};
