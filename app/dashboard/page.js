import "server-only";
import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import  {logoutUser}  from "@/app/dashboard/actions";

const moneyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const categoryMeta = {
  food: {
    label: "Food & dining",
    icon: "F",
    color: "bg-orange-100 text-orange-700",
    dot: "bg-orange-400",
    bar: "bg-orange-400",
  },
  travel: {
    label: "Travel",
    icon: "T",
    color: "bg-sky-100 text-sky-700",
    dot: "bg-sky-400",
    bar: "bg-sky-400",
  },
  shopping: {
    label: "Shopping",
    icon: "S",
    color: "bg-violet-100 text-violet-700",
    dot: "bg-violet-400",
    bar: "bg-violet-400",
  },
  bills: {
    label: "Bills",
    icon: "B",
    color: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-400",
    bar: "bg-emerald-400",
  },
  other: {
    label: "Other",
    icon: "O",
    color: "bg-slate-100 text-slate-700",
    dot: "bg-slate-400",
    bar: "bg-slate-400",
  },
};

function formatMoney(value) {
  return moneyFormatter.format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) return "—";

  return dateFormatter.format(
    new Date(`${value}T00:00:00`)
  );
}

function Icon({ name, className = "h-5 w-5" }) {
  const paths = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    receipt: (
      <>
        <path d="M5 3h14v18l-3-2-4 2-4-2-3 2V3Z" />
        <path d="M8 8h8M8 12h8M8 16h4" />
      </>
    ),
    chart: (
      <>
        <path d="M3 3v18h18" />
        <path d="m7 14 4-4 4 3 5-7" />
      </>
    ),
    categories: (
      <>
        <path d="M12 3v9h9" />
        <path d="M19.5 16.5A9 9 0 1 1 7.5 4.7" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    logout: (
      <>
        <path d="M10 17l5-5-5-5M15 12H3" />
        <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
      </>
    ),
    wallet: (
      <>
        <rect x="3" y="5" width="18" height="15" rx="3" />
        <path d="M3 9h18M16 14h2" />
      </>
    ),
    arrow: (
      <>
        <path d="M7 17 17 7M7 7h10v10" />
      </>
    ),
    trend: (
      <>
        <path d="M3 17l6-6 4 4 8-9" />
        <path d="M14 6h7v7" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name] || paths.grid}
    </svg>
  );
}

