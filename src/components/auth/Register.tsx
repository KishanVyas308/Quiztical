import React, { useEffect, useState } from "react";
import { signUp, signInWithGoogle } from "../../services/authService";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {  Alert, Box } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { useSetRecoilState } from "recoil";
import userAtom from "../../atom/authAtom/userAtom";
import { Link, useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [displayName, setDisplayName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [displayNameError, setDisplayNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [submissionError, setSubmissionError] = useState<string>("");
  const [randomQuote, setRandomQuote] = useState<string>("");
  const setUser = useSetRecoilState(userAtom);
  const navigate = useNavigate();

  const quotes = [
    "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt",
    "The purpose of our lives is to be happy. - Dalai Lama",
    "Life is what happens when you’re busy making other plans. - John Lennon",
    "Get busy living or get busy dying. - Stephen King",
    "You have within you right now, everything you need to deal with whatever the world can throw at you. - Brian Tracy",
  ];

  useEffect(() => {
    if(randomQuote === "") {
      
      handleGenerateQuote()
    }
  }, [])

  const handleGenerateQuote = () => {
    setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSignUp = async () => {
    if (displayName === "") {
      setDisplayNameError("Enter Name");
      return;
    } else {
      setDisplayNameError("");
    }
    if (!validateEmail(email)) {
      setEmailError("Invalid email format");
      return;
    } else {
      setEmailError("");
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters");
      return;
    } else {
      setPasswordError("");
    }

    try {
      const logedInUser = await signUp(email, password, displayName);
      if (logedInUser !== null) {
        setUser(logedInUser);
        console.log(logedInUser);
        navigate("/");
      }
      setSubmissionError("");
    } catch (error) {
      setSubmissionError("Sign up failed. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const logedInUser = await signInWithGoogle();
      if (logedInUser !== null) {
        setUser(logedInUser);
        console.log(logedInUser);
        navigate("/");
      }
      setSubmissionError("");
    } catch (error) {
      setSubmissionError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div style={{ backgroundColor: "#121212", minHeight: "92vh", color: "#fff", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
 <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      maxWidth: '900px',
      minWidth: '100vw',

      minHeight: '92vh',
      alignItems: 'center',
    }}>
        <Box
          style={{
            flex: 1,
            maxWidth: "450px",
            backgroundColor: "#1e1e1e",
            padding: "40px 30px",
            
            display: "flex",
            margin: '20px',
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px 10px 10px 10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Typography variant="h4" gutterBottom align="center">
            Register
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                type="text"
                fullWidth
                autoFocus={true}
                error={Boolean(displayNameError)}
                helperText={displayNameError}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                InputLabelProps={{ style: { color: "#fff" } }}
                InputProps={{
                  style: { color: "#fff", backgroundColor: "black", borderRadius: '14px 14px 0px 0px' },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                error={Boolean(emailError)}
                helperText={emailError}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputLabelProps={{ style: { color: "#fff" } }}
                InputProps={{
                  style: { color: "#fff", backgroundColor: "black" },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                error={Boolean(passwordError)}
                helperText={passwordError}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputLabelProps={{ style: { color: "#fff" } }}
                InputProps={{
                  style: { color: "#fff", backgroundColor: "black", borderRadius: '0px 0px 14px 14px' },
                }}
              />
            </Grid>

            {submissionError && (
              <Grid item xs={12}>
                <Alert severity="error">{submissionError}</Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleSignUp}
                sx={{
                  borderColor: "gray",
                  backgroundColor: "black",
                  padding: 1,
                  marginTop: '30px',
                  border: "1px solid gray",
               
                    "&:hover": {
                      backgroundColor: "#555",
                   
                    
                  },
                }}
              >
                Register
              </Button>
            </Grid>
            <Typography
              gutterBottom
              width="100%"
              marginTop="10px"
              display="flex"
              color="gray"
              alignItems="center"
              gap="6px"
              justifyContent="center"
              variant="h6"
              align="center"
            >
              <div style={{ width: "30%", height: "1px", backgroundColor: "gray" }} />
              or
              <div style={{ width: "30%", height: "1px", backgroundColor: "gray" }} />
            </Typography>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleGoogleSignIn}
                sx={{
                  color: "#fff",
                  borderColor: "gray",
                  backgroundColor: "black",
                  padding: 1,
                  border: "1px solid gray",
                  "&:hover": {
                    backgroundColor: "#555",
                 
                    border: "1px solid gray",
                },
                }}
              >
                <FcGoogle style={{ fontSize: "20px", marginRight: "10px" }} /> Continue with Google
              </Button>
            </Grid>

            <Link
              to="/login"
              style={{ width: "100%", textDecoration: "none" }}
              replace
            >
              <p
                style={{
                  color: "white",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "center",
                  marginTop: "20px",
                }}
              >
                Already Registered? Click to Login
              </p>
            </Link>
          </Grid>
        </Box>
        <Box
          sx={{
            flex: 1,
           
            padding: "30px",
            minHeight: "70vh",
            maxWidth: "450px",
            display: {xs: "none", md: "flex"},
            margin: '20px',
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
           
          }}
        >
          <Typography variant="h6" align="center" style={{ color: "#fff", fontStyle: 'italic' }}>
            {randomQuote}
          </Typography>
        </Box>
      </div>
    </div>
  );
};

export default Register;
