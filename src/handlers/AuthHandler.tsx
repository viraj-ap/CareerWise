import { db, auth } from "@/config/firebase"; // Import both
import LoaderPage from "@/pages/LoaderPage";
import type { User } from "@/types";
import { useAuth, useUser } from "@clerk/clerk-react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth"; // Add this import
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthHandler = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storeUserData = async () => {
      if (isSignedIn && user) {
        setLoading(true);
        try {
          // Sign in to Firebase anonymously to satisfy auth requirements
          await signInAnonymously(auth);

          const userSnap = await getDoc(doc(db, "users", user.id));
          if (!userSnap.exists()) {
            const userData: User = {
              id: user.id,
              name: user.fullName || user.firstName || "Anonymous",
              email: user.primaryEmailAddress?.emailAddress || "No Email",
              imageUrl: user.imageUrl || "",
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            };

            await setDoc(doc(db, "users", user.id), userData);
            console.log("User data stored successfully");
          }
        } catch (error) {
          console.log("Error in storing the user data: ", error);
        } finally {
          setLoading(false);
        }
      }
    };
    storeUserData();
  }, [isSignedIn, user, pathname, navigate]);

  if (loading) {
    return <LoaderPage />;
  }
  return null;
};

export default AuthHandler;
