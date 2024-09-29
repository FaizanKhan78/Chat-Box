import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import * as React from "react";

export function FileUploader() {
  const [progress, setProgress] = React.useState(0);
  const [buffer, setBuffer] = React.useState(10);

  const progressRef = React.useRef(() => {});
  React.useEffect(() => {
    progressRef.current = () => {
      if (progress === 100) {
        setProgress(0);
        setBuffer(10);
      } else {
        setProgress(progress + 1);
        if (buffer < 100 && progress % 5 === 0) {
          const newBuffer = buffer + 1 + Math.random() * 10;
          setBuffer(newBuffer > 100 ? 100 : newBuffer);
        }
      }
    };
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      progressRef.current();
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        height: "35px",
        backgroundColor: "#2d2d2d",
        padding: "0px 10px",
        borderRadius: "10px",
      }}>
      <LinearProgress
        variant="buffer"
        value={progress}
        valueBuffer={buffer}
        sx={{ top: "15px" }}
      />
    </Box>
  );
}