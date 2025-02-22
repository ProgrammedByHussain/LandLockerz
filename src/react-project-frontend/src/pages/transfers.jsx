import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { react_project_backend } from "../../../declarations/react-project-backend";

const Transfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [transferData, setTransferData] = useState({
    nftId: "",
    newOwner: "",
  });

  // Fetch transfer history
  const fetchTransfers = async () => {
    try {
      setLoading(true);
      // const response = await react_project_backend.getTransferHistory();
      // setTransfers(response);

      // Placeholder data - replace with actual data
      setTransfers([
        {
          id: 1,
          nftId: "123",
          fromOwner: "0x123...",
          toOwner: "0x456...",
          date: new Date().toISOString(),
          status: "Completed",
        },
      ]);
    } catch (err) {
      setError("Failed to fetch transfer history: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  const handleTransfer = async () => {
    try {
      setLoading(true);
      setError("");

      const success = await react_project_backend.transfer_nft(
        BigInt(transferData.nftId),
        transferData.newOwner
      );

      if (success) {
        setOpenDialog(false);
        fetchTransfers();
        setTransferData({ nftId: "", newOwner: "" });
      } else {
        setError("Transfer failed");
      }
    } catch (err) {
      setError("Transfer failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5">Transfer History</Typography>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          New Transfer
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>NFT ID</TableCell>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : transfers.length > 0 ? (
              transfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell>{transfer.nftId}</TableCell>
                  <TableCell>{transfer.fromOwner}</TableCell>
                  <TableCell>{transfer.toOwner}</TableCell>
                  <TableCell>
                    {new Date(transfer.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{transfer.status}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No transfers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          New Transfer
          <IconButton
            onClick={() => setOpenDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="NFT ID"
              fullWidth
              value={transferData.nftId}
              onChange={(e) =>
                setTransferData({ ...transferData, nftId: e.target.value })
              }
            />
            <TextField
              label="New Owner Address"
              fullWidth
              value={transferData.newOwner}
              onChange={(e) =>
                setTransferData({ ...transferData, newOwner: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleTransfer}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Transfer"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Transfers;
