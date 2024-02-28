import { ethers } from "ethers";
import { create } from "zustand";

interface AccessListState {
  accessList: string[]; // Adjust the type as needed
  fetchAccessList: (contract: ethers.Contract) => Promise<void>;
}
const accessListStore = create<AccessListState>((set) => ({
  accessList: [],
  fetchAccessList: async (contract: ethers.Contract) => {
    try {
      const accessList = await contract.shareAccess();
      set({ accessList });
      console.log(accessList);
    } catch (error) {
      console.error("Error fetching access list:", error);
    }
  },
}));

export default accessListStore;
