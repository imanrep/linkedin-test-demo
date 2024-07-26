import type { NextApiRequest, NextApiResponse } from "next";
import Web3 from "web3";
import { sha256 } from 'js-sha256';
import jwt from 'jsonwebtoken';
import { addDoc, collection, getDocs, query, getDoc, where, doc } from "firebase/firestore";
import { db } from "@/firebase";

function generateJWT(data : any) {
  const token = jwt.sign({ ...data}, "SECRET1", { expiresIn: '7d' });
  return token
}

type Data = {
  message?: string;
  status?: boolean;
  token?: string;
};

function failed(message: string): Data {
  return {
    message,
    status: false,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  const reqData = req.body;
  if (req.body.req === 'getSignMessage') {
    const web3 = new Web3()
    if (!web3.utils.isAddress(reqData.address)) {
      res.status(200).json(failed('Address invalid'));
      res.end();
      return
    }
    const text = 'Hello!\nthis is message from LINKEDIN-TEST\n\nThis transaction only signing message, you will not get cost or gas fee, this signature to let you access model and web3 verification.'
    const sec1 = sha256(`${text}+SECRET_KEY_1+${reqData.address}+SECRET_KEY_2`)
    const sec2 = web3.eth.abi.encodeParameter('string', sha256(sec1))
    
    res.status(200).json({
        status: true,
        message: `${text}\n\nSign Key:\n${sec2}`,
    });

  }

  if(req.body.req === 'login') {
    const web3 = new Web3()
    if (!web3.utils.isAddress(reqData.address)) {
      res.status(200).json(failed('Address invalid'));
      res.end();
      return
    }
    const token = reqData.token
    const _msg = reqData.msg
    const msg = _msg.split('\n\nSign Key:\n')[0]
    const key = _msg.split('\n\nSign Key:\n')[1]
    const sec1 = sha256(`${msg}+SECRET_KEY_1+${reqData.address}+SECRET_KEY_2`)
    if(key !== web3.eth.abi.encodeParameter('string', sha256(sec1))) {
      res.status(200).json(failed('Unauthorized'));
      res.end();
      return
    }
    const address = web3.eth.accounts.recover(_msg, token);

    const qry = query(
      collection(db, 'user'),
      where('address', '==', address)
    )
    const querySnapshot = await getDocs(qry);
      let userId = ""
    if(querySnapshot.empty) {
      userId = await registerToFirestore(address)
    }else {
      querySnapshot.forEach(doc => {
        userId = doc.id
      })
    }
    res.status(200).json({
      status: true,
      token: generateJWT({
        address: address,
        userId: userId
      }),
    }); 
  }

  if (req.body.req === 'validation' ) {
    const token = req.headers.authorization?.split(' ')[1]
    const decoded = jwt.verify(token, "SECRET1")
    if(decoded) {
      res.status(200).json({
        status: true
      })
      return
    }else {
      res.status(200).json(failed('Unauthorized'));
      return
    }
  }
  res.status(200).json(failed('Request invalid'));
}

async function registerToFirestore(address: string) : Promise<string> {
  const docRef = await addDoc(collection(db, "user"), {
    address: address,
  });
  return docRef.id
}
