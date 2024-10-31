import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import moment from "moment";
import { memo } from "react";
import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";
import { useDispatch } from "react-redux";
import { setLinkCount } from "../../redux/reducers/friendProfile";

// Framer Motion Variants
const messageVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0 },
};

const attachmentVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const Messages = ({ message, user }) => {
  const dispatch = useDispatch();

  const incrementLinkCount = () => {
    dispatch(setLinkCount());
  };

  // Function to check if content is a valid URL
  const isValidURL = (string) => {
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)" + // Protocol
        "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|" + // Domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR IPv4
        "(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*" + // Port and path
        "(\\?[;&a-zA-Z\\d%_.~+=-]*)?" + // Query string
        "(\\#[-a-zA-Z\\d_]*)?$",
      "i"
    );
    if (urlPattern.test(string)) {
      incrementLinkCount();
      return true;
    } else {
      return false;
    }
  };

  // Function to check if a URL is a YouTube link and extract the video ID
  const getYouTubeVideoID = (url) => {
    const youtubeRegex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);
    if (match) {
      incrementLinkCount();
      return match[1];
    } else {
      return null;
    }
  };

  const { sender, content, attachments = [], createdAt } = message;
  const theme = useTheme();

  const timeAgo = moment(createdAt).fromNow();
  const isUserMessage = sender?._id === user?._id;

  // Check if content is a YouTube link and get the video ID
  const youtubeVideoID = getYouTubeVideoID(content);

  return (
    <motion.div
      initial="hidden"
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      variants={messageVariants}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUserMessage ? "flex-end" : "flex-start",
      }}>
      <motion.span
        style={{ fontSize: "12px", color: "#888888", marginBottom: "5px" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}>
        {isUserMessage ? (
          "You"
        ) : (
          <span style={{ fontWeight: 550 }}>{sender?.name}</span>
        )}
        , {timeAgo}
      </motion.span>
      <motion.div
        style={{
          position: "relative",
          backgroundColor: isUserMessage
            ? theme.palette.background.chat2
            : theme.palette.background.chat,
          color: "text.primary",
          padding: "10px 15px",
          borderRadius: "20px",
          maxWidth: "70%",
          margin: "5px 0",
          display: "inline-block",
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}>
        {content &&
          (youtubeVideoID ? (
            // Render YouTube embedded video if it is a YouTube link
            <>
              <Typography
                sx={{
                  top: 18,
                  left: 30,
                  fontWeight: 600,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  background: "linear-gradient(90deg, #ff416c, #ff4b2b)", // pink to orange gradient
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: "0.85rem", // adjust as needed
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}>
                Youtube
              </Typography>
              <div style={{ marginBottom: "5px" }}>
                <iframe
                  width="100%"
                  height="200"
                  src={`https://www.youtube.com/embed/${youtubeVideoID}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube Video"
                  style={{ borderRadius: "10px" }}></iframe>

                <a
                  href={content}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: theme.palette.primary.main }}>
                  {content}
                </a>
              </div>
            </>
          ) : isValidURL(content) ? (
            <a
              href={content}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: theme.palette.primary.main }}>
              {content.slice(0, 85)}...
            </a>
          ) : (
            <Typography sx={{ fontFamily: "hack" }}>{content}</Typography>
          ))}

        {/* Tail for the message */}
        <motion.div
          style={{
            position: "absolute",
            width: "25px",
            height: "25px",
            backgroundColor: isUserMessage
              ? theme.palette.background.chat2
              : theme.palette.background.chat,
            bottom: ".5px",
            right: isUserMessage ? "-8px" : "auto",
            left: isUserMessage ? "auto" : "-8px",
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 120 }}
        />

        {/* Attachments */}
        {attachments.map((i, index) => {
          const url = i.url;
          const file = fileFormat(url);
          return (
            <motion.div
              key={index}
              variants={attachmentVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.2 }}>
              <Box>
                <a
                  href={file === "file" ? url : undefined}
                  download={file === "file" ? true : undefined}
                  style={{ color: "black" }}>
                  <RenderAttachment file={file} url={url} />
                </a>
              </Box>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default memo(Messages);
