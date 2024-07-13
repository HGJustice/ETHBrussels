import React, { useState } from 'react';
import { ethers } from 'ethers';
import userABI from '../UserABI.json';

const contractABI = userABI;

const contractAddress = '0xFb7C7c2901681746cbFAB59b8F4545e37FE0Ca6F';

export default function CreateUser() {
  const [formData, setFormData] = useState({ username: '' });

  const handleInputChange = event => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  async function createUserHandler(event) {
    event.preventDefault();
    // Create a provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    // Get the signer from the provider
    const signer = await provider.getSigner();

    // Create the contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Call the contract's function
    const tx = await contract.createUser(formData.username, formData.role);
    await tx.wait();
    console.log('User created successfully');
  }

  return (
    <div>
      <form onSubmit={createUserHandler}>
        <input
          type="text"
          name="username"
          value={formData.username}
          placeholder="username"
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="role"
          value={formData.role}
          placeholder="role"
          onChange={handleInputChange}
        />
        <button type="submit">Create User</button>
      </form>
    </div>
  );
}
