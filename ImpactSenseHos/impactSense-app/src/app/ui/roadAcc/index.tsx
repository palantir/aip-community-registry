"use client";
import React, { useState } from "react";
import { Box, Button, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { setSharedText } from "@/store";
import { Osdk } from "@osdk/client";
import { RoadAccident } from "@impactsense/sdk";
import client from "@/lib/client";

const RoadAccSelect = () => {
  const [selectedValue, setSelectedValue] = useState("0");
  const [roadAcc, setRoadAcc] = useState<Osdk.Instance<RoadAccident>>();

  const fetchRoadAcc = async (ind: number) => {
    const roadAccidents: Osdk.Instance<RoadAccident>[] = [];
    for await (const obj of client(RoadAccident).asyncIter()) {
      roadAccidents.push(obj);
    }
    setRoadAcc(roadAccidents[ind]);
  };

  const dispatch = useDispatch();
  const handleSearch = () => {
    fetchRoadAcc(Number(selectedValue)).then(() => {
      if (roadAcc) {
        dispatch(setSharedText(roadAcc.$primaryKey));
      }
    });
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">Select an accident</Typography>
      <Select
        value={selectedValue}
        onChange={(e) => setSelectedValue(e.target.value)}
        fullWidth
        sx={{ marginTop: 2, marginBottom: 2 }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 200,
              overflowY: "auto",
            },
          },
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
        }}
      >
        {Array.from({ length: 476 }, (_, i) => (
          <MenuItem key={i} value={i}>
            {i}
          </MenuItem>
        ))}
      </Select>

      {roadAcc && (
        <Box sx={{ marginTop: 2 }}>
          <Typography variant="h6">Road Accident Details:</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body1" sx={{ width: "120px" }}>Date:</Typography>
              <TextField variant="outlined" fullWidth value={roadAcc.date} InputProps={{ readOnly: true }} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body1" sx={{ width: "120px" }}>Event:</Typography>
              <TextField variant="outlined" fullWidth value={roadAcc.harmEvname} InputProps={{ readOnly: true }} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body1" sx={{ width: "120px" }}>Fatalities:</Typography>
              <TextField variant="outlined" fullWidth value={roadAcc.fatals} InputProps={{ readOnly: true }} />
            </Box>
          </Box>
        </Box>
      )}

      <Button
        onClick={handleSearch}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 3 }}
      >
        Search for Hospital
      </Button>
    </Box>
  );
};

export default RoadAccSelect;
