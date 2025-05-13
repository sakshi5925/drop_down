"use client"
import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/clerk-react";
import {z} from "zod";
import {signupSchema} from "@/schema/signup";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { is } from "drizzle-orm";
import { useRouter } from "next/router";

export default  function SignUpForm(){
const router=useRouter()
const { register, handleSubmit, watch, formState: { errors } } = useForm<z.infer<typeof signupSchema>>({resolver:zodResolver(signupSchema),
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

if(!Verifying){
    return <h2>Enter otp for verification</h2>
}

return <h2>Signup form with all </h2>



}