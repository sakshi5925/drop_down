"use client";

// 📦 Importing necessary hooks, libraries, and components
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/clerk-react";
import { useSignUp } from "@clerk/clerk-react";
import { z } from "zod";
import { signupSchema } from "@/schema/signup";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Input,
  Button,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpForm() {
  // 📌 Next.js router for programmatic navigation
  const router = useRouter();

  // 📌 Form handling using react-hook-form with Zod validation schema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordconfirmation: "",
    },
  });

  // 📌 Clerk SignUp hook to handle signup process
  const { signUp, isLoaded, setActive } = useSignUp();

  // 📌 Local state for managing form status and feedback messages
  const [verifying, setVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // 📌 Form submit handler for signup
  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    if (!isLoaded) return;
    setIsSubmitting(true);
    setAuthError(null);

    try {
      // 👤 Create a new user with Clerk
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      // 📩 Trigger email verification step
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifying(true);
    } catch (error: any) {
      console.error("Signup error", error);
      setAuthError(error.errors?.[0].message || "An error occurred during sign up.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 📌 Handler for verifying the email with the code entered by user
  const handleVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;
    setIsSubmitting(true);
    setAuthError(null);
    setVerificationError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code: verificationCode });

      if (result.status === "complete") {
        // ✅ Set active session and redirect to dashboard if verification successful
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        console.error("Verification incomplete", result);
        setVerificationError("Invalid or expired code. Please try again.");
      }
    } catch (error: any) {
      console.error("Verification error", error);
      setVerificationError(error.errors?.[0].message || "An error occurred during verification.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 📌 UI for Email Verification step after signup
  if (verifying) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
        <Card className="max-w-[420px] shadow-2xl border-none rounded-3xl p-6 bg-white/80 backdrop-blur-md">
          <CardHeader className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-center text-blue-700">Verify your Email 📩</h2>
            <p className="text-sm text-center text-gray-600">
              We've sent a 6-digit verification code to your email.
            </p>
            {/* 📌 Error message display */}
            {verificationError && <p className="text-red-500 text-center">{verificationError}</p>}
          </CardHeader>
          <Divider />
          <CardBody>
            <form onSubmit={handleVerification} className="space-y-6">
              {/* 📌 Input field for verification code */}
              <Input
                isRequired
                label="Verification Code"
                labelPlacement="outside"
                placeholder="Enter your 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              {/* 📌 Verify button */}
              <Button type="submit" color="primary" fullWidth isLoading={isSubmitting} radius="lg">
                {isSubmitting ? "Verifying..." : "Verify Email"}
              </Button>
            </form>
            <Divider className="my-6" />
            {/* 📌 Resend code button */}
            <Button
              variant="flat"
              color="secondary"
              fullWidth
              onClick={async () => {
                if (signUp) {
                  try {
                    await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
                  } catch (err) {
                    console.error("Resend code error", err);
                  }
                }
              }}
            >
              Resend Code
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  // 📌 UI for SignUp form (before verification)
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <Card className="max-w-[420px] shadow-2xl border-none rounded-3xl p-6 bg-white/80 backdrop-blur-md">
        <CardHeader className="flex flex-col items-center gap-2">
          <h2 className="text-3xl font-extrabold text-blue-700">Create Account 🚀</h2>
          <p className="text-sm text-gray-600 text-center">Start your journey with us today!</p>
        </CardHeader>
        <CardBody className="py-6">
          {/* 📌 Error message display */}
          {authError && <p className="text-red-500 text-center">{authError}</p>}

          {/* 📌 Signup form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-black">
            {/* 📌 Email input */}
            <Input
              isRequired
              errorMessage={errors.email?.message}
              label="Email"
              labelPlacement="outside"
              placeholder="Enter your email"
              type="email"
              {...register("email")}
            />
            {/* 📌 Password input */}
            <Input
              isRequired
              errorMessage={errors.password?.message}
              label="Password"
              labelPlacement="outside"
              placeholder="Enter your password"
              type="password"
              {...register("password")}
            />
            {/* 📌 Confirm password input */}
            <Input
              isRequired
              errorMessage={errors.passwordconfirmation?.message}
              label="Confirm Password"
              labelPlacement="outside"
              placeholder="Confirm your password"
              type="password"
              {...register("passwordconfirmation")}
            />
            {/* 📌 Terms message */}
            <p className="text-xs text-gray-500 text-center">
              By signing up, you agree to our <span className="text-blue-600 font-medium">Terms & Conditions</span>.
            </p>
            {/* 📌 Submit button */}
            <Button color="primary" type="submit" fullWidth isLoading={isSubmitting} radius="lg">
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardBody>
        <Divider />
        {/* 📌 Footer with link to Sign In */}
        <CardFooter className="flex justify-center gap-2 text-sm text-gray-600">
          <span>Already have an account?</span>
          <Link href="/sign-in" className="text-blue-600 font-semibold">
            Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
