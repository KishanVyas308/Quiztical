import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import {
  Button,
  Container,
  Grid,
  ListItemText,
  Typography,
  Paper,
  Avatar,
  Box,
  Divider,
  Tooltip,
  Zoom,
  Checkbox,
  CircularProgress,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  fetchCurrentActiveQuizeQuestions,
  removeUser,
  changeGameStatus,
  fetchAllParticipantFromCurretQuiz,
  addQuizCompletedToUser,
} from "../../services/quizService";
import userAtom from "../../atom/authAtom/userAtom";
import invitationCodeAtom from "../../atom/manageQuizAtom/invitationCodeAtom";
import isUserInGameAtom from "../../atom/authAtom/isUserInGameAtom";
import { Howl } from "howler";
import { FaUsers } from "react-icons/fa";
import isEqual from "lodash/isEqual";
import { FaTrophy } from "react-icons/fa";
import { useSpring, animated, config } from "@react-spring/web";

import FinishGame from "./uiComponent/FinishGame";
import userFromCollectionAtom from "../../atom/authAtom/userFromCollectionAtom";
import { fatchUserFromCollection } from "../../services/authService";

enum GameStatus {
  leaderboard = "leaderboard",
  waiting = "waiting",
  coundown = "coundown",
  started = "started",
  finished = "finished",
}

