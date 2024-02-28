"use client";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import ButtonComp from "./ButtonComp";
import { isEmpty } from "lodash";
import toast from "react-hot-toast";
import Image from "next/image";
import { motion } from "framer-motion";
import ReactSimpleImageViewer from "react-simple-image-viewer";
import SharePopup from "./SharePopup";
import { RiShareFill } from "react-icons/ri";
import { Target } from "lucide-react";

interface DisplayProps {
  account: string;
  contract: ethers.Contract;
  setIsModalOpen: Function;
}
const Display: React.FC<DisplayProps> = ({
  account,
  contract,
  setIsModalOpen,
  isModalOpen,
}) => {
  const [data, setData] = useState<string[]>();
  const [userAddress, setUserAddress] = useState<string>("");
  const [singleImage, setSingleImage] = useState({
    data: "",
    isOpen: false,
  });
  const getData = async () => {
    let userData;
    try {
      userData = await contract.display(userAddress ? userAddress : account);
      if (!isEmpty(userData)) {
        const result: string = userData.toString();
        const resultArray: string[] = result.split(",");
        setData(resultArray);
      } else {
        toast.error("You haven't uploaded any images");
        // console.error("No images to display");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.reason);
    }
  };

  useEffect(() => {
    console.log(singleImage.data);
  }, [singleImage]);

  return (
    <div className="relative w-screen flex flex-col items-center">
      <div className="grid md:flex gap-8 md:gap-14 pt-10">
        <div className="bg-white relative border-2 border-black rounded-xl w-[70vw] md:w-[15vw] text-black mb-8 md:mb-0">
          <input
            type="text"
            className="outline-none absolute inset-0 py-6 px-4 md:p-2 rounded-xl"
            disabled={!account}
            id="fileUpload"
            placeholder="Enter address of the owner"
            onChange={(e) => setUserAddress(e.target.value)}
          />
        </div>
        <ButtonComp clickEvent={getData} customClass="gap-2">
          <Target className="h-5 w-5" />
          Get Data
        </ButtonComp>
        <ButtonComp clickEvent={() => setIsModalOpen(true)} customClass="gap-2">
          <RiShareFill />
          Share
        </ButtonComp>
      </div>
      <div className="absolute inset-x-0 border-violet-700 border-dotted border-t-2" />
      {data && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 py-10 gap-20 items-center content-center"
        >
          {data.map((item, index) => {
            return (
              <Image
                src={`https://gateway.pinata.cloud/ipfs${item.substring(6)}`}
                key={index}
                width={400}
                height={400}
                alt="userImages"
                onClick={() =>
                  setSingleImage({
                    data: `https://gateway.pinata.cloud/ipfs${item.substring(
                      6
                    )}`,
                    isOpen: true,
                  })
                }
              />
            );
          })}
        </motion.div>
      )}
      {singleImage.isOpen && (
        <ReactSimpleImageViewer
          src={[encodeURI(singleImage.data)]}
          disableScroll={false}
          closeOnClickOutside={true}
          onClose={() => setSingleImage({ data: "", isOpen: false })}
          backgroundStyle={{
            zIndex: "999",
            backdropFilter: "blur(2px)",
            background: "rgb(0,0,0,0.7)",
          }}
        />
      )}
      {isModalOpen && (
        <SharePopup setPopup={setIsModalOpen} contract={contract} />
      )}
    </div>
  );
};

export default Display;
