"use client"
import { getServerSession } from "next-auth";
import {redirect} from "next/navigation"
import { AppbarClient } from "./AppbarClient";
import { authOptions } from "./lib/auth";
export default async function Page(): JSX.Element {
  
  return (
   <div>
    <AppbarClient/>
   </div>
  );
}
