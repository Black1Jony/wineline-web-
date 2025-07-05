import { auth } from "../../../service/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

export const loginWithEmail = async (email, password) => {
  try {
    if (email && password.length >= 6) {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("userCredential", userCredential);
      
      localStorage.setItem("token", userCredential.user.accessToken);

      return userCredential.user;
    } else {
      return "error";
    }
  } catch (error) {
    console.error("Error logging in:", error);
    return "errorData";
  }
};

export const registerWithEmail = async (
  email,
  password,
  repeat,
  name
) => {
  try {
    if (password == repeat && password.length >= 6 && email) {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential);
      
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      localStorage.setItem("token", userCredential.user.accessToken);
      
      return userCredential.user;
    } else {
      console.log("Passwords do not match or are too short");
      
      return "error";
    }
  } catch (error) {
    console.error("Error registering:", error);
    return "errorData";
  }
};
