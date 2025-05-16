"use client"

import { useForm } from "react-hook-form"
import { useSignIn,  useAuth } from "@clerk/clerk-react"
import { z } from "zod"
import { signinSchema } from "@/schema/signin"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardBody, CardFooter, Divider, Input, Button } from "@nextui-org/react"
import Link from "next/link"

export default function SignInForm() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      "identifier": "",
      "password": ""
    }
  })
 const { isSignedIn, signOut } = useAuth()
  const { signIn, isLoaded, setActive } = useSignIn()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const onSubmit = async (data: z.infer<typeof signinSchema>) => {
   
    if (!isLoaded) return
    setIsSubmitting(true)
    setAuthError(null)

    if (isSignedIn) {
    await signOut() // Or optionally redirect to dashboard directly
}
    try {
      const result = await signIn.create({
        identifier: data.identifier,
        password: data.password
      })
      if (result.status == "complete") {
        await setActive({ session: result.createdSessionId })
        router.push("/dashboard")
      } else {
        console.error("Error in sign in", result)
        setAuthError("Unable to complete sign in. Please try again.")
      }
    } catch (error: any) {
      console.error("error in sign in", error)
      setAuthError(error.errors?.[0]?.message || "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f4f8] to-[#d9e2ec] p-4">
      <Card className="w-full max-w-[420px] p-6 shadow-2xl rounded-3xl border border-gray-200 backdrop-blur-md bg-white/70">
        <CardHeader className="flex flex-col gap-2 items-center">
          <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-sm text-gray-500">Login to your account</p>
        </CardHeader>

        <Divider className="my-3" />

        <CardBody className="space-y-4">
          {authError && <p className="text-red-500 text-sm">{authError}</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-black">
            <Input
              isRequired
              errorMessage={errors.identifier?.message}
              label="Email"
              labelPlacement="outside"
              placeholder="Enter your email"
              type="email"
              {...register("identifier")}
              className="rounded-lg"
            />

            <Input
              isRequired
              errorMessage={errors.password?.message}
              label="Password"
              labelPlacement="outside"
              placeholder="Enter your password"
              type="password"
              {...register("password")}
              className="rounded-lg"
            />

            <div className="flex gap-3">
              <Button
                className="w-full rounded-xl shadow-lg"
                color="primary"
                type="submit"
                isLoading={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
              <Button type="reset" variant="bordered" className="w-28 rounded-xl">Reset</Button>
            </div>
          </form>
        </CardBody>

        <Divider className="my-3" />

        <CardFooter className="flex justify-center gap-1">
          <span className="text-sm text-gray-500">Don't have an account?</span>
          <Link href="/sign-up" className="text-blue-600 text-sm font-semibold hover:underline">
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
