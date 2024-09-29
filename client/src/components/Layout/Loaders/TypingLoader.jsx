import { Stack, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";

// Bouncing animation for dots
const bounce = keyframes`
  0%, 100% {
    transform: translateY(0); // Stay at the same position
    opacity: 1;               // Visible
  }
  50% {
    transform: translateY(-10px); // Move up
    opacity: 0.7;                 // Slightly transparent
  }
`;

// Typing Loader component
const TypingLoader = () => {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={1}
      sx={{
        position: "absolute",
        bottom: "64px", // Adjust for input box spacing
        width: "100%",
      }}>
      {/* Typing Text with Gradient Animation */}
      <Typography
        sx={{
          fontSize: "28px",
          background: "linear-gradient(270deg, #e66465, #9198e5)",
          backgroundSize: "200% 200%",
          backgroundClip: "text",
          color: "transparent",
          animation: `gradientAnimation 3s ease infinite`,
        }}>
        typing
      </Typography>

      {/* Animated bouncing dots */}
      <Dot sx={{ animation: `${bounce} 1s ease infinite` }} />
      <Dot sx={{ animation: `${bounce} 1s ease 0.2s infinite` }} />
      <Dot sx={{ animation: `${bounce} 1s ease 0.4s infinite` }} />
    </Stack>
  );
};

// Dot component
const Dot = ({ sx }) => (
  <div
    style={{
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      backgroundColor: "#1976d2",
      ...sx,
    }}
  />
);

export default TypingLoader;
