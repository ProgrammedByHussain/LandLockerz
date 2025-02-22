import React, { useState } from "react";
import { TextField, Container, Typography, Box, Button } from "@mui/material";
import NFTDashboard from "../components/NFTDashboard";

const SearchWallet = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [inputValue, setInputValue] = useState('');

  const handleSearch = () => {
    setWalletAddress(inputValue);
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        Search Wallet Address
      </Typography>
      <Box display="flex" gap={2} justifyContent="center" mt={3}>
        <TextField
          label="Wallet Address"
          variant="outlined"
          fullWidth
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </Box>
        <Box sx={{mt : 5}} >

        <NFTDashboard key={walletAddress} walletAddress={walletAddress} isSearch={true} /> 

        </Box>

    </Container>
  );
};

export default SearchWallet;
