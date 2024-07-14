import { toast } from "react-toastify";
import { auth, db, googleProvider } from "../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import {

  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

const signUp = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await sendEmailVerification(userCredential.user);
    toast.success("Check your email and verify!");

    await updateProfile(userCredential.user, { displayName });

    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      displayName,
      email,
      
    });

    return userCredential.user;
  } catch (error: any) {
    toast.error("Something went wrong!");
    
    return null;
  }
};

const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (!userCredential.user.emailVerified) {
      await sendEmailVerification(userCredential.user);
      toast.warn("Verify your email");
      return null;
    }
    toast.success("Loged in..!");
   

    return userCredential.user;
  } catch (error: any) {
    toast.error("Something went wrong!");
    
    return null;
  }
};

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    toast.success("Successfully signed in with Google!");
   
    findUserAndAddIfNotInUser(user);
    return user;
  } catch (error: any) {
    toast.error("Google sign-in failed!");
   
    return null;
  }
};

const findUserAndAddIfNotInUser = async (user: any) => {
  const q = query(collection(db, "users"), where("email", "==", user.email));

  const querySnapshot = await getDocs(q);
  let isUserAdded = false;
  querySnapshot.forEach(() => {
    // doc.data() is never undefined for query doc snapshots
    isUserAdded = true;
  });

  if (!isUserAdded) {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      completed: [],
    });
  }
};



  const fatchUserFromCollection = async (email: string) => {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    // Since there's always one user, get the first document
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
    
      return userDoc.data();
    } else {
      throw new Error("User not found");
    }
  
  };

export { signUp, signIn, signInWithGoogle,fatchUserFromCollection };
