import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import PropTypes from 'prop-types';
import FolderIcon from './assets/folder.png'; 
import FileIcon from './assets/file.png';    

const UploadedFileCard = ({ file, flag }) => {
  if (!file) return null;
  var fileName = file.fileName;
  const iconSrc = flag === 1 ? FileIcon : FolderIcon;

  const handleDownload = async (filename) => {
    try {
      const storedUserDetails = sessionStorage.getItem('userDetails');
      const userDetails = storedUserDetails ? JSON.parse(storedUserDetails) : null;
      const userId = userDetails ? Number(userDetails.userId) : null; 
  
      if (!userId) {
        console.error("User ID not found in session storage.");
        return; 
      }
      const API_URL = process.env.REACT_APP_API_URL;
   const response = await fetch(`${API_URL}/api/files/download`, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors',
    headers: {
        'userId': userId,      
        'fileName': filename   
    }
});
  
      if (response.ok) {
        const blob = await response.blob(); 
        const url = window.URL.createObjectURL(blob); 
  
        const link = document.createElement('a');
        link.href = url;
        link.download = filename; 
        document.body.appendChild(link); 
        link.click(); 
        document.body.removeChild(link); 
      } else {
        console.error('File download failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  return (
    <Box 
      sx={{
        cursor: "pointer",
        width: '70px',  
        textAlign: 'center',
        marginTop: '5px',
        marginBottom: '5px',
        '&:hover': {
          opacity: 1,
        },
      }}
    >
      <Box 
        component="img"
        src={iconSrc}  
        alt={flag === 1 ? "File Icon" : "Folder Icon"}
        sx={{
          width: '100%',
          height: 'auto',
          borderRadius: '4px',
          objectFit: 'contain',
        }}
      />
      <Typography
        variant="body2"
        sx={{
          fontSize: '0.75rem',
          fontWeight: '500',
          marginTop: '3px',
          color: '#333',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        title={file.name} 
      >
        {file.name}
      </Typography>
      {flag === 1 && (
        <Button 
        variant="contained" 
        size="small" 
        onClick={() => handleDownload(file.name)} 
        sx={{ 
          marginTop: '3px',  
          padding: '3px 8px',  
          fontSize: '0.7rem',  
          minWidth: '50px'    
        }}
    >
        Download
    </Button>
      )}
    </Box>
  );
};
UploadedFileCard.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string.isRequired, 
  }).isRequired,
  flag: PropTypes.number.isRequired,  
};

export default UploadedFileCard;

