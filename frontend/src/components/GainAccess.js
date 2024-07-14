import React, { useState } from 'react';
import { ethers } from 'ethers';
import musicStakingABI from '../MusicStakingABI.json';

const contractABI = musicStakingABI;

const contractAddress = '0xe9eeEF297DF45b6090B1b880568DA4a192Db0b46';

export default function GainAccess() {
  const [formData, setFormData] = useState({
    stakingPoolId: 0,
  });

  const handleInputChange = event => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  async function gainAccessHandler(event) {
    event.preventDefault();
    // Create a provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    // Get the signer from the provider
    const signer = await provider.getSigner();

    // Create the contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Call the contract's function
    const tx = await contract.gainAccess(formData.stakingPoolId);
    await tx.wait();
    console.log('Gained Access successfully');
  }

  return (
    <div>
      <form onSubmit={gainAccessHandler}>
        <input
          type="number"
          name="stakingPoolId"
          value={formData.stakingPoolId}
          placeholder="Staking Pool"
          onChange={handleInputChange}
        />
        <button type="submit">Gain access</button>
      </form>
    </div>
  );
}
