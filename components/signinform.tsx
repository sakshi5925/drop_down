"use client"

import { useForm } from "react-hook-form"
import {useSignIn} from "@clerk/clerk-react";
import { z } from "zod";
import { signinSchema } from "@/schema/signin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/router";
import { Card, CardHeader, CardBody, CardFooter, Divider, Input, Button } from "@nextui-org/react";
import Link from "next/link";

export default function SignInForm(){
    const router =useRouter();
  const  {register, handleSubmit, formState: { errors }}=useForm({
    resolver:zodResolver(signinSchema),
    defaultValues:{
         "identifier":"",
         "password":""
    }
})
  const {signIn,isLoaded,setActive}=useSignIn();
  const [Verifying, setVerifying] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [authError, setauthError] = useState<string |null>(null)
  const onSubmit=async(data:z.infer<typeof signinSchema>)=>{
    if(!isLoaded) return;
    setisSubmitting(true);
    setauthError(null);
    try {
        
     const result =signIn.create({
            identifier:data.identifier,
            password:data.password
     })
      if((await result).status=="complete"){
            await setActive({session:(await result).createdSessionId})
            router.push("/dashboard")

        }
          else{
            console.error("error in sign in",result);
        }
     
    } catch (error:any) {
         console.error("error in sign in", error);
         setauthError(error);
    } 
    finally{
         setisSubmitting(false);
    }

  }





    return (
    <Card className="max-w-[400px]">
        <CardHeader>
         <p className="text-md">Login to your account</p>
        </CardHeader>
        <CardBody className="py-4">
     {authError && <p className="text-red-500">{authError}</p>}
      <form className="w-full justify-center items-center space-y-4 p-4" onSubmit={handleSubmit(onSubmit)}>
        <Input
          isRequired
          errorMessage={errors.identifier?.message}
          label="Email"
          labelPlacement="outside"
          placeholder="Enter your email"
          type="email"
          {...register("identifier")}
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

        <div className="flex gap-4">
          <Button className="w-full" color="primary" type="submit" isLoading={isSubmitting}>
            {isSubmitting ? "Logging Account..." : "Login Account"}
          </Button>
          <Button type="reset" variant="bordered">Reset</Button>
        </div>
      </form>
      </CardBody>
      <Divider />
      <CardFooter>
        <p>Don't have account?</p>
        <Link href="/signup" className="text-blue-600 ml-2">Sign up</Link>
      </CardFooter>
    </Card>
  );
}


