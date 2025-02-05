import { Box, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import { useEffect } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import userCompletedQuizAtom from '../../../atom/authAtom/userCompletedQuizAtom';
import { useNavigate } from 'react-router-dom';
import { fetchCompletedQuizes } from '../../../services/quizService';
import userFromCollectionAtom from '../../../atom/authAtom/userFromCollectionAtom';


const Completed = () => {
  const userFromCollection = useRecoilValue(userFromCollectionAtom);
  const [quizzes, setQuizzes] = useRecoilState(userCompletedQuizAtom);
  const navigate = useNavigate();

  const setUp = async () => {
   
    if (quizzes === null) {
      setQuizzes(await fetchCompletedQuizes(userFromCollection));
    }
  };

  useEffect(() => {
    if(quizzes === null) {
      setUp()
    } 
  }, [])
  const handleOpen = (id: string) => {
    navigate(`/join/game/${id}`);
  }

  return (
    <Container>
    <Typography variant="h4" margin={"20px 0px"} color={"white"}>Completed Quizzes</Typography>
    <Grid container spacing={2} marginTop={"20px"}>
      {quizzes && 
        quizzes.map((quiz: any, index: number) => (
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
                handleOpen(userFromCollection.completed[index].activeQuizId);
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
                {quiz.createdBy === userFromCollection.uid 
                &&
               
                <Typography variant="body2" component="div">
                  Hosted
                </Typography>
                }
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
                    Open
                  </Typography>
                </Box>
            </Card>
          </Grid>
        ))}

        {
          quizzes === null &&
          <Typography variant="h6" color={"gray"} padding={"20px"} component="div" gutterBottom>
            No Completed Quizzes
          </Typography>
        }
        
    </Grid>
  </Container>
  )
}

export default Completed
