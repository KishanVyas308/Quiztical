import React, { useState } from "react";
import { signInWithGoogle, signIn } from "../../services/authService";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Container, Alert } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { useSetRecoilState } from "recoil";
import userAtom from "../../atom/authAtom/userAtom";
import { Link, useNavigate } from "react-router-dom";
import Quote from "./Quote";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [submissionError, setSubmissionError] = useState<string>("");

  const setUser = useSetRecoilState(userAtom);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleLogin = async () => {
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
      const logedInUser = await signIn(email, password);
      if (logedInUser !== null) {
        setUser(logedInUser);
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
    } catch (error) {
      setSubmissionError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: '#fff' }}>
      <Container
        maxWidth="lg"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Container
          maxWidth="sm"
          style={{
            margin: 'auto',
            height: '92vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Container
            style={{
              color: '#fff',
              backgroundColor: '#1e1e1e',
              padding: '30px',
              borderRadius: '10px',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
            }}
          >
            <Typography variant="h4" gutterBottom align="center">
              Login
            </Typography>
            <Grid container marginTop="30px" spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  autoFocus={true}
                  error={Boolean(emailError)}
                  helperText={emailError}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputLabelProps={{ style: { color: '#fff' } }}
                  InputProps={{
                    style: { color: '#fff', backgroundColor: '#2c2c2c' },
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
                  InputLabelProps={{ style: { color: '#fff' } }}
                  InputProps={{
                    style: { color: '#fff', backgroundColor: '#2c2c2c' },
                  }}
                />
              </Grid>

              {submissionError && (
                <Grid item xs={12}>
                  <Alert severity="error">{submissionError}</Alert>
                </Grid>
              )}

              <Grid marginTop="20px" item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleLogin}
                  sx={{
                    borderColor: 'gray',
                    backgroundColor: 'black',
                    padding: 1,
                    '&:hover': {
                      backgroundColor: 'gray',
                    },
                  }}
                >
                  Login
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
                <div style={{ width: '30%', height: '1px', backgroundColor: 'gray' }} />
                or
                <div style={{ width: '30%', height: '1px', backgroundColor: 'gray' }} />
              </Typography>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleGoogleSignIn}
                  style={{
                    color: '#fff',
                    borderColor: 'gray',
                    backgroundColor: 'black',
                    padding: 8,

                  }}
                >
                  <FcGoogle style={{ fontSize: '20px', marginRight: '10px' }} /> Continue with Google
                </Button>
              </Grid>

              <Link
                to="/register"
                style={{ width: '100%', textDecoration: 'none' }}
                replace
              >
                <p
                  style={{
                    color: '#1e90ff',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'center',
                    marginTop: '20px',
                  }}
                >
                  New user? Click to Register
                </p>
              </Link>
            </Grid>
          </Container>
        </Container>
        <Container
          maxWidth="sm"
          style={{
            margin: 'auto',
            height: '92vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Quote />
        </Container>
      </Container>
    </div>
  );
};

export default Login;
