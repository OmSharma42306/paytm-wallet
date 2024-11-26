"use client";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Center } from "@repo/ui/center";
import { Select } from "@repo/ui/select";
import { TextInput } from "@repo/ui/textinput";
import { redirect } from "next/dist/server/api-utils";
import { useState } from "react";

const SUPPORTED_BANKS = [
  {
    name: "HDFC BANK",
    redirectUrl: "https://netbanking.hdfc.com",
  },
  {
    name: "State Bank of India",
    redirectUrl: "https://netbanking.sbi.com",
  },
  {
    name: "Axis Bank",
    redirectUrl: "https://netbanking.axisbank.com",
  },
]; // list of objects , and each object represent a bank


export const Addmoney = () => {
    const [redirectUrl,setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
    return <Card title="Add Money">
        <div className="w-full">
            <TextInput label={"Amount"} placeholder={"Amount"} onChange={(e)=>{}}></TextInput>
            <div className="py-4 text-left">
                Bank
            </div>
            <Select onSelect={(value)=>{
                setRedirectUrl(SUPPORTED_BANKS.find(x=>x.name === value)?.redirectUrl || "")
            }} options={SUPPORTED_BANKS.map(x=>({
                key:x.name,
                value:x.name
            }))}/>

            <div className="flex justify-center pt-4">
                <Button onClick={()=>{
                    window.location.href = redirectUrl || "";
                }}>Add Money</Button>

            </div>
        </div>

    </Card>
}