import React, { useState, useEffect } from 'react';
import { TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import './DashBoard.css';
import UserDetailsPopup from '../userdetailspopup/UserDetailsPopup';
import { FaCloudUploadAlt } from "react-icons/fa";
import UploadedFileCard from '../UploadedFileCard';

const DashBoard = ({ isLogin }) => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [data, setData] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isFolderPopupVisible, setFolderPopupVisible] = useState(false);
  const [folderName, setFolderName] = useState('');

  // Set user data on login
  useEffect(() => {
    if (isLogin) {
      const storedUserDetails = sessionStorage.getItem('userDetails');
      if (storedUserDetails) {
        setData(JSON.parse(storedUserDetails));
      }
    }
  }, [isLogin]);

  const handlePopup = () => {
    const storedUserDetails = sessionStorage.getItem('userDetails');
    if (storedUserDetails) setData(JSON.parse(storedUserDetails));
    setPopupVisible(true);
  };

  const closePopup = () => setPopupVisible(false);

  // Fetch files on mount
  useEffect(() => {
    const storedUserDetails = sessionStorage.getItem('userDetails');
    const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;

    if (userDetails?.userId) {
      handleFetchFilesAndFolders(userDetails.userId);
    } else {
      console.error("User not logged in, cannot fetch files and folders.");
    }
  }, []);

  const handleFetchFilesAndFolders = async (parentId = -1) => {
    try {
      const storedUserDetails = sessionStorage.getItem('userDetails');
      const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
      const userId = userDetails?.userId;

      if (!userId) throw new Error('User ID not found in session storage');

      const API_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${API_URL}/api/files/list?parentId=${parentId}&userId=${userId}`, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: { userId }
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error("Failed to fetch files and folders: " + errorMessage);
      }

      const filesAndFolders = await response.json();
      const fileNames = filesAndFolders.map(item => ({ name: item.fileName, url: item.fileUrl }));
      setUploadedFiles(fileNames);
    } catch (error) {
      console.error('Error fetching files and folders:', error);
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return console.error("Folder name cannot be empty");

    try {
      const storedUserDetails = sessionStorage.getItem('userDetails');
      const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
      const userId = userDetails?.userId;
      if (!userId) throw new Error('User ID not found in session storage');

      const parentId = 2; // Adjust as needed
      const API_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${API_URL}/api/files/create-folder?userId=${userId}&parentId=${parentId}&folderName=${encodeURIComponent(folderName)}`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error("Failed to create folder: " + errorMessage);
      }

      const createdFolder = await response.json();
      console.log("Folder created successfully:", createdFolder);
      handleFetchFilesAndFolders();
      setFolderPopupVisible(false);
      setFolderName('');
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const storedUserDetails = sessionStorage.getItem('userDetails');
    const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
    const userId = userDetails ? userDetails.userId : null;

    if (!userId) throw new Error('User ID not found in session storage');

    const parentFolderId = -1; 

    const API_URL = process.env.REACT_APP_API_URL;
    const response = await fetch(`${API_URL}/api/files/upload`, {
      mode: 'cors',
      method: 'POST',
      body: formData,
      credentials: 'include',
      headers: {
        'userId': userId,            
        'parentFolderId': parentFolderId  
      }
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error("Failed to upload file: " + errorMessage);
    }

    const result = await response.json();
    const uploadedFileInfo = { name: result.fileName, url: '', file: true };
    setUploadedFiles(prevFiles => [...prevFiles, uploadedFileInfo]);
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};
  const handleFolderUpload = async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files[]', file));

    try {
      const storedUserDetails = sessionStorage.getItem('userDetails');
      const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
      const userId = userDetails?.userId;
      if (!userId) throw new Error('User ID not found in session storage');

      const API_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${API_URL}/api/files/uploadFolder`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        mode: 'cors',
        headers: { userId }
      });

      if (!response.ok) throw new Error(`Failed to upload folder: ${response.statusText}`);
      const result = await response.text();
      setUploadedFiles(prevFiles => [...prevFiles, result]);
    } catch (error) {
      console.error('Error uploading folder:', error);
    }
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <Button onClick={handlePopup} variant="contained" color="primary" fullWidth sx={{ marginTop: 2, padding: 1, backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#115293' } }}>
          User Details
        </Button>

        <label className="upload-button">
          Upload File <FaCloudUploadAlt />
          <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
        </label>

        <label className="upload-button">
          Upload Folder <FaCloudUploadAlt />
          <input type="file" onChange={handleFolderUpload} webkitdirectory="" directory="" multiple style={{ display: 'none' }} />
        </label>

        <Button onClick={() => setFolderPopupVisible(true)} variant="contained" color="secondary" fullWidth sx={{ marginTop: 2, padding: 1, backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}>
          Create Folder
        </Button>

        <Dialog open={isFolderPopupVisible} onClose={() => setFolderPopupVisible(false)}>
          <DialogTitle>Create Folder</DialogTitle>
          <DialogContent>
            <TextField autoFocus margin="dense" label="Folder Name" type="text" fullWidth value={folderName} onChange={(e) => setFolderName(e.target.value)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFolderPopupVisible(false)}>Cancel</Button>
            <Button onClick={handleCreateFolder}>Create</Button>
          </DialogActions>
        </Dialog>
      </div>

      <div className="content" style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
        {uploadedFiles.map((file, index) => (
          <UploadedFileCard key={index} file={file} flag={file.file ? 1 : 0} />
        ))}
      </div>

      <UserDetailsPopup userDetails={data} isVisible={isPopupVisible} onClose={closePopup} />
    </div>
  );
};

export default DashBoard;