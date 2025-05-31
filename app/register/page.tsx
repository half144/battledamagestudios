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
import { Mail, CheckCircle } from "lucide-react";

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
  const [isRegistered, setIsRegistered] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
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

      setIsRegistered(true);
    } catch (error: any) {
      setErrorMessage(error.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-[400px]">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-green-600">
              Registration Successful!
            </CardTitle>
            <CardDescription>
              Please check your email to verify your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Confirmation email sent to:</span>
              </div>
              <p className="font-medium">{formData.email}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the confirmation link in the email</li>
                <li>Return here to sign in to your account</li>
              </ol>
            </div>

            <div className="space-y-2">
              <Button onClick={() => router.push("/login")} className="w-full">
                Go to Sign In
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsRegistered(false)}
                className="w-full"
              >
                Register Another Account
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                Didn't receive the email?{" "}
                <button
                  onClick={() => {
                    // Here you could implement resend functionality
                    alert(
                      "Please wait a few minutes and check your spam folder. If you still don't receive it, try registering again."
                    );
                  }}
                  className="text-primary hover:underline"
                >
                  Contact support
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
