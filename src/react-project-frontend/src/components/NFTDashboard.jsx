import React, { useState, useEffect } from "react";
import { react_project_backend } from "../../../declarations/react-project-backend";
import { useUser } from "../providers/user";
import { useRefresh } from "../providers/refresh";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import CloseIcon from "@mui/icons-material/Close";

const NFTDashboard = () => {
  const { triggerRefresh, refresh } = useRefresh();

  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [transferAddress, setTransferAddress] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const { walletAddress } = useUser();
  //   console.log(walletAddress)
  const fetchNFTs = async () => {
    try {
      setLoading(true);
      // console.log(walletAddress)
      const userNFTs = await react_project_backend.get_user_nfts(walletAddress);
      setNfts(userNFTs);
    } catch (err) {
      setError("Failed to fetch NFTs: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!transferAddress) {
      setError("Please enter a transfer address");
      return;
    }
    try {
      const success = await react_project_backend.transfer_nft(
        selectedNFT.id,
        transferAddress
      );
      if (success) {
        await fetchNFTs();
        setTransferAddress("");
        setSelectedNFT(null);
        setTransferDialogOpen(false);
      } else {
        setError("Transfer failed");
      }
    } catch (err) {
      setError("Transfer failed: " + err.message);
    }
  };

  const handleSearch = async () => {
    try {
      if (searchTerm.trim()) {
        const results = await react_project_backend.search_nfts(searchTerm);
        setNfts(results);
      } else {
        await fetchNFTs();
      }
    } catch (err) {
      setError("Search failed: " + err.message);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, [refresh]);

  const handleOpenTransferDialog = (nft) => {
    setSelectedNFT(nft);
    setTransferDialogOpen(true);
  };

  const handleCloseTransferDialog = () => {
    setSelectedNFT(null);
    setTransferDialogOpen(false);
    setTransferAddress("");
  };

  const TransferDialog = () => (
    <Dialog
      open={transferDialogOpen}
      onClose={handleCloseTransferDialog}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Transfer NFT
        <IconButton
          onClick={handleCloseTransferDialog}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Recipient Address"
          fullWidth
          value={transferAddress}
          onChange={(e) => setTransferAddress(e.target.value)}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseTransferDialog}>Cancel</Button>
        <Button onClick={handleTransfer} variant="contained">
          Transfer
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <TextField
              fullWidth
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <IconButton onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {nfts.map((nft) => (
            <Grid item xs={12} sm={6} md={4} key={nft.id.toString()}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {nft.metadata.title}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {nft.metadata.category}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="body2" paragraph>
                    {nft.metadata.description}
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Price
                      </Typography>
                      <Typography variant="body2">
                        {nft.metadata.price}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Location
                      </Typography>
                      <Typography variant="body2">
                        {nft.metadata.location}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Contact
                    </Typography>
                    <Typography variant="body2">
                      {nft.metadata.contact_info}
                    </Typography>
                  </Box>

                  {nft.metadata.additional_details && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Additional Details
                      </Typography>
                      <Typography variant="body2">
                        {nft.metadata.additional_details}
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  <Typography
                    variant="caption"
                    display="block"
                    color="textSecondary"
                  >
                    Document: {nft.metadata.file_name}
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    color="textSecondary"
                  >
                    Uploaded:{" "}
                    {new Date(
                      nft.metadata.upload_timestamp
                    ).toLocaleDateString()}
                  </Typography>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    startIcon={<TransferWithinAStationIcon />}
                    onClick={() => handleOpenTransferDialog(nft)}
                  >
                    Transfer NFT
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && nfts.length === 0 && (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            No NFTs Found
          </Typography>
          <Typography color="textSecondary">
            Get started by creating your first Land NFT!
          </Typography>
        </Paper>
      )}

      <TransferDialog />
    </Box>
  );
};

export default NFTDashboard;
