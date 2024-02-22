import { ethers } from "ethers";
import { create } from "zustand";
const accessListStore = create((set) => ({
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
