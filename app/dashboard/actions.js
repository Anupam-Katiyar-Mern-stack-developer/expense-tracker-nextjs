"use server";
import "server-only";

import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
export async function logoutUser() {
  const coockieStore = await cookies();
  const sessionToken = coockieStore.get("session")?.value;

  try {
    if (sessionToken) {
      const tokenHash = createHash("sha256").update(sessionToken).digest("hex");
      await pool.query("delete from sessions where token_hash =$1", [
        tokenHash,
      ]);
    }
  } catch (error) {
    console.error("Logout failed:", error);
    throw new Error("Unable to sign out. Please try again.");
  }
  coockieStore.delete("session");

  redirect("/login");
}
