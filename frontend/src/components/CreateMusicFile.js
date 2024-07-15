import React, { useState } from 'react';
import { ethers } from 'ethers';
import fileABI from '../FileABI.json';
import { create } from 'ipfs-http-client';

const contractABI = fileABI;
const contractAddress = '0x51E9f257172aF78a8812F77f79c59B05da7A0AE6';
const client = create('https://ipfs.infura.io:5001/api/v0');
const projectId = 'YOUR_INFURA_PROJECT_ID'; // Replace with your Infura project ID
const projectSecret = 'YOUR_INFURA_PROJECT_SECRET';

export default function CreateMusicFile() {
  const [formData, setFormData] = useState({ filename: '' });
  const [file, setFile] = useState(null);

  const handleInputChange = event => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleFileChange = event => {
    setFile(event.target.files[0]);
  };

  const uploadToIPFS = async file => {
    const added = await client.add(file);
    return `https://ipfs.infura.io/ipfs/${added.path}`;
  };

  const createMusicFileHandler = async event => {
    event.preventDefault();

    const ipfsLink = await uploadToIPFS(file);
    if (!ipfsLink) {
      console.error('Failed to upload file to IPFS');
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const tx = await contract.createMusicFile(formData.filename, ipfsLink);
    await tx.wait();

    console.log('File Uploaded and Smart Contract Updated');
  };

  return (
    <div>
      <form onSubmit={createMusicFileHandler}>
        <input
          type="file"
          id="fileUpload"
          name="fileUpload"
          onChange={handleFileChange}
        />
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
