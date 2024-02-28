"use client";
import React, { useEffect, useState } from "react";
import Upload from "../app/artifacts/contracts/Upload.sol/Upload.json";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import FileUpload from "./FileUpload";
import Display from "./Display";
import AccessList from "./AccessList";
import { isEmpty } from "lodash";

const MainPage: React.FC = () => {
  const [account, setAccount] = useState<string>("");
  const [contract, setContract] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const localProvider = new ethers.BrowserProvider(window.ethereum);
    const loadProvider = async () => {
      if (localProvider) {
        // To handle the account changes in the metamask wallet
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        await localProvider.send("eth_requestAccounts", []);
        const signer = await localProvider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress: string =
          "0xe2965Fd463ec7821Ae0dd4611D500FC40300656a";

        const localContract: ethers.Contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        console.log("Contract", localContract);
        setContract(localContract);
        setProvider(localProvider);
      } else {
        toast.error("Metamask is not installed!!!!");
      }
    };

    localProvider && loadProvider();
  }, []);

  return (
    <div className="h-screen w-[80vw] lg:w-screen relative m-auto">
      <motion.div
        className="flex flex-col items-center py-10 gap-10"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, type: "spring" }}
      >
        <p className="text-3xl font-semibold">
          <span className="text-orange-200 ">Gdrive </span>
          Dapp
        </p>
        {account && (
          <p className="bg-box px-8 py-4 rounded-full text-white font-semibold shadow-2xl break-all flex flex-col md:flex-row justify-center items-center gap-2">
            <span className="text-xl">Acoount</span>
            <span>{account}</span>
          </p>
        )}

        <FileUpload account={account} provider={provider} contract={contract} />
        <Display
          account={account}
          contract={contract}
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
        />
        {!isEmpty(contract) && <AccessList contract={contract} />}
      </motion.div>
    </div>
  );
};

export default MainPage;
