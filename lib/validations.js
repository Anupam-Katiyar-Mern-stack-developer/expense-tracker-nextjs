import { z } from "zod";

export const expenseSchema = z.object({
  title: z.string().min(2, "Title kam se kam 2 letters ka ho"),
  amount: z.coerce.number().positive("Amount 0 se zyada hona chahiye"),
  category: z.enum(["Food", "Travel", "Bills", "Shopping", "Other"]),
  date: z.string().min(1, "Date daalo"),
});
