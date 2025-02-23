import React, { useEffect, useState, useMemo } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useRefresh } from "../providers/refresh";

const NFTPriceTotal = ({ nfts }) => {
  const { refresh } = useRefresh();
  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    const newTotalPrice = nfts.reduce((sum, nft) => {
      const priceNum = parseFloat(nft.metadata.price.replace(/[^0-9.-]+/g, ""));
      return isNaN(priceNum) ? sum : sum + priceNum;
    }, 0);
    setTotalPrice(newTotalPrice);
  }, [nfts, refresh]);

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        marginTop: 2,
        marginBottom: 2,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        border: "1px solid rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography variant="h6" sx={{ color: "#333", fontWeight: "bold" }}>
        Total Portfolio Value: $
        {totalPrice.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Typography>
    </Paper>
  );
};

export default NFTPriceTotal;
