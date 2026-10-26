"use server";

import bcrypt from "bcryptjs";

import pool from "@/lib/db";

export async function registerUser(previousState, formData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  const errors = {};

  if (!name) {
    errors.name = "Please enter your full name";
  } else if (name.length > 100) {
    errors.name = "Name cannot exceed 100";
  }

  if (!email) {
    errors.email = "Please enter your email";
  } else if (email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!password) {
    errors.password = "Please create a password.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (Buffer.byteLength(password, "utf8") > 72) {
    errors.password = "Password must not exceed 72 UTF-8 bytes.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors,
    };
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    await pool.query(
      `insert into users (name,email,password_hash)
        values ($1,$2,$3)
        `,
      [name, email, passwordHash],
    );
    return {
      success: true,
      message: "Account created successfully! You can now sign in.",
      errors: {},
    };
  } catch (error) {
    if (error.code === "23505") {
      return {
        success: false,
        message: "An account with this email already exists.",
        errors: {
          email: "This email is already registered.",
        },
      };
    }

    console.error("Registration error:", error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
      errors: {},
    };
  }
}
