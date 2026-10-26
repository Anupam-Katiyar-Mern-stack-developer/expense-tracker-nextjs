
"use client";

import { useActionState, useState } from "react";
import { loginUser } from "@/app/login/actions";

const initialState = {
  success: false,
  message: "",
  errors: {},
};

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginUser,
    initialState
  );

  const [showPassword, setShowPassword] = useState(false);
  const [editedFields, setEditedFields] = useState({});

  const inputClass =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

  function handleChange(event) {
    const { name } = event.target;

    setEditedFields((previous) => ({
      ...previous,
      [name]: true,
    }));
  }

  function fieldError(field) {
    return editedFields[field] ? "" : state.errors?.[field] || "";
  }

  function renderError(field) {
    const error = fieldError(field);

    return error ? (
      <p className="mt-2 text-xs font-medium text-red-600" role="alert">
        {error}
      </p>
    ) : null;
  }

  return (
    <form
      action={formAction}
      onSubmit={() => setEditedFields({})}
      noValidate
      className="space-y-5"
    >
      <div>
        <label
          htmlFor="email"
          className="text-sm font-medium text-slate-700"
        >
          Email address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={255}
          required
          placeholder="you@example.com"
          onChange={handleChange}
          aria-invalid={Boolean(fieldError("email"))}
          className={inputClass}
        />

        {renderError("email")}
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-700"
          >
            Password
          </label>

          <span className="text-xs text-slate-400">
            Keep it private
          </span>
        </div>

        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="Enter your password"
            onChange={handleChange}
            aria-invalid={Boolean(fieldError("password"))}
            className={`${inputClass} pr-20`}
          />

          <button
            type="button"
            onClick={() => setShowPassword((previous) => !previous)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {renderError("password")}
      </div>

      {state.message && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
        >
          {state.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/25 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Signing you in..." : "Sign in to your account"}

        {!isPending && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M5 12h14m-6-6 6 6-6 6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      <p className="text-center text-sm text-slate-500">
        New to ExpenseFlow?{" "}
        <a
          href="/register"
          className="font-semibold text-indigo-600 transition hover:text-indigo-800"
        >
          Create an account
        </a>
      </p>
    </form>
  );
}
