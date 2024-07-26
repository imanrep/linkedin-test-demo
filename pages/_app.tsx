import "@/styles/globals.css";
import { useEffect, useState } from "react";
import Web3 from 'web3'
import BigNumber from 'bignumber.js'

export default function App(p: RouterParam) {
  const { Component } = p

  const [connected, setConnected] = useState<boolean>(false);
  const [web3, setWeb3] = useState<Web3>(new Web3());
  const [address, setAddress] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const [chainId, setChainId] = useState<number>(0);
  const [userId, setUserId] = useState<string>("");

  function parseJwt(token: string): any {
    
    var base64Payload = token.split('.')[1];
    var payload = Buffer.from(base64Payload, 'base64');
    return JSON.parse(payload.toString());
  }

  p = {
    ...p,
    connected,
    connectMetamask,
    address,
    web3,
    balance,
    chainId,
    userId,
    disconnectMetamask
  }

   function disconnectMetamask() {
    localStorage.removeItem("user_token")
    setConnected(false)
    setAddress("")
    setWeb3(new Web3())
    setBalance(0)
    setChainId(0)
    setUserId("")
  }

  async function signMessage(address: string, web3: Web3) {
    const mes = await (await fetch("/api/sign", {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
        req: 'getSignMessage'
      }),
    })).json()

    if (mes.status) {
      const token = await web3.eth.personal.sign(mes.message, address, "")
      const valid = await fetch("/api/sign", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          msg: mes.message,
          address,
          req: 'login',
        })
      })
      const res = await valid.json()
      if (res.status) {
      const web3 = new Web3(window.ethereum)
      localStorage.setItem("user_token", res.token)
        const jwt = parseJwt(res.token)
        setAddress(jwt.address)
        setWeb3(web3)
        setConnected(true)
        const bal = await web3.eth.getBalance(jwt.address)
        setBalance(new BigNumber(bal.toString()).div(1e18).toNumber());

        const chainId = (await web3.eth.getChainId())
        setChainId(new BigNumber(chainId.toString()).toNumber())
        
        setUserId(jwt.userId)

      }
    }

  }

  async function init() {
    const token = localStorage.getItem("user_token")
    if (token) {
      const jwt = parseJwt(token)
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const web3 = new Web3(window.ethereum)
      const address = (await web3.eth.getAccounts())[0]
      if (jwt.address === address) {
        const valid = await fetch("/api/sign", {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            authorization : "Bearer " + token
          },
          body: JSON.stringify({
            req: 'validation',
          })
        })
        const res = await valid.json()
        if (res.status) {
          setAddress(address)
          setWeb3(web3)
          setConnected(true)
          const bal = await web3.eth.getBalance(address)
          setBalance(new BigNumber(bal.toString()).div(1e18).toNumber());
  
          const chainId = (await web3.eth.getChainId())
          setChainId(new BigNumber(chainId.toString()).toNumber())
          setUserId(jwt.userId)
        }else {
          localStorage.removeItem("user_token")
        }
      } else {
        localStorage.removeItem("user_token")
      }
    }

  }



  async function connectMetamask(): Promise<boolean> {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const web3 = new Web3(window.ethereum)
        const address = (await web3.eth.getAccounts())[0]

        await signMessage(address, web3)
        return true
      } catch (e: any) {
        alert(e.message)
        localStorage.removeItem("connected")
        return false
      }
    } else {
      alert("Please install Metamask")
      localStorage.removeItem("connected")
      return false
    }
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <Component {...p} />
  );
}
