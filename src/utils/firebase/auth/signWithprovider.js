import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../../service/firebase";

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
    return { success: true, token };
  } catch (error) {
    return { success: false, error };
  }
};

export const signInWithGitHub = async () => {
  const provider = new GithubAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();
    return { success: true, token };
  } catch (error) {
    if (error.code === "auth/account-exists-with-different-credential") {
      return { success: false, error, conflict: true };
    }
    return { success: false, error };
  }
};
