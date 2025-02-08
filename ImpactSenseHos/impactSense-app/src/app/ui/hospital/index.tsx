import React, { useState, useEffect } from "react";
import { RootState } from "@/store";
import { Box, Button, Typography, CircularProgress, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setSharedText } from "@/store";
import { Osdk } from "@osdk/client";
import { HospitalWithSupplies, RoadAccident } from "@impactsense/sdk";
import client from "@/lib/client";
import { ChatPromptTemplate, SystemMessagePromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const HospitalSelect = () => {
  const sharedText = useSelector((state: RootState) => state.sharedText);
  const [nearestHospital, setNearestHospital] = useState<Osdk.Instance<HospitalWithSupplies> | null>(null);
  const [roadAcc, setRoadAcc] = useState<Osdk.Instance<RoadAccident> | null>(null);
  const [aiResponse, setAiResponse] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRoadAccident = async () => {
      if (!sharedText) return;
      try {
        const roadAccident = await client(RoadAccident).fetchOne(sharedText);
        setRoadAcc(roadAccident);
      } catch (error) {
        console.error("Error fetching road accident:", error);
      }
    };
    fetchRoadAccident();
  }, [sharedText]);

  useEffect(() => {
    const findNearestHospital = async () => {
      if (!roadAcc || !roadAcc.latitude || !roadAcc.longitud) return;

      try {
        let closestHospital: Osdk.Instance<HospitalWithSupplies> | null = null;
        let minDistance = Infinity;

        for await (const hospital of client(HospitalWithSupplies).asyncIter()) {
          if (hospital.latitude && hospital.longitude) {
            const distance = getDistance(
              roadAcc.latitude, roadAcc.longitud,
              hospital.latitude, hospital.longitude
            );

            if (distance < minDistance) {
              minDistance = distance;
              closestHospital = hospital;
            }
          }
        }
        setNearestHospital(closestHospital);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
      }
    };

    findNearestHospital();
  }, [roadAcc]);

  const handleGenerateAiResponse = async () => {
    if (!roadAcc || !nearestHospital) {
      setAiResponse("Waiting for accident and hospital data...");
      return;
    }

    setLoadingAi(true);
    setAiResponse("");

    try {
      const systemMessage = SystemMessagePromptTemplate.fromTemplate(
        `${userPrompt} (${roadAcc.fatals}, ${roadAcc.persons}, ${nearestHospital.supplieslist})`
      );

      const chatPrompt = ChatPromptTemplate.fromMessages([systemMessage]);

      const formattedMessages = await chatPrompt.formatMessages({
        accident_location: `Lat: ${roadAcc.latitude}, Lon: ${roadAcc.longitud}`,
        nearest_hospital: `${nearestHospital.name}, Address: ${nearestHospital.address}`,
        hospital_distance: getDistance(
          roadAcc.latitude,
          roadAcc.longitud,
          nearestHospital.latitude,
          nearestHospital.longitude
        ).toFixed(2) + " km",
      });

      const openai = new ChatOpenAI({
        openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        temperature: 0.7,
      });

      const result = await openai.invoke(formattedMessages);
      setAiResponse(result.text);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setAiResponse("Failed to generate AI response.");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6">Nearest Hospital</Typography>

      {!nearestHospital ? (
        <Typography variant="body2" sx={{ marginTop: 2 }}>Finding nearest hospital...</Typography>
      ) : (
        <Box sx={{ marginTop: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body1" sx={{ minWidth: 100 }}>Name:</Typography>
              <TextField fullWidth variant="outlined" value={nearestHospital.name} InputProps={{ readOnly: true }} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body1" sx={{ minWidth: 100 }}>Beds:</Typography>
              <TextField fullWidth variant="outlined" value={nearestHospital.beds} InputProps={{ readOnly: true }} />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body1" sx={{ minWidth: 100 }}>Address:</Typography>
              <TextField fullWidth variant="outlined" value={nearestHospital.address} InputProps={{ readOnly: true }} />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body1" sx={{ minWidth: 100 }}>Distance:</Typography>
              <TextField 
                fullWidth 
                variant="outlined" 
                value={nearestHospital ? `${getDistance(roadAcc?.latitude, roadAcc?.longitud, nearestHospital.latitude, nearestHospital.longitude).toFixed(2)} km` : "Calculating..."} 
                InputProps={{ readOnly: true }} 
              />
            </Box>
          </Box>
        </Box>
      )}

      <TextField
        label="Enter AI Prompt"
        fullWidth
        variant="outlined"
        sx={{ marginTop: 2 }}
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
      />

      <Button
        onClick={handleGenerateAiResponse}
        variant="contained"
        color="secondary"
        fullWidth
        sx={{ marginTop: 2 }}
        disabled={loadingAi}
      >
        {loadingAi ? "Analyzing..." : "Get AI Assistance"}
      </Button>

      {loadingAi && <CircularProgress sx={{ marginTop: 2 }} />}

      {aiResponse && (
        <Box sx={{ marginTop: 2, padding: 2, backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
          <Typography variant="h6">AI Response</Typography>
          <Typography variant="body1">{aiResponse}</Typography>
        </Box>
      )}

      <Button
        onClick={() => dispatch(setSharedText(""))}
        variant="contained"
        color="primary"
        fullWidth
        sx={{ marginTop: 2 }}
      >
        Reset
      </Button>
    </Box>
  );
};

export default HospitalSelect;
