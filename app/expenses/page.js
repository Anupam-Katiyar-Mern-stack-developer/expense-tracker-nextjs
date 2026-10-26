import pool from "@/lib/db";
import ExpenseList from "./ExpenseList"


export const dynamic ="force-dynamic";

export default async function ExpensesPage() {

    const userId =1


    const result =await pool.query(
        `select id,title,amount,category,description,expense_date
        from expenses
          where user_id =$1 
          order by id desc, id desc `,[userId]
    );

    const expenses = result.rows.map((e) => ({
    id: e.id,
    title: e.title,
    amount: Number(e.amount),
    category: e.category,
    description: e.description,
    // expense_date: e.expense_date.toISOString().slice(0, 10),
  }));

  return (
    <main className="p-8 max-w-xl">
        <h1 className="text-2xl font-bold mb-4">mere expenses</h1>
        <ExpenseList expenses={expenses} />
    </main>
  )
    
}