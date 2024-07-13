import React, { useState } from 'react';
import { ethers } from 'ethers';
import musicStakingABI from '../MusicStakingABI.json';

const contractABI = musicStakingABI;

const contractAddress = '0x8BbfB4196cac5d5d0D65706c06cF62040b50470E';

export default function CreateStakingPool() {
  const [formData, setFormData] = useState({ fileId: 0, targetNumber: 0 });

  const handleInputChange = event => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  async function createStakingPoolHandler(event) {
    event.preventDefault();
    // Create a provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    // Get the signer from the provider
    const signer = await provider.getSigner();

    // Create the contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Call the contract's function
    const tx = await contract.createStakingPool(
      formData.fileId,
      formData.targetNumber,
    );
    await tx.wait();
    console.log('User created successfully');
  }

  return (
    <div>
      <form onSubmit={createStakingPoolHandler}>
        <input
          type="number"
          name="fileId"
          value={formData.fileId}
          placeholder="File ID"
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="targetNumber"
          value={formData.targetNumber}
          placeholder="Target ETH Raised"
          onChange={handleInputChange}
        />
        <button type="submit">Create Staking Pool</button>
      </form>
    </div>
  );
}
