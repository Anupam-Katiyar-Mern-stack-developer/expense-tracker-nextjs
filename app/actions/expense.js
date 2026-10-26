import { expenseSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";


export async function addExpense(prevState, formData) {
  const parsed = expenseSchema.safeParse({
    title: formData.get("title"),
    amount: formData.get("amount"),
    category: formData.get("category"),
    date: formData.get("date"),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  revalidatePath("/expenses");
  return { success: true };
}
