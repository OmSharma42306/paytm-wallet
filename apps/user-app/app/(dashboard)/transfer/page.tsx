import prisma from "@repo/db/client"
import { Addmoney } from "../../../components/AddMoneyCard"
import { BalanceCard } from "../../../components/BalanceCard"
import { OnRampTransactions } from "../../../components/OnRampTransaction"
import { getServerSession } from "next-auth"
import { authOptions } from "../../lib/auth" 

//my thinking is i don't make any database queriying in client side on file.tsx, so in file.tsx if i use getServerSession , i think i can make the operation on database 
// answer: 
// Your thinking is correct and aligns with best practices. By using getServerSession in your .tsx file or API routes, you ensure that all database operations are securely executed server-side, even if the resulting data is ultimately rendered in your React components.


async function getBalance () {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where:{
            userId:Number(session?.user?.id)
        }
    });

    return {
        amount : balance?.amount || 0,
        locked : balance?.locked || 0
    }
}

async function getOnRampTransactions(){
const session = await getServerSession(authOptions);
const txns = await prisma.onRampTransaction.findMany({
    where:{
        userId : Number(session?.user?.id )
    }
});

return txns.map(t=>({
    time : t.startTime,
    amount : t.amount,
    status : t.status,
    provider : t.provider
}))

}


export default async function (){
    const balance = await getBalance();
    const transactions = await getOnRampTransactions();
    return <div className="w-screen">

<div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            Transfer
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <div>
                <Addmoney />
            </div>
            <div>
                <BalanceCard amount={balance.amount} locked={balance.locked} />
                <div className="pt-4">
                    <OnRampTransactions transactions={transactions} />
                </div>
            </div>
        </div>
    </div>
}