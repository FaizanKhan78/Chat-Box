import { Box, keyframes, styled } from "@mui/material";
import { Link } from "react-router-dom";

export const VisuallyHiddenInput = styled("input")({
  border: 0,
  clip: "rect(0 0 0 0)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
});

export const StyleLink = styled(Link)({
  textDecoration: "none",
  color: "black",
});

export const InputBox = styled("input")({
  flexGrow: 1,
  height: "30px",
  border: "none",
  outline: "none",
  padding: "0 1rem", // Adjust padding to better fit inside the icons
  borderRadius: "1rem",
});

const bouncingAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.5); }
  100% { transform: scale(1); }
`;

export const Dot = styled(Box)(({ theme }) => ({
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
  margin: "0 4px",
  animation: `${bouncingAnimation} 0.6s infinite`,
  "&:nth-of-type(2)": {
    animationDelay: "0.2s",
  },
  "&:nth-of-type(3)": {
    animationDelay: "0.4s",
  },
}));
