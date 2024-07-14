import { Box, Grid, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import  { useEffect, useState } from 'react'
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { useSpring, animated, config} from '@react-spring/web';
import { FaTrophy } from 'react-icons/fa';

const FinishGame = ({getSortedParticipants, user, isHost, quiz}: any) => {
    const sortedParticipants = getSortedParticipants();
    const topThree = sortedParticipants.slice(0, 3);
    const others = sortedParticipants.slice(3);
    const abcdef = ["a", "b", "c", "d", "e"];
    const [currentParticipant, setCurrentParticipent] = useState<any>(null);
    useEffect(() => {
        if(currentParticipant === null){
            
            setCurrentParticipent(
              sortedParticipants.find((participant: any) => participant.id === user.uid)
            );
        }
    }, [sortedParticipants]);

    const handleChangeSelectedParticipentForHost = (
    
      selectedParticipentId: string,
    ) => {
   
    
      
      if (isHost) {
        setCurrentParticipent(
          sortedParticipants.find(
            (participant: any) => participant.id === selectedParticipentId
          )
        );
      }
    };
  return (
    <Box
    sx={{
      width: "100%",
      minHeight: "100vh",
      height: "100%",
      backgroundColor: "#230d21",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Typography
      variant="h4"
      color="white"
      gutterBottom
      sx={{ textAlign: "center", marginBottom: 4, marginTop: 4 }}
    >
      Game Finished
    </Typography>

    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: { xs: "column", sm: "row" },
        marginBottom: 4,
      }}
    >
      {topThree.map((participant: any, index: number) => (
        <AnimatedTopParticipant
          key={participant.id}
          participant={participant}
          rank={index + 1}
          handleChangeSelectedParticipentForHost={handleChangeSelectedParticipentForHost}
        />
      ))}
    </Box>
    {others && (
      <List
        sx={{
          width: "80%",
          maxWidth: 360,

          marginBottom: 4,
        }}
      >
        {others.map((participant: any, index: number) => (
          <ListItem key={participant.id}>
            <ListItemText
              primary={`${index + 4}. ${participant.displayName} - ${
                participant.totalPoint
              } points`}
              sx={{ color: "white" }}
            />
          </ListItem>
        ))}
      </List>
    )}
    {isHost ? (
      <Typography variant="h6" color="white" sx={{ marginBottom: 2 }}>
        You Are The Host
      </Typography>
    ) : (
      <Typography variant="h6" color="white" sx={{ marginBottom: 2 }}>
        Your Position:{" "}
        {sortedParticipants.findIndex((p: any) => p.id === user.uid) + 1}
      </Typography>
    )}

    <Typography
      variant="h5"
      color="white"
      gutterBottom
      sx={{ textAlign: "center", marginTop: 4, marginBottom: 2 }}
    >
      Quiz Summary
      {isHost && (
        <Typography
          variant="h6"
          color="white"
          gutterBottom
          sx={{ textAlign: "center", marginTop: 4, marginBottom: 2 }}
        >{
            currentParticipant ? (
                <Typography
                    variant="h6"
                    color="whitesmoke"
                    gutterBottom
                    sx={{ textAlign: "center", marginTop: 4, marginBottom: 2 }}
                >
 Quiz Summary of <span style={{fontWeight: "bold" , color: "white"}}>  {currentParticipant.displayName} </span>
               
                </Typography>
            ) : (
                <Typography
                variant="h6"
                color="white"
                gutterBottom
                sx={{ textAlign: "center", marginTop: 4, marginBottom: 2 }}
            >

Select Your Participant
            </Typography>
            )

        }
        </Typography>
      )}
    </Typography>

    <List
      sx={{
        width: "80%",
        bgcolor: "background.paper",
        marginBottom: 16,
        borderRadius: "16px",
        paddingBottom: 4,
        paddingRight: 1,
        paddingLeft: 1,
        boxShadow: 3,
      }}
    >
      {quiz &&
        quiz.quizzes.map((question: any, index: number) => (
          <ListItem key={index}>
            <Box bgcolor={"white"} width={"100%"} display={"flex"} gap={1}>
              <Typography
                variant="h6"
                color="black"
                sx={{ marginBottom: 2 }}
              >
                {index + 1}.
              </Typography>
              <div style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginRight: "10px",
                  }}
                >
                  <Typography
                    variant="h6"
                    color="black"
                    sx={{ marginBottom: 1.5 }}
                  >
                    {question.question}
                  </Typography>
                  {currentParticipant &&
                  question.options[
                    currentParticipant.questions[index].selectedOption
                  ].isCorrect ? (
                    <CheckIcon sx={{ color: "green" }} />
                  ) 
                   : (
                    <ClearIcon sx={{ color: "red" }} />
                  )}
                </div>
                <div style={{ width: "100%" }}>
                  <Grid
                    width={"100%"}
                    container
                    bgcolor={
                      currentParticipant &&
                      question.options[
                        currentParticipant.questions[index].selectedOption
                      ].isCorrect
                        ? "lightgreen"
                        
                        : "#fcc2f7"
                    }
                    spacing={1}
                    justifyContent="start"
                    alignItems="start"
                    padding={2}
                    borderRadius={"8px"}
                  >
                    {question.options.map((option: any, i: number) => (
                      <Grid item xs={12} sm={12} md={6} lg={6} key={i}>
                        <Box display={"flex"}>
                          <Typography
                            variant="h6"
                            color={option.isCorrect ? "green" : "black"}
                            fontWeight={option.isCorrect ? 600 : 400}
                            sx={{ marginBottom: 2 }}
                          >
                            {abcdef[i]}.{" "}
                          </Typography>
                          <Typography
                            variant="h6"
                            color={
                              option.isCorrect
                                ? "green"
                                : currentParticipant &&
                                  currentParticipant.questions[index]
                                    .selectedOption === i
                                ? "red"
                                : "black"
                            }
                            display={"flex"}
                            gap={1}
                            alignItems={"center"}
                            fontWeight={option.isCorrect ? 600 : 400}
                            sx={{
                              marginBottom: 2,
                              marginLeft: 1,
                              textDecoration:
                                currentParticipant &&
                                currentParticipant.questions[index]
                                  .selectedOption === i
                                  ? "line-through"
                                  : "none",
                            }}
                          >
                            {option.text}{" "}
                            {option.isCorrect ? <CheckIcon /> : <></>}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </div>
              </div>
            </Box>
          </ListItem>
        ))}
    </List>
  </Box>
  )
}

const AnimatedTopParticipant = ({ participant, rank, handleChangeSelectedParticipentForHost }: any) => {
    const props = useSpring({
      from: { opacity: 0, transform: "translateY(20px)" },
      to: { opacity: 1, transform: "translateY(0)" },
      config: config.stiff,
      delay: (3 - rank) * 500,
    });
  
    return (
      <animated.div style={props}>
        <Paper
          elevation={3}
          sx={{
            padding: 3,
            textAlign: "center",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            width: "200px",
            margin: "10px 10px",
            borderRadius: "16px",
          }}
          onClick={() => {handleChangeSelectedParticipentForHost(participant.id)}}
        >
          <FaTrophy
            size={50}
            style={{
              color: rank === 1 ? "gold" : rank === 2 ? "silver" : "bronze",
              marginBottom: 8,
            }}
          />
          <Typography variant="h6">
            {rank}. {participant.displayName}
          </Typography>
          <Typography variant="body1">{participant.totalPoint} points</Typography>
        </Paper>
      </animated.div>
    );
  };

export default FinishGame
