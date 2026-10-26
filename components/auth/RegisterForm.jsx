
"use client";

import { useActionState, useEffect, useState } from "react";
import { registerUser } from "@/app/register/actions";

const initialState = {
    success: false,
    message: "",
    errors: {},
};

const initialForm = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
};

export default function RegisterForm() {
    const [state, formAction, isPending] = useActionState(
        registerUser,
        initialState
    );

    const [form, setForm] = useState(initialForm);
    const [editedFields, setEditedFields] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (state.success) {
            setForm(initialForm);
            setEditedFields({});
        }
    }, [state.success]);

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setEditedFields((previous) => ({
            ...previous,
            [name]: true,
        }));
    }

    function fieldError(field) {
        if (editedFields[field]) return null;
        return state.errors?.[field] || null;
    }

    const inputClass =
        "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10";

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
                    htmlFor="name"
                    className="text-sm font-medium text-slate-700"
                >
                    Full name
                </label>

                <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    maxLength={100}
                    placeholder="e.g. Rahul Sharma"
                    value={form.name}
                    onChange={handleChange}
                    className={inputClass}
                    aria-invalid={Boolean(fieldError("name"))}
                />

                {renderError("name")}
            </div>

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
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass}
                    aria-invalid={Boolean(fieldError("email"))}
                />

                {renderError("email")}
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-700"
                >
                    Password
                </label>

                <div className="relative">
                    <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="At least 8 characters"
                        value={form.password}
                        onChange={handleChange}
                        className={`${inputClass} pr-20`}
                        aria-invalid={Boolean(fieldError("password"))}
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword((previous) => !previous)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>

                {renderError("password")}

                <p className="mt-2 text-xs text-slate-400">
                    Use at least 8 characters.
                </p>
            </div>

            <div>
                <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-slate-700"
                >
                    Confirm password
                </label>

                <div className="relative">
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Enter your password again"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className={`${inputClass} pr-20`}
                        aria-invalid={Boolean(fieldError("confirmPassword"))}
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setShowConfirmPassword((previous) => !previous)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                    >
                        {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                </div>

                {renderError("confirmPassword")}
            </div>

            {state.message && (
                <div
                    role={state.success ? "status" : "alert"}
                    className={`rounded-xl border px-4 py-3 text-sm leading-6 ${state.success
                            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                            : "border-red-200 bg-red-50 text-red-700"
                        }`}
                >
                    {state.message}
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/25 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {isPending ? "Creating account..." : "Create account"}

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
                Already have an account?{" "}
                <a
                    href="/login"
                    className="font-semibold text-indigo-600 transition hover:text-indigo-800"
                >
                    Sign in
                </a>
            </p>
        </form>
    );
}
