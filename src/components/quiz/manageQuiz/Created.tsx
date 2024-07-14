import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { fetchUserQuizzes, hostQuiz } from "../../../services/quizService";
import userAtom from "../../../atom/authAtom/userAtom";
import { useNavigate } from "react-router-dom";
import userCreatedQuizAtom from "../../../atom/authAtom/userCreatedQuizAtom";
import invitationCodeAtom from "../../../atom/manageQuizAtom/invitationCodeAtom";

const Created = () => {
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useRecoilState(userCreatedQuizAtom);
  const setInvitionCode = useSetRecoilState(invitationCodeAtom);

  useEffect(() => {
    setUp();
  }, []);

  const setUp = async () => {
    if (quizzes === null) {
      setQuizzes(await fetchUserQuizzes(user));
    }
  };

  const handleHostQuiz = async (quizId: string) => {

    const recivedData = await hostQuiz(quizId, user.uid);
    setInvitionCode(recivedData.invitationCode);
    navigate(`/join/game/${recivedData.activeQuizRef.id}`);
  };

  return (
    <Container>
      <Typography variant="h4" margin={"20px 0px"} color={"white"}>Created Quizzes</Typography>
      <Grid container spacing={2} marginTop={"20px"}>
        {quizzes &&
          quizzes.map((quiz: any) => (
            <Grid item key={quiz.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                sx={{
                  position: "relative",
                  borderRadius: "16px",
                  overflow: "hidden",
                  cursor: "pointer",
                  border: '1px solid gray',
                  backgroundColor: "white",
                  "&:hover .hover-text": {
                    opacity: 1,
                  },
                }}
                onClick={() => {
                  handleHostQuiz(quiz.id);
                }}
              >
                <Box
                  sx={{
                    background: "black", // Set a background color similar to the image
                    padding: "20px",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: '0px',
                    boxShadow: "4",
                  }}
                >
                  <Typography variant="body2" component="div">
                    {quiz.quizzes.length} Qs
                  </Typography>
                  <Typography variant="body2" component="div">
                    {quiz.totalDuration} sec
                  </Typography>
                </Box>
                <CardContent>
                  <Box display="flex" justifyContent="start" mt={"20px"}>
                    <Typography variant="h6" component="div" gutterBottom>
                      {quiz.quizName}
                    </Typography>
                  </Box>
                </CardContent>
                <Box
                  className="hover-text"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-around",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                    borderRadius: '16px',
                  }}
                >
                  <div></div>
                  <Typography variant="h6" component="div">
                    Host
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
           <Grid item  xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                position: "relative",
                borderRadius: "16px",
                overflow: "hidden",
                cursor: "pointer",
                border: '1px solid gray',
                backgroundColor: "white",
                "&:hover .hover-text": {
                  opacity: 1,
                },
              }}
              onClick={() => {
                navigate('/create')
              }}
            >
              <Box
                sx={{
                  background: "black", // Set a background color similar to the image
                  padding: "20px",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: '0px',
                  boxShadow: "4",
                }}
              >
                <Typography variant="body2" component="div">
                  Click to Create
                </Typography>
                
               
              </Box>
              <CardContent>
                <Box display="flex" justifyContent="start" mt={"20px"}>
                  <Typography variant="h6" component="div" gutterBottom>
                    Create New
                  </Typography>
                </Box>
                
              </CardContent>
              <Box
                  className="hover-text"
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-around",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "white",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                    borderRadius: '16px',
                  }}
                >
                  <div></div>
                  <Typography variant="h6" component="div">
                    Create
                  </Typography>
                </Box>
            </Card>
          </Grid>
      </Grid>
    </Container>
  );
};

export default Created;
