"use client"
import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/clerk-react";
import {z} from "zod";
import {signupSchema} from "@/schema/signup";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardBody, CardFooter, Divider, Input, Button } from "@nextui-org/react";



import { useRouter } from "next/router";

import Link from "next/link";

export default  function SignUpForm(){
const router=useRouter()
const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof signupSchema>>({resolver:zodResolver(signupSchema),
    defaultValues:{
        email:"",
        password:"",
        passwordconfirmation:""
    }
});
const {signUp, isLoaded,setActive}=useSignUp();
const [Verifying, setVerifying] = useState(false);
const [isSubmitting, setisSubmitting] = useState(false);
const [authError, setauthError] = useState(null)
const [verificationCode, setverificationCode] = useState("")
const [verificationerror, setverificationerror] = useState<string |null>(null)

const onSubmit=async (data: z.infer<typeof signupSchema>)=>{
      if(!isLoaded) return;
      setisSubmitting(true);
      setauthError(null);
      try {
       await signUp.create({
            emailAddress:data.email,
            password:data.password
        })
       await signUp.prepareEmailAddressVerification({
        strategy:"email_code",
       })
        setVerifying(true);
      } catch (error:any) {
        console.error("Signup error",error);
        setauthError(
            error.errors?.[0].message||"An error in signUp"
        )
      }
      finally{
        setisSubmitting(false);
      }

}
const handleVerification= async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
      if(!isLoaded || !signUp) return
      setVerifying(true);
      setauthError(null);
      try {
        
      const result=  await signUp.attemptEmailAddressVerification({
            code:verificationCode
        })

        if(result.status==="complete"){
            await setActive({session:result.createdSessionId});
            router.push("/dashboard")

        }
        else{
            console.error("verification incomplete",result);
            setverificationerror("verification error")
        }
      } catch (error:any) {
          console.error("verification incomplete",error);
        setverificationerror(
            error.errors?.[0].message||"An error in verification"
        )
      }
      finally{
        setisSubmitting(false);
      }


};

 if (Verifying) {
    return (
      <Card className="max-w-[400px]">
        <CardHeader className="flex gap-3">
          <div className="flex flex-col">
            <p className="text-md">Verify your Email</p>
            <p className="text-small text-default-500">We have sent a verification code to your email</p>
            {verificationerror && <p className="text-red-500">{verificationerror}</p>}
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <form onSubmit={handleVerification} className="space-y-4">
            <Input
              label="Verification Code"
              labelPlacement="outside"
              placeholder="Enter your 6-digit code"
              value={verificationCode}
              onChange={(e:any) => setverificationCode(e.target.value)}
            />
            <Button type="submit" variant="flat" isLoading={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Verify Email"}
            </Button>
          </form>
          <Divider />
          <p>Didn't receive a code?</p>
          <Button onClick={async () =>{if(signUp) await signUp.prepareEmailAddressVerification({ strategy: "email_code" })}}>
            Resend Code
          </Button>
        </CardBody>
      </Card>
    );
  }

 return (
    <Card className="max-w-[400px]">
        <CardHeader>
         <p className="text-md">Create your account</p>
        </CardHeader>
        <CardBody className="py-4">
     {authError && <p className="text-red-500">{authError}</p>}
      <form className="w-full justify-center items-center space-y-4 p-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          isRequired
          errorMessage={errors.email?.message}
          label="Email"
          labelPlacement="outside"
          placeholder="Enter your email"
          type="email"
          {...register("email")}
        />

        <Input
          isRequired
          errorMessage={errors.password?.message}
          label="Password"
          labelPlacement="outside"
          placeholder="Enter your password"
          type="password"
          {...register("password")}
        />

        <Input
          isRequired
          errorMessage={errors.passwordconfirmation?.message}
          label="Confirm Password"
          labelPlacement="outside"
          placeholder="Confirm your password"
          type="password"
          {...register("passwordconfirmation")}
        />

        <p>Agree to all the terms and conditions</p>

        <div className="flex gap-4">
          <Button className="w-full" color="primary" type="submit" isLoading={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>
      
        </div>
      </form>
      </CardBody>
      <Divider />
      <CardFooter>
        <p>Already have an account?</p>
        <Link href="/signin" className="text-blue-600 ml-2">Sign in</Link>
      </CardFooter>
    </Card>
  );
  




}