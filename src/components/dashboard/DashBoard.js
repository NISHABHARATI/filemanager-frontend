import React, { useState, useEffect } from 'react';
import {  TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import './DashBoard.css';
import UserDetailsPopup from '../userdetailspopup/UserDetailsPopup';
import { FaCloudUploadAlt } from "react-icons/fa";
import { Button } from '@mui/material';
import UploadedFileCard from '../UploadedFileCard';


const DashBoard = ({ isLogin, setIsLogin }) => {
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [data, setData] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [userId, setUserId] = useState(null);

  const [isFolderPopupVisible, setFolderPopupVisible] = useState(false);
  const [folderName, setFolderName] = useState('');

  useEffect(() => {
    if (isLogin) {
      const storedUserDetails = sessionStorage.getItem('userDetails');
      if (storedUserDetails) {
        const userDetails = JSON.parse(storedUserDetails);
        setData(userDetails);  
        setUserId(Number(userDetails.userId));
      }
    }
  }, [isLogin]);

  const handlePopup = () => {
    const storedUserDetails = sessionStorage.getItem('userDetails');
    if (storedUserDetails) {
      const userDetails = JSON.parse(storedUserDetails);
      setData(userDetails);
    }
    setPopupVisible(true);
  };


  const closePopup = () => {
    setPopupVisible(false);
  };
 useEffect(() => {
        const storedUserDetails = sessionStorage.getItem('userDetails');
        const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
        const userId = userDetails ? userDetails.userId : null;

        if (userId) {
            handleFetchFilesAndFolders(userId);
        } else {
            console.error("User not logged in, cannot fetch files and folders.");
        }
    }, []);


  const handleFetchFilesAndFolders = async (parentId = -1) => {
    try {
        const storedUserDetails = sessionStorage.getItem('userDetails');
        const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
        const userId = userDetails ? userDetails.userId : null;

        if (!userId) {
            throw new Error('User ID not found in session storage');
        }
      const parentIdValue = parentId ?? -1;
      const response = await fetch(`${API_URL}/api/files/list?parentId=${parentIdValue}&userId=${userId}`, {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'userId': userId
        }
      });

        if (!response.ok) {
            const errorMessage = await response.text(); 
            throw new Error("Failed to fetch files and folders: " + errorMessage);
        }
        

        const filesAndFolders = await response.json();
        
        const fileNames = filesAndFolders.map(item => {
          const baseFileName = item.fileName; 
          return { name: baseFileName, url: item.fileUrl };  
      });
      setUploadedFiles(fileNames); 
    } catch (error) {
        console.error('Error fetching files and folders:', error);
    }
};

const handleCreateFolder = async () => {
      if (!folderName.trim()) {
        console.error("Folder name cannot be empty");
        return;
      }
    
      try {
        const storedUserDetails = sessionStorage.getItem('userDetails');
        const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
        const userId = userDetails ? userDetails.userId : null;
    
        if (!userId) {
          console.log("User id not found");
          throw new Error('User ID not found in session storage');
        }
    
        // Replace this with the actual API endpoint for creating folders
        const parentId = 2; // Adjust as necessary; using -1 as a placeholder
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/files/create-folder?userId=${userId}&parentId=${parentId}&folderName=${encodeURIComponent(folderName)}`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error("Failed to create folder: " + errorMessage);
        }
    
        // Assuming the response returns the created folder details
        const createdFolder = await response.json();
        console.log("Folder created successfully:", createdFolder);
  
        handleFetchFilesAndFolders();
        // Close the popup after folder creation
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

        if (!userId) {
            throw new Error('User ID not found in session storage');
        }
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/files/upload`, {
        mode: 'cors',
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'userId': userId
        }
      });

        if (!response.ok) {
            const errorMessage = await response.text(); 
            throw new Error("Failed to upload file: " + errorMessage);
        }

        // const result = await response.json(); // Parse the response as JSON
        //  const uploadedFileName = result.fileName.toString(); 
        // const uploadedFileName = result.fileName.split('.').slice(0, -1).join('.');
        // const uploadedFileInfo = { name: uploadedFileName, url: result.fileUrl };


        const result = await response.json();
        const uploadedFileName = result.fileName;
        const isFile = result.file;

        const uploadedFileInfo = { name: uploadedFileName, url: result.fileUrl, file: isFile };
        setUploadedFiles(prevFiles => [...prevFiles, uploadedFileInfo]); 
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};

  const handleFolderUpload = async (event) => {
    const files = event.target.files; 
    if (!files.length) {
        return;
    }

    const formData = new FormData();
    Array.from(files).forEach(file => {
        formData.append('files[]', file); 
    });

    try {
      
        const storedUserDetails = sessionStorage.getItem('userDetails');
        const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
        const userId = userDetails ? userDetails.userId : null;

        if (!userId) {
            throw new Error('User ID not found in session storage');
        }

        const response = await fetch('http://localhost:1521/api/files/uploadFolder', {
            mode: 'cors',
            method: 'POST',
            body: formData,
            credentials: 'include',
            headers: {
                'userId': userId  
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to upload folder: ${response.statusText}`);
        }

        const result = await response.text();
        setUploadedFiles(prevFiles => [...prevFiles, result]); 
    } catch (error) {
        console.error('Error uploading folder:', error);
    }
};


  

  return (
    <div className="dashboard">
      <div className="sidebar">
        <Button
          onClick={handlePopup}
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            marginTop: 2,
            padding: 1,
            backgroundColor: '#1976d2',
            '&:hover': {
              backgroundColor: '#115293',
            },
          }}
        >
          User Details
        </Button>
        <label className="upload-button">
          Upload File <FaCloudUploadAlt />
          <input
            type="file"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </label>
        
        <label className="upload-button">
          Upload Folder <FaCloudUploadAlt />
          <input
            type="file"
            onChange={handleFolderUpload}
            webkitdirectory=""  
            directory=""       
            multiple
            style={{ display: 'none' }}
          />
        </label>
        <Button
        onClick={() => setFolderPopupVisible(true)}
           variant="contained"
          color="secondary"
          fullWidth
          sx={{
            marginTop: 2,
            padding: 1,
            backgroundColor: '#4caf50',
            '&:hover': {
              backgroundColor: '#388e3c',
               },
         }}
        >
         Create Folder 
      </Button> 
      <Dialog open={isFolderPopupVisible} onClose={() => setFolderPopupVisible(false)}>
          <DialogTitle>Create Folder</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Folder Name"
              type="text"
              fullWidth
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFolderPopupVisible(false)}>Cancel</Button>
            <Button onClick={handleCreateFolder}>Create</Button>
          </DialogActions>
        </Dialog>

      </div>
      
  
      
    <div className="content" style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
      {uploadedFiles.map((file, index) => (
        <UploadedFileCard
          key={index}
          file={file}
          flag={file.file?0:1}
        />
      ))}
    </div>

      <UserDetailsPopup userDetails={data} isVisible={isPopupVisible} onClose={closePopup} />
    </div>
  );
};

export default DashBoard;
