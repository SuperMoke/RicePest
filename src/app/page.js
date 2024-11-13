"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);

      router.push("/user"); // Redirect to dashboard after successful login
    } catch (error) {
      setError(
        error.code === "auth/wrong-password" ||
          error.code === "auth/user-not-found"
          ? "Invalid email or password"
          : "An error occurred during sign in"
      );
      console.error("Error during sign in:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/MAIN.png')] bg-cover bg-center bg-no-repeat">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <Image
            className="mx-auto dark:invert"
            src="/RPLogo.png"
            alt="RPLogo"
            width={120}
            height={30}
            priority
          />
          <h2 className="mt-6 text-3xl font-bold">Sign in to your account</h2>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <div className="space-y-4">
              <div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-green-800">
              Sign in
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-green-800 hover:text-green-700 font-semibold"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
