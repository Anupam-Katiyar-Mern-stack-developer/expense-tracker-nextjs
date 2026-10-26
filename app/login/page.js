import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign In | ExpenseFlow",
  description: "Sign in to your private ExpenseFlow account.",
};

function WalletIcon({ className = "h-6 w-6" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H20v14H6.5A2.5 2.5 0 0 1 4 16.5v-9Z" />
      <path d="M4 8h16M15 13h2" strokeLinecap="round" />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#f5f7fb] lg:grid lg:grid-cols-2">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#101828] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="absolute -left-32 top-32 h-80 w-80 rounded-full bg-indigo-500/20 blur-[100px]" />
        <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-[100px]" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-600 shadow-lg shadow-indigo-500/20">
            <WalletIcon />
          </div>
          <span className="text-xl font-bold tracking-tight">ExpenseFlow</span>
        </div>

        <div className="relative z-10 max-w-xl py-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Welcome back
          </div>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            Your money,
            <span className="mt-2 block bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              back in focus.
            </span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
            Pick up where you left off. Keep your expenses organized, understand
            your spending, and make more confident decisions.
          </p>

          <div className="mt-12 max-w-md rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Your finances, simplified
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  Every rupee counts.
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-400/15 text-indigo-300">
                <WalletIcon />
              </div>
            </div>

            <div className="mt-7 space-y-4">
              {[
                ["Private by design", "Your account, your expenses"],
                ["Clear insights", "Understand where money goes"],
                ["Better habits", "Make informed spending choices"],
              ].map(([title, description]) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-4 w-4"
                    >
                      <path
                        d="m5 12 4 4L19 6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-100">
                      {title}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-sm text-slate-500">
          <span>© 2026 ExpenseFlow</span>
          <span>Built for better money habits</span>
        </div>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-20">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20">
              <WalletIcon />
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
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-6 w-6"
              >
                <path
                  d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
                  strokeLinecap="round"
                />
                <path
                  d="m10 17 5-5-5-5m5 5H3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600">
              Welcome back
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Sign in to ExpenseFlow
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Enter your account details to continue to your personal expense
              dashboard.
            </p>
          </div>

          <LoginForm />

          <p className="mt-8 text-center text-xs leading-5 text-slate-400">
            Your account is protected with a secure, HTTP-only session cookie.
          </p>
        </div>
      </section>
    </main>
  );
}