function StatCard({
  title,
  value,
  detail,
  icon,
  iconStyle,
  detailStyle = "text-slate-500",
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500">{title}</p>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
        >
          <Icon name={icon} className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-5 break-words text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        {value}
      </p>

      <p className={`mt-2 text-xs leading-5 ${detailStyle}`}>
        {detail}
      </p>
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center px-5 py-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Icon name="receipt" className="h-7 w-7" />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-800">
        {title}
      </h3>

      <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

export default async function DashboardPage() {
  // 1. Validate the current session.
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    redirect("/login");
  }

  const tokenHash = createHash("sha256")
    .update(sessionToken)
    .digest("hex");

  const sessionResult = await pool.query(
    `SELECT u.id, u.name, u.email
     FROM sessions s
     INNER JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = $1
       AND s.expires_at > CURRENT_TIMESTAMP
     LIMIT 1`,
    [tokenHash]
  );

  const user = sessionResult.rows[0];

  if (!user) {
    redirect("/login");
  }

  // 2. Fetch statistics belonging only to this user.
  const [
    summaryResult,
    monthlyResult,
    categoriesResult,
    recentResult,
  ] = await Promise.all([
    pool.query(
      `SELECT
         COALESCE(
           SUM(amount) FILTER (
             WHERE expense_date >= date_trunc('month', CURRENT_DATE)::date
               AND expense_date < (
                 date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
               )::date
           ), 0
         )::numeric AS current_month_total,

         COALESCE(
           SUM(amount) FILTER (
             WHERE expense_date >= (
               date_trunc('month', CURRENT_DATE) - INTERVAL '1 month'
             )::date
               AND expense_date < date_trunc('month', CURRENT_DATE)::date
           ), 0
         )::numeric AS previous_month_total,

         COUNT(*) FILTER (
           WHERE expense_date >= date_trunc('month', CURRENT_DATE)::date
             AND expense_date < (
               date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
             )::date
         )::int AS current_month_count,

         COUNT(*)::int AS total_count,

         COALESCE(
           AVG(amount) FILTER (
             WHERE expense_date >= date_trunc('month', CURRENT_DATE)::date
               AND expense_date < (
                 date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
               )::date
           ), 0
         )::numeric AS average_expense

       FROM expenses
       WHERE user_id = $1`,
      [user.id]
    ),

    pool.query(
      `WITH months AS (
         SELECT generate_series(
           date_trunc('month', CURRENT_DATE) - INTERVAL '5 months',
           date_trunc('month', CURRENT_DATE),
           INTERVAL '1 month'
         )::date AS month_start
       )
       SELECT
         TO_CHAR(m.month_start, 'YYYY-MM') AS month_key,
         TO_CHAR(m.month_start, 'Mon') AS label,
         COALESCE(SUM(e.amount), 0)::numeric AS total
       FROM months m
       LEFT JOIN expenses e
         ON e.user_id = $1
         AND e.expense_date >= m.month_start
         AND e.expense_date < (
           m.month_start + INTERVAL '1 month'
         )::date
       GROUP BY m.month_start
       ORDER BY m.month_start`,
      [user.id]
    ),

    pool.query(
      `SELECT
         category,
         COALESCE(SUM(amount), 0)::numeric AS total,
         COUNT(*)::int AS transaction_count
       FROM expenses
       WHERE user_id = $1
         AND expense_date >= date_trunc('month', CURRENT_DATE)::date
         AND expense_date < (
           date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
         )::date
       GROUP BY category
       ORDER BY total DESC`,
      [user.id]
    ),

    pool.query(
      `SELECT
         id,
         amount,
         category,
         description,
         expense_date::text AS expense_date
       FROM expenses
       WHERE user_id = $1
       ORDER BY expense_date DESC, created_at DESC
       LIMIT 6`,
      [user.id]
    ),
  ]);

  const stats = summaryResult.rows[0];
  const monthlyRows = monthlyResult.rows;
  const categoryRows = categoriesResult.rows;
  const recentExpenses = recentResult.rows;

  const currentMonthTotal = Number(stats.current_month_total);
  const previousMonthTotal = Number(stats.previous_month_total);

  const monthChange =
    previousMonthTotal > 0
      ? ((currentMonthTotal - previousMonthTotal) /
          previousMonthTotal) *
        100
      : null;

  const monthChangeText =
    monthChange === null
      ? currentMonthTotal > 0
        ? "No spending recorded last month"
        : "No spending recorded last month"
      : `${Math.abs(monthChange).toFixed(1)}% ${
          monthChange > 0
            ? "more than last month"
            : monthChange < 0
              ? "less than last month"
              : "same as last month"
        }`;

  const monthChangeStyle =
    monthChange === null
      ? "text-slate-500"
      : monthChange > 0
        ? "text-rose-600"
        : monthChange < 0
          ? "text-emerald-600"
          : "text-slate-500";

  const chartMax = Math.max(
    ...monthlyRows.map((row) => Number(row.total)),
    1
  );

  const firstName = user.name.trim().split(/\s+/)[0] || "there";
  const userInitial = user.name.trim().charAt(0).toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-slate-200/80 bg-white px-5 py-7 lg:flex xl:w-72 xl:px-6">
        <a href="/dashboard" className="flex items-center gap-3 px-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20">
            <Icon name="wallet" className="h-6 w-6" />
          </div>

          <div>
            <p className="text-lg font-bold tracking-tight">
              ExpenseFlow
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              Personal finance
            </p>
          </div>
        </a>

        <div className="mt-10">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Workspace
          </p>

          <nav className="mt-4 space-y-1.5">
            {[
              { label: "Overview", href: "/dashboard", icon: "grid", active: true },
              { label: "Transactions", href: "#recent-expenses", icon: "receipt" },
              { label: "Spending trends", href: "#spending-trend", icon: "chart" },
              { label: "Categories", href: "#categories", icon: "categories" },
              { label: "Account", href: "#account", icon: "user" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${
                  item.active
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon name={item.icon} className="h-[18px] w-[18px]" />
                {item.label}

                {item.active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600" />
                )}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-auto rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
            <Icon name="trend" className="h-5 w-5" />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-900">
            Small steps, better habits.
          </p>

          <p className="mt-1.5 text-xs leading-5 text-slate-500">
            Keep tracking your spending to understand your money better.
          </p>
        </div>

        <form action={logoutUser} className="mt-5">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
          >
            <Icon name="logout" className="h-[18px] w-[18px]" />
            Sign out
          </button>
        </form>
      </aside>

      {/* Main content */}
      <main className="min-w-0 lg:pl-64 xl:pl-72">
        {/* Top header */}
        <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="flex min-h-[76px] items-center justify-between gap-4 px-5 sm:px-8 xl:px-10">
            <a href="/dashboard" className="flex items-center gap-2.5 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                <Icon name="wallet" />
              </div>
              <span className="font-bold tracking-tight">
                ExpenseFlow
              </span>
            </a>

            <div className="hidden lg:block">
              <p className="text-xs font-medium text-slate-400">
                YOUR WORKSPACE
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-700">
                Dashboard overview
              </p>
            </div>

            <div className="ml-auto flex items-center gap-3 sm:gap-4">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-slate-800">
                  {user.name}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  Personal account
                </p>
              </div>

              <div
                className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 ring-4 ring-indigo-50"
                title={user.name}
              >
                {userInitial}
              </div>

              <form action={logoutUser} className="lg:hidden">
                <button
                  type="submit"
                  aria-label="Sign out"
                  title="Sign out"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                >
                  <Icon name="logout" className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8 sm:py-10 xl:px-10">
          {/* Welcome section */}
          <section
            id="account"
            className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
          >
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Account active
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Good to see you, {firstName}.
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
                Here&apos;s a clear picture of your spending and where your
                money has been going.
              </p>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-600 shadow-sm">
              <Icon name="calendar" className="h-4 w-4 text-indigo-500" />
              Monthly overview
            </div>
          </section>

          {/* Summary cards */}
          <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Spent this month"
              value={formatMoney(currentMonthTotal)}
              detail={monthChangeText}
              detailStyle={monthChangeStyle}
              icon="wallet"
              iconStyle="bg-indigo-50 text-indigo-600"
            />

            <StatCard
              title="Transactions this month"
              value={Number(stats.current_month_count).toLocaleString("en-IN")}
              detail="Expenses recorded this month"
              icon="receipt"
              iconStyle="bg-sky-50 text-sky-600"
            />

            <StatCard
              title="Average expense"
              value={formatMoney(stats.average_expense)}
              detail="Average per transaction this month"
              icon="chart"
              iconStyle="bg-violet-50 text-violet-600"
            />

            <StatCard
              title="All-time transactions"
              value={Number(stats.total_count).toLocaleString("en-IN")}
              detail="Across your entire account"
              icon="categories"
              iconStyle="bg-emerald-50 text-emerald-600"
            />
          </section>

          {/* Charts */}
          <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div
              id="spending-trend"
              className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7 xl:col-span-2"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold tracking-tight text-slate-900">
                    Spending overview
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Your monthly expenses over the last 6 months
                  </p>
                </div>

                <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
                  Last 6 months
                </span>
              </div>

              {Number(stats.total_count) === 0 ? (
                <EmptyState
                  title="Your spending story starts here"
                  description="Once you record expenses, your monthly spending trend will appear in this chart."
                />
              ) : (
                <div className="mt-8">
                  <div className="flex h-56 items-end justify-between gap-2 border-b border-slate-100 px-1 sm:gap-4 sm:px-3">
                    {monthlyRows.map((month) => {
                      const total = Number(month.total);
                      const height =
                        total > 0
                          ? Math.max((total / chartMax) * 100, 5)
                          : 2;

                      const isCurrentMonth =
                        month.month_key === monthlyRows[monthlyRows.length - 1]?.month_key;

                      return (
                        <div
                          key={month.month_key}
                          className="flex h-full min-w-0 flex-1 flex-col items-center justify-end"
                        >
                          <p className="mb-2 max-w-full truncate text-center text-[10px] font-medium text-slate-500 sm:text-xs">
                            {total > 0 ? formatMoney(total) : "—"}
                          </p>

                          <div className="flex h-[72%] w-full items-end justify-center">
                            <div
                              title={`${month.label}: ${formatMoney(total)}`}
                              className={`w-full max-w-12 rounded-t-lg transition-all duration-300 ${
                                isCurrentMonth
                                  ? "bg-gradient-to-t from-indigo-600 to-violet-400"
                                  : "bg-indigo-100 hover:bg-indigo-200"
                              }`}
                              style={{ height: `${height}%` }}
                            />
                          </div>

                          <p
                            className={`mt-3 pb-3 text-xs ${
                              isCurrentMonth
                                ? "font-semibold text-indigo-700"
                                : "text-slate-400"
                            }`}
                          >
                            {month.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
                    <span className="h-2.5 w-2.5 rounded-sm bg-indigo-500" />
                    Monthly expenses
                    <span className="ml-auto flex items-center gap-1.5">
                      <Icon name="trend" className="h-4 w-4" />
                      Amounts in INR
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Category breakdown */}
            <div
              id="categories"
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7"
            >
              <div>
                <p className="text-lg font-semibold tracking-tight text-slate-900">
                  Spending by category
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Breakdown for this month
                </p>
              </div>

              {categoryRows.length === 0 ? (
                <EmptyState
                  title="No categories yet"
                  description="Your category breakdown will show up after you record expenses."
                />
              ) : (
                <div className="mt-7 space-y-5">
                  {categoryRows.map((item) => {
                    const meta = categoryMeta[item.category] || categoryMeta.other;
                    const total = Number(item.total);
                    const percentage =
                      currentMonthTotal > 0
                        ? (total / currentMonthTotal) * 100
                        : 0;

                    return (
                      <div key={item.category}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2.5">
                            <span
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${meta.color}`}
                            >
                              {meta.icon}
                            </span>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-slate-800">
                                {meta.label}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-400">
                                {item.transaction_count}{" "}
                                {Number(item.transaction_count) === 1
                                  ? "transaction"
                                  : "transactions"}
                              </p>
                            </div>
                          </div>

                          <p className="shrink-0 text-sm font-semibold text-slate-800">
                            {formatMoney(total)}
                          </p>
                        </div>

                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full transition-all ${meta.bar}`}
                            style={{
                              width: `${Math.min(percentage, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Recent transactions */}
          <section
            id="recent-expenses"
            className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-7">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-slate-900">
                  Recent transactions
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your latest recorded expenses
                </p>
              </div>

              <span className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
                Latest {recentExpenses.length}
              </span>
            </div>

            {recentExpenses.length === 0 ? (
              <EmptyState
                title="No expenses recorded yet"
                description="Your latest transactions will appear here when you start recording your expenses."
              />
            ) : (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        <th className="px-7 py-4">Transaction</th>
                        <th className="px-5 py-4">Category</th>
                        <th className="px-5 py-4">Date</th>
                        <th className="px-7 py-4 text-right">Amount</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {recentExpenses.map((expense) => {
                        const meta =
                          categoryMeta[expense.category] || categoryMeta.other;

                        return (
                          <tr
                            key={expense.id}
                            className="transition hover:bg-slate-50/70"
                          >
                            <td className="px-7 py-4">
                              <div className="flex items-center gap-3">
                                <span
                                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${meta.color}`}
                                >
                                  {meta.icon}
                                </span>

                                <div className="min-w-0">
                                  <p className="max-w-xs truncate text-sm font-semibold text-slate-800">
                                    {expense.description?.trim() ||
                                      meta.label}
                                  </p>
                                  <p className="mt-1 text-xs text-slate-400">
                                    Expense #{expense.id}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${meta.dot}`}
                                />
                                {meta.label}
                              </span>
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                              {formatDate(expense.expense_date)}
                            </td>

                            <td className="whitespace-nowrap px-7 py-4 text-right text-sm font-semibold text-slate-900">
                              {formatMoney(expense.amount)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile transaction cards */}
                <div className="divide-y divide-slate-100 md:hidden">
                  {recentExpenses.map((expense) => {
                    const meta =
                      categoryMeta[expense.category] || categoryMeta.other;

                    return (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between gap-3 px-5 py-4"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${meta.color}`}
                          >
                            {meta.icon}
                          </span>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">
                              {expense.description?.trim() || meta.label}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {meta.label} · {formatDate(expense.expense_date)}
                            </p>
                          </div>
                        </div>

                        <p className="shrink-0 text-sm font-semibold text-slate-900">
                          {formatMoney(expense.amount)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </section>

          <footer className="flex flex-col gap-2 py-8 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 ExpenseFlow. Your finances, in focus.</p>
            <p>Signed in as {user.email}</p>
          </footer>
        </div>
      </main>
    </div>
  );
}