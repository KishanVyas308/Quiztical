import React, { useEffect, useState } from "react";
import { signInWithGoogle, signIn } from "../../services/authService";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Alert, Box } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { useSetRecoilState } from "recoil";
import userAtom from "../../atom/authAtom/userAtom";
import { Link, useNavigate } from "react-router-dom";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa6";
const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [submissionError, setSubmissionError] = useState<string>("");
  const [randomQuote, setRandomQuote] = useState<{ quote: string, author: string }>({ quote: "", author: "" });
  const setUser = useSetRecoilState(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (randomQuote.quote === "") {
      handleGenerateQuote();
    }
  }, []);

  const quotes = [
    "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt",
    "The purpose of our lives is to be happy. - Dalai Lama",
    "Life is what happens when you’re busy making other plans. - John Lennon",
    "Get busy living or get busy dying. - Stephen King",
    "You have within you right now, everything you need to deal with whatever the world can throw at you. - Brian Tracy",
    "The unexamined life is not worth living. - Socrates",
    "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment. - Ralph Waldo Emerson",
    "In the end, we will remember not the words of our enemies, but the silence of our friends. - Martin Luther King Jr.",
    "The only true wisdom is in knowing you know nothing. - Socrates",
    "What we achieve inwardly will change outer reality. - Plutarch",
    "The mind is everything. What you think you become. - Buddha",
    "He who has a why to live can bear almost any how. - Friedrich Nietzsche",
    "We are what we repeatedly do. Excellence, then, is not an act, but a habit. - Aristotle",
    "The journey of a thousand miles begins with one step. - Lao Tzu",
    "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment. - Buddha",
    "The privilege of a lifetime is to become who you truly are. - Carl Jung",
    "The wound is the place where the Light enters you. - Rumi",
    "The quieter you become, the more you are able to hear. - Rumi",
    "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it. - Rumi",
    "Man suffers only because he takes seriously what the gods made for fun. - Alan Watts",
    "We are not human beings having a spiritual experience. We are spiritual beings having a human experience. - Pierre Teilhard de Chardin",
    "What lies behind us and what lies before us are tiny matters compared to what lies within us. - Ralph Waldo Emerson",
    "Until you make the unconscious conscious, it will direct your life and you will call it fate. - Carl Jung",
    "The meaning of life is to find your gift. The purpose of life is to give it away. - Pablo Picasso",
    "Happiness is not something ready-made. It comes from your own actions. - Dalai Lama",
  ];

  const handleGenerateQuote = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const [quote, author] = randomQuote.split(" - ");
    setRandomQuote({ quote, author });
  };

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
        navigate("/");
      }
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
          <Typography variant="h4" gutterBottom align="center" sx={{ marginBottom: "40px" }}>
            Login
          </Typography>
          <Grid container spacing={2}>
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
                InputLabelProps={{ style: { color: "#fff" } }}
                InputProps={{
                  style: { color: "#fff", backgroundColor: "black", borderRadius: '14px 14px 0px 0px' },
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
                onClick={handleLogin}
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
                Login
              </Button>
            </Grid>
            <Typography
              gutterBottom
              width="100%"
              marginTop="20px"
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
                  },
                }}
              >
                <FcGoogle style={{ fontSize: "20px", marginRight: "10px" }} /> Continue with Google
              </Button>
            </Grid>

            <Link
              to="/register"
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
                New user? Click to Register
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
            display: { xs: "none", md: "flex" },
            margin: '20px',
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        
        >
          <Typography variant="h5" component={"p"} align="center"  style={{ fontFamily: 'cursive', color: "#fff", fontStyle: 'italic' }}>
          <FaQuoteLeft style={{color: "#ccc"}}/>{randomQuote.quote} <FaQuoteRight style={{color: "#ccc"}}/>
          </Typography>
          <Typography variant="h6" component={"p"} align="center" style={{ fontFamily: 'serif', color: "#ccc", marginTop: '10px' }}>
            - {randomQuote.author}
          </Typography>
        </Box>
      </div>
    </div>
  );
};

export default Login;
