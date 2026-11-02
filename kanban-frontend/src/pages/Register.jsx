
import React, { Component } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

class Register extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    error: "",
    success: "",
    loading: false,
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      error: "",
      success: "",
    });
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    const { name, email, password, confirmPassword } = this.state;

    if (password !== confirmPassword) {
      this.setState({ error: "Passwords do not match." });
      return;
    }

    if (password.length < 8) {
      this.setState({ error: "Password must contain at least 8 characters." });
      return;
    }

    this.setState({ loading: true, error: "", success: "" });

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      this.setState({
        success: "Registration successful! You can now sign in.",
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      this.setState({
        error:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <div className="min-h-screen grid lg:grid-cols-2 bg-white">

        {/* Left section */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800 p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-white/20 flex items-center justify-center text-2xl font-bold">
              K
            </div>
            <span className="text-2xl font-bold">KanbanFlow</span>
          </div>

          <div className="max-w-lg">
            <p className="text-purple-200 font-semibold mb-4">
              YOUR WORKSPACE STARTS HERE
            </p>

            <h1 className="text-5xl font-bold leading-tight mb-6">
              Great teamwork
              <br />
              starts with clarity.
            </h1>

            <p className="text-lg text-purple-100 leading-8">
              Bring your team together, organize projects, and
              make progress visible to everyone.
            </p>
          </div>

          <p className="text-sm text-purple-200">
            © 2026 KanbanFlow. All rights reserved.
          </p>
        </div>

        {/* Right section */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-12">
          <div className="w-full max-w-md">

            <div className="lg:hidden flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-violet-600 text-white flex items-center justify-center text-xl font-bold">
                K
              </div>
              <span className="text-xl font-bold text-gray-900">
                KanbanFlow
              </span>
            </div>

            <div className="mb-7">
              <p className="text-sm font-semibold text-violet-600 mb-3">
                GET STARTED
              </p>

              <h2 className="text-3xl font-bold text-gray-900">
                Create your account
              </h2>

              <p className="text-gray-500 mt-3">
                Sign up to start organizing your projects.
              </p>
            </div>

            {this.state.error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {this.state.error}
              </div>
            )}

            {this.state.success && (
              <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {this.state.success}
                {" "}
                <Link to="/" className="font-semibold underline">
                  Login now
                </Link>
              </div>
            )}

            <form onSubmit={this.handleSubmit} className="space-y-4">

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={this.state.name}
                  onChange={this.handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email address
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={this.state.email}
                  onChange={this.handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  name="password"
                  placeholder="Minimum 8 characters"
                  value={this.state.password}
                  onChange={this.handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm password
                </label>

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={this.state.confirmPassword}
                  onChange={this.handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <button
                type="submit"
                disabled={this.state.loading}
                className="w-full rounded-xl bg-violet-600 py-3.5 font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700 disabled:opacity-60"
              >
                {this.state.loading ? "Creating account..." : "Create account"}
              </button>

            </form>

            <p className="text-center text-sm text-gray-500 mt-7">
              Already have an account?{" "}
              <Link
                to="/"
                className="font-semibold text-violet-600 hover:text-violet-800"
              >
                Sign in
              </Link>
            </p>

          </div>
        </div>
      </div>
    );
  }
}

export default Register;
