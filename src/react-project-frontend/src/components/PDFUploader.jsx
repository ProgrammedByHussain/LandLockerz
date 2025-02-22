import React, { useState } from "react";
import { useUser } from "../providers/user";
import { react_project_backend } from "../../../declarations/react-project-backend";
import 
{
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
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  UploadFile as UploadFileIcon,
  Delete as DeleteIcon,
  NavigateNext as NavigateNextIcon,
  NavigateBefore as NavigateBeforeIcon,
  Check as CheckIcon,
} from "@mui/icons-material";

const PDFUploader = () => {
  const [activeStep, setActiveStep] = useState(-1);
  const { walletAddress } = useUser();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mintingStatus, setMintingStatus] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
    contactInfo: "",
  });

  const steps = [
    "Upload Document",
    "Basic Information",
    "Additional Details",
    "Review & Create",
  ];

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
    console.log("TESTSETSEssssT");
    try {
        setLoading(true);
        setError("");
        // setMintingStatus("Creating NFT...");
  
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
  
        reader.onload = function (e) {
          const base64data = reader.result.split(',')[1];  // Get the base64 part after the comma
          localStorage.setItem(formData.title, base64data); // Store the file in localStorage
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError("Failed to create NFT: " + err.message);
      } finally {
        setLoading(false);
      }
    };
  

  const handleNext = () => {
    if (activeStep === -1 && !file) {
      setError("Please upload a PDF document first");
      return;
    }
    setActiveStep((prev) => prev + 1);
    setError("");
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError("");
  };

  const getStepContent = (step) => {
    switch (step) {
      case -1:
        return (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 4,
                textAlign: "center",
                backgroundColor: "grey.50",
                border: "2px dashed",
                borderColor: "primary.main",
                "&:hover": {
                  borderColor: "primary.dark",
                },
              }}
            >
              <UploadFileIcon
                sx={{ fontSize: 64, color: "primary.main", mb: 2 }}
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
        );

      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
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
                rows={4}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
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
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Information"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleInputChange}
                required
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: "grey.50" }}>
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  Review Your Information
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <UploadFileIcon sx={{ mr: 1, color: "primary.main" }} />
                      <Typography variant="subtitle1" color="primary">
                        {file?.name}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ bgcolor: "white", p: 2, borderRadius: 1 }}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Basic Information
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          <strong>Title:</strong> {formData.title}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Description:</strong>
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ mt: 0.5, color: "text.secondary" }}
                        >
                          {formData.description}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ bgcolor: "white", p: 2, borderRadius: 1 }}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Property Details
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          <strong>Price:</strong> ${formData.price}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Category:</strong> {formData.category}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Location:</strong> {formData.location}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          <strong>Contact:</strong> {formData.contactInfo}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: "900px", margin: "auto" }}>
      <Box
        sx={{
          mb: 4,
          animation: "slideIn 0.8s ease-out",
          "@keyframes slideIn": {
            "0%": {
              opacity: 0,
              transform: "translateY(20px)",
            },
            "100%": {
              opacity: 1,
              transform: "translateY(0)",
            },
          },
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            backgroundClip: "text",
            color: "transparent",
            fontWeight: "bold",
          }}
        >
          Create Property NFT
        </Typography>
      </Box>

      <Stepper
        activeStep={activeStep}
        sx={{
          mb: 4,
          "& .MuiStepIcon-root.Mui-completed": {
            color: "#F15A24",
          },
          "& .MuiStepIcon-root.Mui-active": {
            color: "#F15A24",
          },
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form onSubmit={handleSubmit}>
        {getStepContent(activeStep)}

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

        <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<NavigateBeforeIcon />}
          >
            Back
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                endIcon={
                  loading ? <CircularProgress size={20} /> : <CheckIcon />
                }
              >
                {loading ? "Creating NFT..." : "Create NFT"}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<NavigateNextIcon />}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </form>
    </Paper>
  );
};

export default PDFUploader;
