import React, { useState } from 'react';
import { ethers } from 'ethers';
import musicStakingABI from '../MusicStakingABI.json';

const contractABI = musicStakingABI;

const contractAddress = '0x8BbfB4196cac5d5d0D65706c06cF62040b50470E';

export default function UserStake() {
  const [formData, setFormData] = useState({ stakingPoolId: 0 });

  const handleInputChange = event => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  async function userStakeHandler(event) {
    event.preventDefault();
    // Create a provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    // Get the signer from the provider
    const signer = await provider.getSigner();

    // Create the contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Call the contract's function
    const tx = await contract.stake(formData.stakingPoolId, {
      value: ethers.parseEther(formData.stakeAmount.toString()),
    });
    await tx.wait();
    console.log('Staked successfully');
  }
  return (
    <div>
      <form onSubmit={userStakeHandler}>
        <input
          type="number"
          name="stakingPoolId"
          value={formData.stakingPoolId}
          placeholder="Staking Pool"
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="stakeAmount"
          value={formData.stakeAmount}
          placeholder="Stake Amount (ETH)"
          onChange={handleInputChange}
        />
        <button type="submit">Create Staking Pool</button>
      </form>
    </div>
  );
}
