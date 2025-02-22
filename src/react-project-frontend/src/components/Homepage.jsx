import React from 'react';
import { Box, Typography, Grid, Divider, Fade, Tooltip, IconButton } from '@mui/material';
import { useUser } from '../providers/user';
import NFTDashboard from './NFTDashboard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const HomePage = () => {
  const { walletAddress } = useUser();
  
  const [showPortfolioText, setShowPortfolioText] = useState(false);
  const portfolioText = 'Your Portfolio';

  // Fade in effect for "Your Portfolio"
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPortfolioText(true);
    }, 500); // Delay to start the fade-in effect after 500ms
    return () => clearTimeout(timer);
  }, []);

  // Function to copy wallet address to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Grid container spacing={4}>
        {/* Left Section: Portfolio Overview (not inside a card) */}
        <Grid item xs={12} sm={6}>
          {/* Portfolio text with fade-in effect */}
          <Fade in={showPortfolioText} timeout={1000}>
            <Typography 
              variant="h4" 
              sx={{ mb: 2, fontWeight: 'bold', textAlign: 'left' }}
            >
              {portfolioText}
            </Typography>
          </Fade>

          <Divider sx={{ my: 2, borderColor: 'rgba(0, 0, 0, 0.1)' }} />
        </Grid>

        {/* Right Section: NFT Dashboard */}
        <Grid item xs={12} sm={6}>
          <NFTDashboard />
        </Grid>
      </Grid>

      {/* Wallet Address Box at the bottom left */}
      <Box 
        sx={{ 
          position: 'fixed', 
          left: 16, 
          bottom: 16, 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'flex-start', 
          backgroundColor: 'rgba(255, 255, 255, 0.6)', 
          padding: 1, 
          borderRadius: 2, 
          border: '2px solid #ff9800', 
          boxShadow: 3
        }}
      >
        <Typography 
          variant="subtitle2" 
          sx={{ 
            color: '#333',
            fontWeight: 'bold',
            textAlign: 'left',
            marginBottom: '8px'
          }}
        >
          Wallet Address
        </Typography>

        <Typography 
          variant="body1" 
          sx={{ 
            wordBreak: 'break-all', 
            fontWeight: 'bold', 
            color: '#333',
            flexGrow: 1 
          }}
        >
          {walletAddress}
        </Typography>

        <Tooltip title="Copy to clipboard">
          <IconButton 
            onClick={copyToClipboard} 
            sx={{ 
              mt: 1, 
              color: '#ff9800', 
              '&:hover': { color: '#e68900' } 
            }}
          >
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default HomePage;
