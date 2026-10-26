"use client";
import { useState } from "react";

const categories = ["all", "food", "travel", "shopping", "bills", "others"];

export default function ExpenseList({ expenses }) {
  const [category, setCategory] = useState("all");

  const filtered =
    category === "all"
      ? expenses
      : expenses.filter((e) => e.category === category);

  const total = filtered.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 mb-4 capitalize"
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <p className="mb-3 font-semibold">Total: ₹{total}</p>
      <ul className="flex flex-col gap-2">
        {filtered.map((e) => (
          <li key={e.id} className="border p-3 flex justify-between">
            <span>
              {e.description || "No description"}{" "}
              <span className="text-gray-500 text-sm">
                ({e.category}, {e.expense_date})
              </span>
            </span>
            <span>₹{e.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
