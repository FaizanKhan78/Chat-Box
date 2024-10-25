import { Box, Typography } from "@mui/material";
import { memo } from "react";
import moment from "moment";
import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";
import { useTheme } from "@emotion/react";
import { motion } from "framer-motion";

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
  const { sender, content, attachments = [], createdAt } = message;

  const theme = useTheme();

  const timeAgo = moment(createdAt).fromNow();
  const isUserMessage = sender?._id === user?._id;

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
        {content && (
          <Typography sx={{ fontFamily: "hack" }}>{content}</Typography>
        )}

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
              key={index} // Use the index or a unique key, as using 'i' may not work as expected
              variants={attachmentVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.2 }}>
              <Box>
                <a
                  href={file === "file" ? url : undefined} // Add the href attribute to make the link functional
                  download={file === "file" ? true : undefined} // 'download' should be set to true for files
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
