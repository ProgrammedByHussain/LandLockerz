import React, { useState, useContext } from "react";
// import { Principal } from "@dfinity/principal";
import { useRefresh } from "../providers/refresh";
import { useUser } from "../providers/user";
import { react_project_backend } from "../../../declarations/react-project-backend";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  Input,
  IconButton,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";

const PDFUploader = () => {
  const { triggerRefresh, refresh } = useRefresh();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { walletAddress } = useUser();
  //   console.log(walletAddress)
  const [mintingStatus, setMintingStatus] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
    contactInfo: "",
  });
  const reader = new FileReader();


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      if (uploadedFile.type !== "application/pdf") {
        setError("Please upload a PDF file");
        return;
      }
      setFile(uploadedFile);
      setError("");
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a PDF document");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMintingStatus("Creating NFT...");

      // Prepare metadata
      const metadata = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        location: formData.location,
        contact_info: formData.contactInfo,
        file_name: file.name,
        file_size: file.size,
        upload_timestamp: new Date().toISOString(),
      };
      //   console.log(walletAddress)

      // Prepare the mint request
      const request = {
        owner: walletAddress, // Use the logged-in user's Principal
        metadata: metadata,
      };

      // Call the mint_nft function
      const nftId = await react_project_backend.mint_nft(request);
      setMintingStatus(`Successfully created NFT with ID: ${nftId.toString()}`);

      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "",
        location: "",
        contactInfo: "",
      });
      setFile(null);
      console.log(refresh);

      reader.onload = function (e) {
        const base64data = reader.result.split(',')[1];  // Get the base64 part after the comma
        localStorage.setItem(formData.title, base64data); // Store the file in localStorage
      };
      reader.readAsDataURL(file);
      triggerRefresh();
    } catch (err) {
      setError("Failed to create NFT: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 4 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              textAlign: "center",
              backgroundColor: "rgba(25, 118, 210, 0.04)",
              border: "2px dashed rgba(25, 118, 210, 0.2)",
              "&:hover": {
                borderColor: "primary.main",
              },
            }}
          >
            <UploadFileIcon
              sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              Upload PDF Document
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              PDF files only, max 10MB
            </Typography>
            <Input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              sx={{ mt: 2 }}
              disableUnderline
            />
            {file && (
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <Typography variant="body2" color="primary">
                  {file.name}
                </Typography>
                <IconButton
                  size="small"
                  onClick={handleRemoveFile}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}
          </Paper>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              multiline
              rows={3}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Contact Information"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleInputChange}
              required
              variant="outlined"
            />
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}

        {mintingStatus && (
          <Alert severity="success" sx={{ mt: 3 }}>
            {mintingStatus}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={loading}
          sx={{ mt: 4 }}
        >
          {loading ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
              Creating NFT...
            </Box>
          ) : (
            "Create Land NFT"
          )}
        </Button>
      </form>
    </Paper>
  );
};

export default PDFUploader;
