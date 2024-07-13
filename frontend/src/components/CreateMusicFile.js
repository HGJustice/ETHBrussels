import React, { useState } from 'react';
import { ethers } from 'ethers';
import fileABI from '../FileABI.json';

const contractABI = fileABI;

const contractAddress = '0x94CD8161C6Db579A912Db49A663638EA88E96BBA';

export default function CreateMusicFile() {
  const [formData, setFormData] = useState({ filename: '' });

  const handleInputChange = event => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  async function createMusicFileHandler(event) {
    event.preventDefault();
    // Create a provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    // Get the signer from the provider
    const signer = await provider.getSigner();

    // Create the contract instance
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    // Call the contract's function
    const tx = await contract.createMusicFile(
      formData.filename,
      'IPFSLINKHERE',
    );
    await tx.wait();
    console.log('File Uploaded');
  }

  return (
    <div>
      <form onSubmit={createMusicFileHandler}>
        <input
          type="text"
          name="filename"
          value={formData.filename}
          placeholder="file name"
          onChange={handleInputChange}
        />
        <button type="submit">Upload Music File</button>
      </form>
    </div>
  );
}
