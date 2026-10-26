import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Create Account | ExpenseFlow",
  description: "Create your private ExpenseFlow account.",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#f5f7fb] lg:grid lg:grid-cols-2">
      {/* Left premium hero section */}
      <section className="relative hidden min-h-screen overflow-hidden bg-[#101828] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="absolute -left-32 top-32 h-80 w-80 rounded-full bg-indigo-500/20 blur-[100px]" />
        <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-[100px]" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-600 shadow-lg shadow-indigo-500/20">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H20v14H6.5A2.5 2.5 0 0 1 4 16.5v-9Z" />
              <path d="M4 8h16M15 13h2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">ExpenseFlow</span>
        </div>

        <div className="relative z-10 max-w-xl py-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Your money. Your clarity.
          </div>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            Make every rupee
            <span className="mt-2 block bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              count for more.
            </span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
            Build better money habits with a clear view of your spending,
            smarter insights, and a little more peace of mind.
          </p>

          {/* Decorative dashboard preview */}
          <div className="mt-12 max-w-md rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Monthly overview</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  ₹24,680
                </p>
              </div>
              <div className="rounded-xl bg-emerald-400/10 px-3 py-2 text-sm font-medium text-emerald-300">
                + clarity
              </div>
            </div>

            <div className="mt-7 flex h-24 items-end gap-3">
              {[38, 56, 44, 76, 50, 88, 63, 72, 45, 94, 65, 80].map(
                (height, index) => (
                  <div
                    key={index}
                    className={`flex-1 rounded-t-md ${
                      index === 9 ? "bg-indigo-400" : "bg-white/15"
                    }`}
                    style={{ height: `${height}%` }}
                  />
                ),
              )}
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm">
              <span className="text-slate-400">Spending overview</span>
              <span className="text-slate-300">Illustrative preview</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-sm text-slate-500">
          <span>© 2026 ExpenseFlow</span>
          <span>Built for better money habits</span>
        </div>
      </section>

      {/* Right registration section */}
      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-20">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H20v14H6.5A2.5 2.5 0 0 1 4 16.5v-9Z" />
                <path d="M4 8h16M15 13h2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              ExpenseFlow
            </span>
          </div>

          <div className="mb-8">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                  strokeLinecap="round"
                />
                <circle cx="10" cy="7" r="4" />
                <path d="M19 8v6m-3-3h6" strokeLinecap="round" />
              </svg>
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600">
              Get started for free
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Create your account
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              A few details and you’re ready to take control of your spending.
            </p>
          </div>

          <RegisterForm />

          <p className="mt-8 text-center text-xs leading-5 text-slate-400">
            Your financial data should be private. We’ll connect secure account
            handling in the next step.
          </p>
        </div>
      </section>
    </main>
  );
}
