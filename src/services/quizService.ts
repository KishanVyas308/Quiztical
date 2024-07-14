import {
  collection,
  addDoc,
  doc,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  getDoc,
  setDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";

// 'waiting', 'coundown' ,'started', 'leaderboard , 'finished'

const saveNewQuize = async (quiz: any) => {
  // Extract necessary fields from the user object
  const newQuizRef = doc(collection(db, "quizzes"));
  const newQuizId = newQuizRef.id;

  // Create a new quiz object with the sanitized user
  const sanitizedQuiz = {
    id: newQuizId,
    quizName: quiz.quizName,
    totalDuration: quiz.totalDuration,
    totalMarks: quiz.totalMarks,
    createdBy: quiz.user.uid,
    quizzes: quiz.quizzes,
  };

  try {
    await setDoc(doc(db, "quizzes", newQuizId), sanitizedQuiz);

    toast.success("Quiz saved successfully");
  } catch (error) {
    console.log(error);
    toast.error("Failed to save quiz");
  }
};

const fetchUserQuizzes = async (user: any) => {
  try {
    const q = query(
      collection(db, "quizzes"),
      where("createdBy", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);
    const userQuizzes: any = [];
    querySnapshot.forEach((doc) => {
      userQuizzes.push({ id: doc.id, ...doc.data() });
    });
    console.log(userQuizzes);
    return userQuizzes;
  } catch (error) {
    console.log("Error fetching quizzes: ", error);
    return null;
  }
};

const hostQuiz = async (quizId: string, hostId: string) => {
  const invitationCode = Math.random().toString(36).substr(2, 6).toUpperCase();
  const activeQuizData = {
    quizId,
    hostId,
    invitationCode,
    status: "waiting", // 'waiting', 'coundown' ,'started', 'leaderboard , 'finished'
    curQuestionNumber: 0,
  };
  console.log(activeQuizData);

  const activeQuizRef = await addDoc(
    collection(db, "activeQuizzes"),
    activeQuizData
  );

  return { invitationCode, activeQuizRef, quizId };
};

const joinQuiz = async (
  invitationCode: string,
  displayName: string,
  id: string
) => {
  const q = query(
    collection(db, "activeQuizzes"),
    where("invitationCode", "==", invitationCode)
  );
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    try {
      const activeQuiz = querySnapshot.docs[0];

      const activeQuizRef = doc(db, "activeQuizzes", activeQuiz.id);

      const participantRef = doc(collection(activeQuizRef, "participants"), id);
      await setDoc(participantRef, {
        displayName,
        rightAns: 0,
        wrongAns: 0,
        totalPoint: 0,
        id,
      });

      return activeQuiz.id;
    } catch (error) {
      return null;
    }
  } else {
    return null;
  }
};

interface Participant {
  id: string;
  displayName: string;
  rightAns: number;
  totalPoint: number;
  wrongAns: number;
}

const removeUser = async (activeQuizId: string, participant: Participant) => {
  try {
    const participantRef = doc(
      db,
      "activeQuizzes",
      activeQuizId,
      "participants",
      participant.id
    );
    await deleteDoc(participantRef);
    console.log(`Participant ${participant.displayName} removed successfully.`);
  } catch (error) {
    console.error("Error removing participant: ", error);
  }
};

const changeGameStatus = async (gameStatus: string, activeQuizId: string) => {
  await updateDoc(doc(db, "activeQuizzes", activeQuizId), {
    status: gameStatus,
  });
};

const addQuizCompletedToUser = async (
  activeQuizId: string,
  user: any,
  quizId: string
) => {
  await updateDoc(doc(db, "users", user.uid), {
    completed: arrayUnion({
      activeQuizId,
      quizId,
    }),
  });
};

const fetchCompletedQuizes = async (user: any) => {
  try {
    console.log(user);
    if (user.completed.length === 0) {
      console.log("no completed quizes");
      
      return []; // Return an empty array if there are no completed quizzes
    }

    // Extract quizId values from the completed array
    const completedQuizIds = user.completed.map((quiz: any) => quiz.quizId);

    // Create a query to fetch all quizzes with IDs in the completedQuizIds array
    const quizzesRef = collection(db, "quizzes");
    const q = query(quizzesRef, where("id", "in", completedQuizIds));

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Map through the query snapshot to get the quiz data
    const userQuizzes = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Completed quizzes:", userQuizzes);
    return userQuizzes;
  } catch (error) {
    console.log("Error fetching quizzes: ", error);
    return null;
  }
};

const fetchCurrentActiveQuizeQuestions = async (quizId: string) => {
  try {
    const quizDoc = await getDoc(doc(db, "quizzes", quizId));

    console.log(quizDoc.data());
    return quizDoc.data();
  } catch (error) {
    console.log("Error fetching quizzes: ", error);
    throw new Error("Quiz not found");
  }
};

const fetchAllParticipantFromCurretQuiz = async (activeQuizId: string) => {
  try {
    const activeQuizRef = doc(db, "activeQuizzes", activeQuizId);
    const participantsRef = collection(activeQuizRef, "participants");

    const querySnapshot = await getDocs(participantsRef);
    const participants: Participant[] = [];

    querySnapshot.forEach((doc) => {
      participants.push(doc.data() as Participant);
    });

    console.log(participants);

    return participants;
  } catch (error) {
    return null;
  }
};

export {
  saveNewQuize,
  fetchUserQuizzes,
  hostQuiz,
  joinQuiz,
  removeUser,
  fetchAllParticipantFromCurretQuiz,
  fetchCurrentActiveQuizeQuestions,
  changeGameStatus,
  addQuizCompletedToUser,
  fetchCompletedQuizes,
};
