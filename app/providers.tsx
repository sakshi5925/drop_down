import { ThemeProvider as NextThemesProvider } from "next-themes"
import {ImageKitProvider} from "imagekitio-next"
import type { ThemeProviderProps } from "next-themes"
import {HeroUIProvider} from "@heroui/react";
export interface Providerprops{
  children:React.ReactNode,
  themeProps?: ThemeProviderProps
}

const authenticator=async ()=>{
    try {
        
      const   response = await fetch("/api/imagekit-auth");
      const data= await response.json();
      return data;
    } catch (error) {
        console.error("authentication error",error);
        throw error;
    }
}


export function providers({children,themeProps}: Providerprops){
   return 
   
    <ImageKitProvider authenticator={authenticator} publicKey={process.env.IMAGEKIT_PUBLIC_KEY ||""} urlEndpoint={process.env.IMAGEKIT_END_URL||""}>
      <HeroUIProvider>
    {children}
    </HeroUIProvider>
    </ImageKitProvider>
    
}