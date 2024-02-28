import { ethers } from "ethers";
import { isEmpty } from "lodash";
import React, { Key, useEffect, useState } from "react";
import ButtonComp from "./ButtonComp";
import { motion } from "framer-motion";
import accessListStore from "@/store/accessListStore";
import toast from "react-hot-toast";
import { ShieldBan } from "lucide-react";

interface AccessListProps {
  contract: ethers.Contract;
}
const AccessList: React.FC<AccessListProps> = ({ contract }) => {
  const fetchAccessList = accessListStore((state) => state.fetchAccessList);
  const accessList = accessListStore((state) => state.accessList);
  const removeAccess = async (address: string) => {
    const txHash = await contract.disAllow(address); // Get the transaction hash
    // Wait for the transaction receipt
    await txHash.wait();
    // Once the transaction is mined, fetch the access list
    await fetchAccessList(contract);
    toast.success("Revoked the access");
  };

  useEffect(() => {
    contract && fetchAccessList(contract);
  }, []);
  return (
    !isEmpty(accessList) && (
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="absolute left-0 bg-violet-950 shadow-lg shadow-violet-900  px-6 py-4 w-[25vw] hidden lg:grid gap-8 max-h-[50vh] overflow-y-scroll scrollbar-none place-content-center items-center"
      >
        <p className="font-semibold text-lg">
          <span className="text-orange-200">People having</span> access to your
          <span className="text-orange-200"> photos</span>
        </p>
        <div className="inset-x-0 border-violet-700 border-dotted border-t-2" />
        {!isEmpty(accessList) &&
          accessList.map((item, index: Key) => {
            return (
              <div className="break-all flex gap-6 " key={index}>
                <p>{item}</p>
                <ButtonComp
                  customClass="py-1 px-1 animate-pulse"
                  invert
                  clickEvent={() => removeAccess(item[0])}
                >
                  <ShieldBan className="w-6 h-6" />
                </ButtonComp>
              </div>
            );
          })}
      </motion.div>
    )
  );
};

export default AccessList;
