import React, { useEffect, useState } from "react";
import PopupContainer from "./Layouts/PopupContainer";
import { TextField } from "@mui/material";
import { ethers } from "ethers";
import ButtonComp from "./ButtonComp";
import toast from "react-hot-toast";
import accessListStore from "@/store/accessListStore";
import { HandCoins } from "lucide-react";

interface SharePopupProps {
  setPopup: Function;
  contract: ethers.Contract;
}
const SharePopup: React.FC<SharePopupProps> = ({ setPopup, contract }) => {
  const [address, setAddress] = useState<string>("");
  const fetchAccessList = accessListStore((state) => state.fetchAccessList);
  const grantAccess = async () => {
    if (address) {
      const txHash = await contract.allow(address);
      await txHash.wait();
      toast.success("Access granted to the user successfully");
      setPopup(false);
      await fetchAccessList(contract);
    }
  };

  return (
    <PopupContainer setPopup={setPopup} closeBtn>
      <div className="bg-slate-100 rounded-2xl shadow-xl grid gap-6 p-20">
        <p className="text-black text-xl font-semibold text-center">
          <span className="text-violet-700">Share </span>
          With Your
          <span className="text-orange-500"> Buddies!!!</span>
        </p>
        <TextField
          id="standard-basic"
          label="Enter Address"
          variant="outlined"
          size="small"
          onChange={(e) => setAddress(e.target.value)}
        />
        <ButtonComp
          clickEvent={grantAccess}
          customClass="py-2 shadow-gray-400 shadow-none"
        >
          <HandCoins className="w-6 h-6" />
          Grant
        </ButtonComp>
        <ButtonComp
          invert
          customClass="py-2 shadow-gray-400 shadow-none"
          clickEvent={() => setPopup(false)}
        >
          Cancel
        </ButtonComp>
      </div>
    </PopupContainer>
  );
};

export default SharePopup;
