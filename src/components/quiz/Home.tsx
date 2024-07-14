import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atom/authAtom/userAtom";
import {
  Box,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import JoinButton from "./uiComponent/JoinButton";
import { fetchUserQuizzes } from "../../services/quizService";
import userCreatedQuizAtom from "../../atom/authAtom/userCreatedQuizAtom";
import Created from "./manageQuiz/Created";
import Completed from "./manageQuiz/Completed";

const Home = () => {
  const user = useRecoilValue(userAtom);
  const [quizzes, setQuizzes] = useRecoilState(userCreatedQuizAtom);


  useEffect(() => {
    setUp();
  }, []);

  const setUp = async () => {
    if (quizzes === null) {
      setQuizzes(await fetchUserQuizzes(user));
    }

  };




  return (
    <div>
      <Container sx={{
      }}>
        <Grid container  marginTop={"20px"}  >
          <Grid
            item
            xs={12}
            md={8}
            sx={{
              border: "2px solid",
              borderColor: "#333",
              backgroundColor: "black",
            }}
            padding={"0px 30px 60px 30px"}
            borderRadius={"16px"}
          >
            <Box
              maxWidth={"400px"}
              sx={{
                margin: "auto",
              }}
            >
              <JoinButton />
            </Box>
          </Grid>
          <Grid item xs={12} md={4} padding={"10px"} sx={{
            display: { xs: "none", md: "block" },
          }} >
            <Box bgcolor={"black"} color={"white"} padding={"30px"}  borderRadius={"16px"} sx={{ border: "2px solid", borderColor: "#333" }}>
              <Typography variant="h6" component="div">
                User Profile
              </Typography>
              <Typography variant="body2" color="lightgray">
                Name: {user.displayName}
              </Typography>
              <Typography variant="body2" color="lightgray">
                Email: {user.email}
              </Typography>
            </Box>
          </Grid>
        </Grid>

      </Container>
      <div style={{
        marginTop: "30px",
      }}>

          <Created />
      </div>
      <div style={{
        marginTop: "40px",
        paddingBottom: "40px",
      }}>

          <Completed />
      </div>
    </div>
  );
};

export default Home;
