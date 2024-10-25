import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Pause, PlayArrow, VolumeUp } from "@mui/icons-material"; // Icons for controls
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Slider,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";

const RenderAttachment = ({ file, url }) => {
  const videoRef = useRef(null); // Reference to the video element
  const [isPlaying, setIsPlaying] = useState(false); // State to track play/pause
  const [volume, setVolume] = useState(1); // State to track volume level
  // Toggle play/pause
  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Change volume
  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    videoRef.current.volume = newValue;
  };

  switch (file) {
    case "video":
      return (
        <Box
          component="ul"
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            p: 0,
            m: 0,
          }}>
          <Card
            component="li"
            sx={{
              position: "relative",
              backgroundColor: "#1a1a1a",
              borderRadius: "15px",
              overflow: "hidden",
            }}>
            {/* Gradient background for text */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(to bottom, rgba(0, 0, 0, .2), transparent)",
                zIndex: 1,
                color: "#fff", // Text color
                fontSize: "1.5rem", // Adjust font size
                padding: "10px", // Padding around the text
              }}>
              <Typography
                variant="h6"
                component="div"
                sx={{ fontWeight: "bold" }}>
                Video
              </Typography>
            </Box>

            {/* Video content */}
            <video
              ref={videoRef}
              src={url}
              style={{
                height: "400px",
                width: "250px",
                objectFit: "cover",
                position: "relative",
                zIndex: 0, // Video stays behind the gradient overlay
              }}
            />

            {/* Custom video controls */}
            <CardContent
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                zIndex: 2,
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                background: `linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, transparent)`, // Corrected gradient background
              }}>
              {/* Play/Pause Button */}
              <IconButton onClick={handlePlayPause} sx={{ color: "#fff" }}>
                {isPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>

              {/* Volume Control */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <VolumeUp sx={{ color: "#fff" }} />
                <Slider
                  value={volume}
                  onChange={handleVolumeChange}
                  min={0}
                  max={1}
                  step={0.1}
                  sx={{
                    width: 100,
                    color: "#fff",
                    ml: 1,
                  }}
                />
              </Box>

              {/* Fullscreen Button */}
              {/* <IconButton
    onClick={() => videoRef.current.requestFullscreen()}
    sx={{ color: "#fff" }}>
    <Fullscreen />
  </IconButton> */}
            </CardContent>
          </Card>
        </Box>
      );

    case "image":
      return (
        <>
          <Box
            component="ul"
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              p: 0,
              m: 0,
              cursor: "pointer",
            }}>
            <Card
              component="li"
              sx={{
                position: "relative",
                backgroundColor: "#1a1a1a",
                borderRadius: "15px",
                overflow: "hidden",
              }}>
              {/* Gradient background for text */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(to bottom, rgba(0, 0, 0, .2), transparent)",
                  zIndex: 1,
                  color: "#fff", // Text color
                  fontSize: "1.5rem", // Adjust font size
                  padding: "10px", // Padding around the text
                }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontWeight: "bold" }}>
                  Image
                </Typography>
              </Box>
              <img
                src={url}
                width={"200px"}
                height={"150px"}
                style={{ objectFit: "cover", borderRadius: "10px" }}
                alt="Attachment"
              />
              {/* <CardContent
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                zIndex: 2,
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                background: `linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, transparent)`, // Corrected gradient background
              }}></CardContent> */}
            </Card>
          </Box>
        </>
      );

    case "audio":
      return <audio src={url} preload="none" controls />;

    default:
      return (
        <Tooltip title="Download File" arrow placement="top">
          <FontAwesomeIcon icon={faFile} />
        </Tooltip>
      );
  }
};

export default RenderAttachment;
