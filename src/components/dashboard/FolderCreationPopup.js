import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

const FolderCreationPopup = ({ isVisible, onClose, onCreate }) => {
  const [folderName, setFolderName] = useState('');

  const handleCreate = () => {
    if (folderName) {
      onCreate(folderName);
      setFolderName(''); // Clear the input field
    }
  };

  return (
    <Dialog open={isVisible} onClose={onClose}>
      <DialogTitle>Create New Folder</DialogTitle>
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
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleCreate} color="primary">Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FolderCreationPopup;