import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../../../atom/authAtom/userAtom";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Grid, Stack, TextField } from "@mui/material";
import { joinQuiz } from "../../../services/quizService";
import invitationCodeAtom from "../../../atom/manageQuizAtom/invitationCodeAtom";
// Assuming joinQuiz function is in this path

const JoinButton: React.FC = () => {
  const [joinCode, setJoinCode] = useState<string>("");
  const [joinCodeError, setJoinCodeError] = useState<string>("");
  const [submissionError, setSubmissionError] = useState<string>("");
  const setInvitionCode = useSetRecoilState(invitationCodeAtom);
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!joinCode.trim()) {
      setJoinCodeError("Invitation code is required");
      return;
    }
    setJoinCodeError("");

    try {
      const activeQuizId = await joinQuiz(joinCode, user.displayName, user.uid);
      if (activeQuizId !== null) {
        setInvitionCode(joinCode);
        navigate(`/join/game/${activeQuizId}`);
      } else {
        setSubmissionError("Invalid invitation code or failed to join");
      }
    } catch (error) {
      setSubmissionError("Invalid invitation code or failed to join");
    }
  };

  return (
    <Grid container marginTop={"30px"} spacing={2}>
      <Grid item xs={12}>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Enter Code"
            type="text"
            fullWidth
            autoFocus={true}
            error={Boolean(joinCodeError)}
            helperText={joinCodeError}
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            sx={{
              backgroundColor: "#1e1e1e",
              "& .MuiInputBase-root": {
                color: "#fff",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#555",
                },
                "&:hover fieldset": {
                  borderColor: "#777",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#999",
                },
              },
              "& .MuiFormLabel-root": {
                color: "#aaa",
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#333",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#555",
              },
              maxHeight: '55px',
              padding: "10px 20px",
              fontWeight: "bold",
              border: "2px solid",
              borderColor: "#333",
              boxShadow: "0 3px 5px rgba(0,0,0,0.2)",
            }}
          >
            Join
          </Button>
        </Stack>
      </Grid>

      {submissionError && (
        <Grid item xs={12} sx={{
          
        }}>
          <Alert severity="error" sx={{ color: "black" }}>
            {submissionError}
          </Alert>
        </Grid>
      )}
    </Grid>
  );
};

export default JoinButton;
