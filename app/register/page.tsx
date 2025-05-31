"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpWithEmailApi } from "@/lib/authApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    if (!formData.username.trim()) {
      setErrorMessage("Username is required.");
      setIsLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage("Email is required.");
      setIsLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      setErrorMessage("Password is required.");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const { success, error } = await signUpWithEmailApi(
        formData.email,
        formData.password,
        formData.username
      );

      if (!success) {
        throw new Error(error || "Registration failed");
      }

      setSuccessMessage("Account created successfully! Redirecting...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      setErrorMessage(error.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create a new account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input
                type="text"
                name="username"
                placeholder="Enter your username"
                className="w-full"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                className="w-full"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
            {successMessage && (
              <p className="text-green-500 text-sm">{successMessage}</p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm">
              Already have an account?{" "}
              <Link href="/login" className="hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
