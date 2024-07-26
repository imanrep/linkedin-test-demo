import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home(p : RouterParam) {
  const { connected, connectMetamask, address, balance, chainId, userId, disconnectMetamask } = p
  
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Metamask Login With Web3.js
        </p>
      </div>

    {connected ? (
      

<div className="relative overflow-x-auto">
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="px-6 py-3">
                    ChainId
                </th>
                <th scope="col" className="px-6 py-3">
                    Address 
                </th>
                <th scope="col" className="px-6 py-3">
                    Balance
                </th>
                <th scope="col" className="px-6 py-3">
                    userId
                </th>
            </tr>
        </thead>
        <tbody>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {chainId}
                </th>
                <td className="px-6 py-4">
                    {address}
                </td>
                <td className="px-6 py-4">
                    {balance.toFixed(3)} ETH
                </td>
                <td className="px-6 py-4">
                    {userId}
                </td>
            </tr>
         
        </tbody>
    </table>
</div>

    )
    : (
      <div className="flex">
        <h3>Please connect your address first</h3>
      </div>
    )}

      <div className="cursor-pointer">

        {connected ? (
           <div
           className="border-gray-100 group rounded-lg border px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
           onClick={disconnectMetamask}
         >
           <h2 className={`text-2xl font-semibold`}>
             Disconnect
           </h2>
 
         </div>

        ): (
          <div
          className="border-gray-100 group rounded-lg border px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          onClick={connectMetamask}
        >
          <h2 className={`text-2xl font-semibold`}>
            Login With Metamask
          </h2>

        </div>
        )}
      </div>
    </main>
  );
}
