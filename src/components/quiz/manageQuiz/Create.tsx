import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Container,
  Box,
  List,
  ListItem,
  ListItemText,
  Stack,
  Checkbox,
} from "@mui/material";
import { AddCircleOutline, Delete } from "@mui/icons-material";
import { FaRegSave } from "react-icons/fa";
import { fetchUserQuizzes, saveNewQuize } from "../../../services/quizService";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../../../atom/authAtom/userAtom";
import userCreatedQuizAtom from "../../../atom/authAtom/userCreatedQuizAtom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export interface QuizFormValues {
  duration: number;
  questionMarks: number;
  question: string;
  options: { text: string; isCorrect: boolean }[];
}

const durationsArray = [
  5, 10, 15, 20, 25, 30, 45, 60, 90, 120, 180, 240, 300, 600, 900,
];
const questionMarksArray = Array.from({ length: 20 }, (_, i) => i + 1);

const CreateQuiz: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [quizzes, setQuizzes] = useState<QuizFormValues[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [quizName, setQuizName] = useState("");
  const [duration, setDuration] = useState(5);
  const [questionMarks, setQuestionMarks] = useState<number>(1);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);


  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({
    question: "",
    options: "",
  });

  const user = useRecoilValue(userAtom);
  const setUserCreatedQuiz = useSetRecoilState(userCreatedQuizAtom);

  useEffect(() => {
    if (open) {
      setFormErrors({
        question: "",
        options: "",
      });
    }
  }, [open]);

  const handleAddQuiz = () => {
    const errors = validateForm();
    if (Object.values(errors).some((error) => error !== "")) {
      setFormErrors(errors);
      return;
    }

    const quizData = { duration, questionMarks, question, options };

    if (editIndex !== null) {
      const updatedQuizzes = quizzes.slice();
      updatedQuizzes[editIndex] = quizData;
      setQuizzes(updatedQuizzes);
    } else {
      setQuizzes([...quizzes, quizData]);
    }
    handleClose();
  };

  const handleClickOpen = () => {
    setEditIndex(null);
    resetForm();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditIndex(null);
  };

  const handleEdit = (index: number) => {
    const quiz = quizzes[index];
    setDuration(quiz.duration);
    setQuestionMarks(quiz.questionMarks);
    setQuestion(quiz.question);
    setOptions(quiz.options);
    setEditIndex(index);
    setOpen(true);
  };

  const handleDelete = (index: number) => {
    const updatedQuizzes = quizzes.filter((_, i) => i !== index);
    setQuizzes(updatedQuizzes);
  };

  const resetForm = () => {
    setQuestion("");
    setOptions([
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]);
  };

  const validateForm = () => {
    let errors = { question: "", options: "" };

    if (!question.trim()) errors.question = "Question is required";
    if (options.some((option) => !option.text.trim())) {
      errors.options = "All options must have text";
    }
    return errors;
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index].text = value;
    setOptions(updatedOptions);
  };

  const handleCorrectChange = (index: number) => {
    const updatedOptions = options.map((option, idx) => ({
      ...option,
      isCorrect: idx === index ? !option.isCorrect : false,
    }));
    setOptions(updatedOptions);
  };

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, { text: "", isCorrect: false }]);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const updatedOptions = options.filter((_, idx) => idx !== index);
      setOptions(updatedOptions);
    }
  };

  const totalDuration = quizzes.reduce((acc, quiz) => acc + quiz.duration, 0);
  const totalMarks = quizzes.reduce((acc, quiz) => acc + quiz.questionMarks, 0);

  const handleSave = async () => {
    if(quizName === "" ||quizzes.length === 0 ) {
      toast.error("All fields are required");
      return;
    }
    await saveNewQuize({
      quizName,
      totalDuration,
      totalMarks,
      user,
      quizzes,
    });
    setUserCreatedQuiz(await fetchUserQuizzes(user));
    setQuizzes([]);
    setQuizName("");
    navigate('/created');
  };

  return (
    <Box sx={{ backgroundColor: "#121212", minHeight: "100vh", color: "#fff" }}>
      <Container
        maxWidth="lg"
        sx={{
          marginTop: "10px",
          border: "1px solid #333",
          backgroundColor: "#1e1e1e",
          borderRadius: "10px",
          padding: 2,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6" component="p">
            Create new quiz
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSave()}
            sx={{
              minWidth: "110px",
              height: "35px",
              marginLeft: "20px",
              marginTop: "3px",
              backgroundColor: "#333",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#444",
              },
            }}
          >
            <FaRegSave style={{ marginRight: "5px" }} />
            Save Quiz
          </Button>
        </Stack>

        <Stack direction="row" alignItems="center">
          <TextField
            label="Quiz Title"
            variant="outlined"
            fullWidth
            margin="normal"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            size="small"
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "#333",
                color: "#fff",
              },
              "& .MuiFormLabel-root": {
                color: "#bbb",
              },
              "& .MuiFormLabel-root.Mui-focused": {
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
                  borderColor: "#fff",
                },
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            sx={{
              minWidth: "110px",
              height: "35px",
              marginLeft: "20px",
              marginTop: "3px",
              backgroundColor: "#333",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#444",
              },
            }}
          >
            Add Mcq
          </Button>
        </Stack>
        <Typography variant="subtitle1" component="p">
          Total Duration: {totalDuration} seconds
        </Typography>
        <Typography variant="subtitle1" component="p">
          Total Marks: {totalMarks} points
        </Typography>
        <List >
          {quizzes.map((quiz, index) => (
            <ListItem key={index} sx={{ border : '2px solid gray', borderRadius: '10px', marginY: '10px'}} divider>
              <ListItemText primary={quiz.question} sx={{ color: "#fff"}} />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleEdit(index)}
                sx={{
                  marginRight: 1,
                  backgroundColor: "#555",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#444",
                  },
                }}
              >
                Update
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(index)}
                sx={{ backgroundColor: "#a33", color: "#fff" }}
              >
                Delete
              </Button>
            </ListItem>
          ))}
        </List>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
          <Box display="flex" sx={{backgroundColor: "#333"}} justifyContent="space-between" width="100%">
            <DialogTitle sx={{ backgroundColor: "#333", color: "#fff" }}>
              {editIndex !== null ? "Update Quiz Details" : "Add Quiz Details"}
            </DialogTitle>
            <Box
              sx={{
                marginRight: "30px",
                marginLeft: "30px",
                backgroundColor: "#333",
                color: "#fff",
              }}
            >
              <FormControl sx={{ marginRight: "10px" }} margin="normal">
                <Select
                  value={duration}
                  onChange={(event) =>
                    setDuration(event.target.value as number)
                  }
                  size="small"
                  sx={{
                    backgroundColor: "#333",
                    color: "#fff",
                    "& .MuiSelect-select": {
                      backgroundColor: "#333",
                      color: "#fff",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#555",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#777",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#fff",
                    },
                  }}
                >
                  {durationsArray.map((dur) => (
                    <MenuItem key={dur} value={dur}>
                      {dur < 60 ? `${dur} seconds` : `${dur / 60} minutes`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl margin="normal">
                <Select
                  value={questionMarks}
                  onChange={(event) =>
                    setQuestionMarks(event.target.value as number)
                  }
                  size="small"
                  sx={{
                    backgroundColor: "#333",
                    color: "#fff",
                    "& .MuiSelect-select": {
                      backgroundColor: "#333",
                      color: "#fff",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#555",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#777",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#fff",
                    },
                  }}
                >
                  {questionMarksArray.map((mark) => (
                    <MenuItem key={mark} value={mark}>
                      {mark} point{mark > 1 ? "s" : ""}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
          <DialogContent sx={{ backgroundColor: "#1e1e1e", color: "#fff" }}>
            <Box>
              <TextField
                label="Question"
                fullWidth
                margin="normal"
                value={question}
                onChange={(e) => {
                  setFormErrors({
                    question: "",
                    options: "",
                  });
                  setQuestion(e.target.value);
                }}
                error={!!formErrors.question}
                helperText={formErrors.question}
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: "#333",
                    color: "#fff",
                  },
                  "& .MuiFormLabel-root": {
                    color: "#bbb",
                  },
                  "& .MuiFormLabel-root.Mui-focused": {
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
                      borderColor: "#fff",
                    },
                  },
                }}
              />
              {options.map((option, index) => (
                <Stack direction="row" alignItems="center" key={index}>
                  <Checkbox
                    checked={option.isCorrect}
                    sx={{ marginRight: "10px", color: "#fff" }}
                    onChange={() => handleCorrectChange(index)}
                  />
                  <TextField
                    label={`Option ${index + 1}`}
                    fullWidth
                    margin="normal"
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    error={!!formErrors.options && !option.text.trim()}
                    helperText={
                      !!formErrors.options && !option.text.trim()
                        ? "Option text is required"
                        : ""
                    }
                    sx={{
                      "& .MuiInputBase-root": {
                        backgroundColor: "#333",
                        color: "#fff",
                      },
                      "& .MuiFormLabel-root": {
                        color: "#bbb",
                      },
                      "& .MuiFormLabel-root.Mui-focused": {
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
                          borderColor: "#fff",
                        },
                      },
                    }}
                  />
                  <IconButton
                    onClick={() => handleRemoveOption(index)}
                    disabled={options.length <= 2}
                    sx={{
                      marginLeft: "10px",
                      cursor: "pointer",
                      color: "#fff",
                    }}
                  >
                    <Delete sx={{ color: "red" }} />
                  </IconButton>
                </Stack>
              ))}
              {options.length < 5 && (
                <Button
                  startIcon={<AddCircleOutline />}
                  onClick={handleAddOption}
                  sx={{ mt: 2, color: "#fff" }}
                >
                  Add Option
                </Button>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ backgroundColor: "#333", color: "#fff" }}>
            <Button
              onClick={handleClose}
              sx={{ margin: "0px 5px 20px 0px", color: "#fff" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddQuiz}
              color="primary"
              variant="contained"
              sx={{
                margin: "0px 20px 20px 0px",
                backgroundColor: "#444",
                color: "#fff",
              }}
            >
              {editIndex !== null ? "Update Question" : "Save Question"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default CreateQuiz;