const JoinGamePage: React.FC = () => {
  const { activeQuizId } = useParams<{ activeQuizId: string }>();
  const navigate = useNavigate();
  const user = useRecoilValue(userAtom);
  const invitationCode = useRecoilValue(invitationCodeAtom);
  const [participants, setParticipants] = useState<any>([]);
  const [isHost, setIsHost] = useState(false);
  const setIsUserInGame = useSetRecoilState(isUserInGameAtom);
  const [gameStatus, setGameStatus] = useState("waiting");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuizNumber, setCurrentQuizNumber] = useState(-1);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [submissionTime, setSubmissionTime] = useState<number | null>(null);
  const [quizId, setQuizId] = useState<string | null>(null);
  const  setUserFromCollection = useSetRecoilState(
    userFromCollectionAtom
  );

  const previousParticipantsRef = useRef<any>([]);

  const [tooltipOpen, setTooltipOpen] = useState(false);

  const joinSound = new Howl({ src: ["/sounds/join.mp3"] });
  const leaveSound = new Howl({ src: ["/sounds/leave.mp3"] });
  const countdownSound = new Howl({ src: ["/sounds/countdown.mp3"] });

  useEffect(() => {
    if (
      participants.find((participant: any) => participant.id === user.uid) ||
      isHost
    ) {
      if (previousParticipantsRef.current.length < participants.length) {
        if (gameStatus === GameStatus.waiting) {
          joinSound.play();
        }
      } else if (previousParticipantsRef.current.length > participants.length) {
        if (gameStatus === GameStatus.waiting) {
          leaveSound.play();
        }
      }
    } else if (participants.length > 0) {
      if (gameStatus === GameStatus.waiting) {
        leaveSound.play();
      }
      navigate("/home", { replace: true });
    }
    previousParticipantsRef.current = participants;
  }, [participants]);

  useEffect(() => {
    const fetchQuizData = async (quizId: string) => {
      try {
        if (!quiz) {
          const fetchedQuiz = await fetchCurrentActiveQuizeQuestions(quizId);
          setQuiz(fetchedQuiz);
          setQuizId(quizId);
          console.log("quiz", fetchedQuiz);
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };

    const activeQuizRef = doc(db, "activeQuizzes", activeQuizId!);
    const unsubscribe = onSnapshot(activeQuizRef, (docSnapshot) => {
      const data = docSnapshot.data();
      if (data) {
        setIsHost(data.hostId === user.uid);
        setGameStatus(data.status);
        setCurrentQuizNumber(data.curQuestionNumber);
        if (!quiz && data.quizId) {
          fetchQuizData(data.quizId);
        }
      }
      console.log("i am working.....");
    });

    return () => unsubscribe();
  }, [activeQuizId, user.uid, quiz]);

  useEffect(() => {
    const activeQuizRef = doc(db, "activeQuizzes", activeQuizId!);
    const participantRef = collection(activeQuizRef, "participants");

    const unsubscribe = onSnapshot(participantRef, (querySnapshot) => {
      if (gameStatus === GameStatus.waiting) {
        const participantsData: any = [];
        querySnapshot.forEach((doc) => {
          participantsData.push(doc.data() as any);
        });
        if (!isEqual(participants, participantsData)) {
          console.log("previous participants", participants);
          console.log("participants updated...", participantsData);

          setParticipants(participantsData);
        }
      }
    });

    return () => unsubscribe();
  }, [participants]);

  const handleRemoveUser = async (participant: any) => {
    await removeUser(activeQuizId!, participant);
  };

  const handleStartQuiz = async () => {
    if (countdown === null && isHost) {
      await changeGameStatus(GameStatus.coundown, activeQuizId!);
      setCountdown(3);
      countdownSound.play();
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            changeGameStatus(GameStatus.started, activeQuizId!);
            return null;
          }
          return prev! - 1;
        });
      }, 1000);
    }
  };

  useEffect(() => {
    if (gameStatus === GameStatus.coundown && !isHost) {
      setCountdown(3);
      countdownSound.play();
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownInterval);
            return null;
          }
          return prev! - 1;
        });
      }, 1000);
    }

    if (gameStatus === GameStatus.started && quiz) {
      const currentQuestion = quiz.quizzes[currentQuizNumber];
      setTimer(currentQuestion.duration);
      console.log(
        "game in question mode........",
        currentQuizNumber,
        currentQuestion
      );

      const timerInterval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(timerInterval);
            handleQuestionEnd();
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerInterval);
    }

    if (gameStatus === GameStatus.leaderboard) {
      if (selectedOption !== null && submissionTime !== null && !isHost) {
        updateParticipantData();
      }
      setSelectedOption(null);
      setSubmissionTime(null);

      setTimeout(async () => {
        console.log("fetching participents");
        setParticipants(await fetchAllParticipantFromCurretQuiz(activeQuizId!));
        console.log("updated participents :", participants);
      }, 1000);

      console.log(
        "game in leader board........",
        currentQuizNumber,
        currentQuestion
      );
    }
    if (gameStatus === GameStatus.finished) {

      const temp = async () => {

        await addQuizCompletedToUser(activeQuizId!, user, quizId!);
        setUserFromCollection(await fatchUserFromCollection(user.email));
      }

      temp()
      
    }
  }, [gameStatus, quiz, currentQuizNumber]);



  const handleNavigateAway = () => {
    if (window.confirm("Are you sure you want to leave this page?")) {
      setIsUserInGame(false);
      navigate("/home", { replace: true });
    }
  };

  useEffect(() => {
    setIsUserInGame(true);
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      handleNavigateAway();
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useMemo(() => {
    if (quiz) {
      setCurrentQuestion(quiz.quizzes[currentQuizNumber]);
    }
  }, [currentQuizNumber, quiz]);

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    setSubmissionTime(timer);
  };

  const handleQuestionEnd = async () => {
    if (isHost) {
      await changeGameStatus(GameStatus.leaderboard, activeQuizId!);
    }
  };

  const updateParticipantData = async () => {
    const activeQuizRef = doc(db, "activeQuizzes", activeQuizId!);
    const participantRef = doc(
      collection(activeQuizRef, "participants"),
      user.uid
    );
    const participantDoc = await getDoc(participantRef);

    if (!participantDoc.exists()) {
      console.log("No such participant!");
      return;
    }

    let isCorrect = false;
    currentQuestion.options.forEach((option: any, index: number) => {
      if (selectedOption === index && option.isCorrect === true) {
        isCorrect = true;
      }
    });
    const points = submissionTime! * 100;

    const participantData = participantDoc.data();
    const updatedData = {
      totalPoint: isCorrect
        ? participantData.totalPoint + points
        : participantData.totalPoint,
      rightAns: isCorrect
        ? participantData.rightAns + 1
        : participantData.rightAns,
      wrongAns: !isCorrect
        ? participantData.wrongAns + 1
        : participantData.wrongAns,
      questions: arrayUnion({
        questionNumber: currentQuizNumber, // Assuming your question object has a 'number' property
        selectedOption: selectedOption,
      }),
    };

    await updateDoc(participantRef, updatedData);
  };
  const handleChangeFromLeaderBoard = async () => {
    if (currentQuizNumber + 1 < quiz!.quizzes.length) {
      await updateDoc(doc(db, "activeQuizzes", activeQuizId!), {
        curQuestionNumber: currentQuizNumber + 1,
      });
      await changeGameStatus(GameStatus.started, activeQuizId!);
    } else {
      await changeGameStatus(GameStatus.finished, activeQuizId!);
    }
  };

  //! to handle copying invition code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(invitationCode);
    setTooltipOpen(true);
    setTimeout(() => {
      setTooltipOpen(false);
    }, 2000); // Tooltip will be visible for 2 seconds
  };

  //! code for leaderboard
  const getSortedParticipants = () => {
    return [...participants].sort((a, b) => b.totalPoint - a.totalPoint);
  };

  if (gameStatus === GameStatus.waiting || gameStatus === GameStatus.coundown) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          height: "100%",
          backgroundColor: "#230d21",
        }}
      >
        <Box
          sx={{
            backgroundColor: "rgba(0, 0, 0)",

            padding: "15px 10px 10px 10px",

            color: "white",
            boxShadow: 3,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Waiting Room..
          </Typography>
        </Box>

        <Container maxWidth={"xs"}>
          <Box
            sx={{
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              padding: "20px",
              marginTop: "20px",
              color: "white",
              boxShadow: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Hover to copy the code..
            </Typography>

            <Typography
              variant="h6"
              gutterBottom
              sx={{
                marginTop: "20px",
              }}
            >
              Invitation Code
            </Typography>
            <Tooltip
              title="Invitation code copied!"
              open={tooltipOpen}
              arrow
              disableHoverListener
              placement="top"
            >
              <Typography
                variant={"h4"}
                sx={{
                  width: "100%",
                  padding: "5px 0px",
                  borderRadius: "10px",
                  backgroundColor: "white",
                  color: "black",
                  fontFamily: "monospace",
                  fontWeight: "bold",
                  textAlign: "center",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "gray",
                  },
                }}
                onMouseEnter={handleCopyCode}
                onClick={handleCopyCode}
              >
                {invitationCode}
              </Typography>
            </Tooltip>

            {countdown !== null && (
              <Typography
                variant="h1"
                sx={{ textAlign: "center", marginTop: "20px" }}
              >
                {countdown}
              </Typography>
            )}
          </Box>
        </Container>
        <Box
          sx={{
            marginBottom: "10px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Divider
            sx={{
              width: "100%",
              marginTop: "55px",
              display: { xs: "none", sm: "block" },
              height: "1px",
              bgcolor: "black",
              position: "absolute",
              left: "0",
              right: "0",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              marginTop: "30px",
              padding: { xs: "10px 10px", sm: "10px 20px" },
              borderRadius: "13px",
              bgcolor: { sm: "black" },
              color: "white",

              left: { xs: "5px", sm: "40px" },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                display: "flex",
              }}
            >
              <FaUsers
                style={{
                  fontSize: "34px",
                }}
              />
              {participants.length}
            </Typography>
          </Box>
          <Tooltip
            TransitionComponent={Zoom}
            title={isHost ? "You can start" : "Hyy.. You are not host"}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={handleStartQuiz}
              sx={{
                marginTop: "20px",
                padding: { xs: "10px 30px", sm: "10px 50px" },
                fontSize: "26px",
                borderRadius: "16px",
                boxShadow: "0px 5px 0px purple",
                transition: "all 0.15s ease-in-out",
                ":hover": {
                  boxShadow: "0px 2px 0px purple",
                  transform: "translateY(3px)",
                },
              }}
            >
              Start
            </Button>
          </Tooltip>
        </Box>

        <Grid container spacing={2} padding={"40px"}>
          {participants &&
            participants.map((participant: any) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={2}
                key={participant.id}
              >
                <Tooltip
                  TransitionComponent={Zoom}
                  title={isHost && "Click to remove user"}
                >
                  <Paper
                    elevation={2}
                    sx={{
                      padding: "20px",
                      display: "flex",
                      borderRadius: "18px",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      transition: "all 0.15s ease-in-out",
                      color: "white",
                      cursor: "pointer",
                      ":hover": isHost
                        ? {
                            backgroundColor: "rgba(255, 0, 0, 0.8)",
                          }
                        : {},
                    }}
                    onClick={
                      isHost ? () => handleRemoveUser(participant) : undefined
                    }
                  >
                    <ListItemText primary={participant.displayName} />

                    <Avatar
                      sx={{
                        marginRight: "10px",
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                      }}
                    >
                      {participant.displayName.charAt(0)}
                    </Avatar>
                  </Paper>
                </Tooltip>
              </Grid>
            ))}
        </Grid>
      </div>
    );
  }

  if (gameStatus === GameStatus.started) {
    return (
      <Box
        width="100%"
        height="100vh"
        color="white"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
        textAlign="center"
        style={{
          background: "linear-gradient(135deg, black, #230d21)",
        }}
      >
        <Box
          marginTop="20px"
          display={"flex"}
          width={"100%"}
          justifyContent={"space-between"}
        >
          <Typography variant="h6">
            {" "}
            Questions: {currentQuizNumber + 1}/{quiz.quizzes.length}
          </Typography>
          <Box>
            <Typography variant="h6">Time Remaining: {timer}s</Typography>
            <CircularProgress
              variant="determinate"
              value={(timer / currentQuestion.duration) * 100}
              style={{ color: "#66fcf1", marginTop: "10px" }}
            />
          </Box>
        </Box>

        <Typography variant="h4" gutterBottom>
          {currentQuestion.question}
        </Typography>
        <Grid
          container
          spacing={3}
          justifyContent="center"
          sx={{ padding: "30px" }}
        >
          {currentQuestion.options.map((option: any, index: number) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={index}
              onClick={() => handleOptionSelect(index)}
            >
              <Paper
                elevation={3}
                style={{
                  padding: "20px",
                  cursor: "pointer",
                  backgroundColor: "#1f2833",
                  border: isHost && option.isCorrect && "2px solid blue",
                  color: selectedOption === index ? "#c5c6c7" : "#c5c6c7",
                  transition: "background-color 0.3s, color 0.3s",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  checked={selectedOption === index}
                  style={{ color: "#66fcf1" }}
                />

                <Typography variant="body1">{option.text}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (gameStatus === GameStatus.leaderboard) {
    const sortedParticipants = getSortedParticipants();

    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "#230d21",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "center", marginBottom: 4, color: "white" }}
        >
          Leaderboard
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            borderRadius: 2,
            width: { xs: "90%", md: "80%", lg: "60%", xl: "50%" },
            boxShadow: 3,
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ color: "white" }}>
                  Rank
                </TableCell>
                <TableCell align="center" sx={{ color: "white" }}>
                  User
                </TableCell>
                <TableCell align="center" sx={{ color: "white" }}>
                  Points
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedParticipants.map((participant, index) => (
                <AnimatedTableRow
                  key={participant.id}
                  index={index}
                  participant={participant}
                  isTopThree={index < 3}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {isHost && (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleChangeFromLeaderBoard}
            sx={{
              marginTop: 4,
              padding: "10px 30px",
              fontSize: "18px",
              borderRadius: "16px",
              boxShadow: "0px 5px 0px purple",
              transition: "all 0.15s ease-in-out",
              ":hover": {
                boxShadow: "0px 2px 0px purple",
                transform: "translateY(3px)",
              },
            }}
          >
            Next
          </Button>
        )}
      </Box>
    );
  }

  if (gameStatus === GameStatus.finished) {
    return (
      <FinishGame
        getSortedParticipants={getSortedParticipants}
        user={user}
        isHost={isHost}
        quiz={quiz}
      />
    );
  }
  return <div>Something went wrong.. please reload</div>;
};

const AnimatedTableRow = ({ index, participant, isTopThree }: any) => {
  const props = useSpring({
    from: { opacity: 0, transform: "scale(0.95)" },
    to: { opacity: 1, transform: "scale(1)" },
    config: config.stiff,
    delay: index * 100,
  });

  return (
    <animated.tr style={props}>
      <TableCell align="center" sx={{ color: "white" }}>
        {index + 1}
        {isTopThree && (
          <FaTrophy
            style={{
              color: index === 0 ? "gold" : index === 1 ? "silver" : "bronze",
              marginLeft: 8,
            }}
          />
        )}
      </TableCell>
      <TableCell align="center" sx={{ color: "white" }}>
        {participant.displayName}
      </TableCell>
      <TableCell align="center" sx={{ color: "white" }}>
        {participant.totalPoint}
      </TableCell>
    </animated.tr>
  );
};

export default JoinGamePage;
