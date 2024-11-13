import React, { useState } from "react";
import { Button, Typography, Paper, TextField } from "@mui/material";
import axios from "axios";

function UploadPhoto() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("uploadedphoto", file);

    try {
      const response = await axios.post("/photos/new", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        setFile(null);
        setError(null);
        alert("Photo uploaded successfully!");
      }
    } catch (err) {
      console.error("Error uploading photo:", err);
      setError("Failed to upload the photo. Please try again.");
    }
  };

  return (
    <Paper className="upload-photo-container">
      <Typography variant="h5" gutterBottom>
        Upload Photo
      </Typography>
      <form onSubmit={handleUpload}>
        <TextField
          type="file"
          inputProps={{ accept: "image/*" }}
          onChange={handleFileChange}
          fullWidth
          margin="normal"
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!file}
          fullWidth
        >
          Upload
        </Button>
      </form>
    </Paper>
  );
}

export default UploadPhoto;
