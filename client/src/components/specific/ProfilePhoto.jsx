import { Button } from "@mui/material";
import { useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { useSelector } from "react-redux";
import { useNavigationType, useNavigate } from "react-router-dom";

const ProfilePhoto = () => {
  const { user } = useSelector((state) => state.auth);
  const navType = useNavigationType(); // Hook to detect navigation type
  const imgRef = useRef(null); // Ref to access the image element
  const navigate = useNavigate(); // Hook to programmatically navigate
  useEffect(() => {
    const imgElement = imgRef.current;

    if (navType === "PUSH") {
      // Detect back navigation and trigger animation
      imgElement.style.transition = "transform 0.3s ease-in-out";
      imgElement.style.transform = "scale(0.95)"; // Shrink animation
      setTimeout(() => {
        imgElement.style.transform = "scale(1)"; // Reset scale
      }, 300); // Adjust duration to match transition
    }
  }, [navType]);

  // Handler to navigate to the home page
  const handleGoHome = () => {
    const imgElement = imgRef.current;

    // Apply the animation before navigation
    imgElement.style.transition = "transform 0.5s ease-in-out";
    imgElement.style.transform = "scale(0.85)"; // Shrink effect

    // Wait for the animation to finish, then navigate
    setTimeout(() => {
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          flushSync(() => {
            navigate("/"); // Navigate to home
          });
        });
      } else {
        navigate("/"); // Fallback navigation if no view transition API
      }
    }, 500); // Adjust timing to match transition duration (0.5s)
  };

  return (
    <div
      className="profile-photo-container"
      style={{
        display: "flex",
        flexDirection: "column",
        viewTransitionName: "profile-photo",
        contain: "layout",
      }}>
      <img
        ref={imgRef}
        className="profile-photo"
        src={user?.avatar?.url}
        alt="Profile"
      />
      <Button
        variant="outlined"
        onClick={handleGoHome}
        style={{ marginTop: "20px", padding: "10px", cursor: "pointer" }}>
        Go Back
      </Button>
    </div>
  );
};

export default ProfilePhoto;
