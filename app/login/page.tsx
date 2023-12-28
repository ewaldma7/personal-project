'use client'

import { useState } from "react"
import axios from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const validPassword = true; //NEED TO CHANGE

  const logIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      username: email,
      password: password,
      redirect: true,
      callbackUrl: "/dashboard"
    });
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Log in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={logIn}>

            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className={(validPassword ? "bg-indigo-600 hover:bg-indigo-500  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600" : "bg-indigo-300 hover:bg-indigo-300") + "flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm"}
                disabled={!validPassword}
              >
                Login
              </button>
            </div>
          </form>
          <div className="mt-4 flex justify-between">
            <p>Don't have an account?</p>
            <Link href="/register" className="text-indigo-600 hover:underline">
              Register here.
            </Link>
          </div>
          <div className="flex justify-center py-4">
            <Link href="/">
              <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 mb-2 px-4 rounded">
                Back to Main Page
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
