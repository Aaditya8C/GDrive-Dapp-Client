"use client";
import axios from "axios";
import { ethers } from "ethers";
import React, { useState } from "react";
import toast from "react-hot-toast";
import ButtonComp from "./ButtonComp";
import { Upload } from "lucide-react";

interface FileUploadProps {
  account: string;
  provider: ethers.BrowserProvider;
  contract: ethers.Contract;
}

const FileUpload: React.FC<FileUploadProps> = ({
  account,
  provider,
  contract,
}) => {
  const [file, setFile] = useState<File>();
  const [fileName, setFileName] = useState("No image selected");
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (file) {
      try {
        const formData: FormData = new FormData();
        formData.set("file", file);

        const response = await axios({
          method: "POST",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `b15fff7a43d745fa592f`,
            pinata_secret_api_key: `803891a6cf07e71ccbdbeabf93ded9df824385a9061f567a68190aa49ee2b61f`,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(response);
        const imageHash = `ipfs://${response.data.IpfsHash}`;
        try {
          console.log("Image", imageHash);
          contract.add(account, imageHash);
        } catch (error) {
          console.log("Errorrrrr", error);
        }
        setFileName("");
        setFile(undefined);
        toast.success("Image uploaded successfully!!!");
      } catch (error) {
        toast.error("Unable to upload to Pinata....");
      }
    }
  };
  const retrieveFile = (e: any) => {
    const data: File = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(data);
    };
    setFileName(data?.name);
  };
  return (
    <form action="" onSubmit={handleSubmit} className="grid gap-10">
      <div className="bg-white relative border-2 border-black border-dotted w-[70vw] md:w-[30vw] h-20 rounded-2xl shadow-xl ">
        <label
          htmlFor="fileUpload"
          className="absolute inset-0 text-center py-6 cursor-pointer text-lg text-black"
        >
          Choose Image
        </label>
        <input
          type="file"
          className="outline-none absolute hidden"
          disabled={!account}
          id="fileUpload"
          onChange={retrieveFile}
        />
      </div>
      <span>Image: {fileName}</span>
      <ButtonComp>
        <Upload className="w-6 h-6" />
        Upload
      </ButtonComp>
    </form>
  );
};

export default FileUpload;
