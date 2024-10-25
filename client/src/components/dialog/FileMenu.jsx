import { useTheme } from "@emotion/react";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import DescriptionIcon from "@mui/icons-material/Description";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import MovieIcon from "@mui/icons-material/Movie";
import {
  Divider,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  Tooltip,
  Zoom,
} from "@mui/material";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getToastConfig } from "../../lib/features";
import { useSendAttachmentsMutation } from "../../redux/api/api";
import { setIsFileMenu, setUploadingLoader } from "../../redux/reducers/misc";
import {
  setAudioCount,
  setImageCount,
  setVideoCount,
} from "../../redux/reducers/friendProfile";

const FileMenu = ({ anchorEl, chatId }) => {
  const { isFileMenu } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const closeFileMenu = () => {
    dispatch(setIsFileMenu(false));
  };

  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const fileRef = useRef(null);

  const theme = useTheme();

  const [sendAttachments] = useSendAttachmentsMutation();

  const selectImage = (ref) => ref.current?.click();
  const selectFile = (ref) => ref.current?.click();
  const selectAudio = (ref) => ref.current?.click();
  const selectVideo = (ref) => ref.current?.click();

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);

    if (files.length <= 0) {
      return;
    }
    if (files.length > 5) {
      return toast.error(
        `You can only have 5 ${key} at a time`,
        getToastConfig(theme)
      );
    }
    dispatch(setUploadingLoader(true));

    closeFileMenu();

    const myForm = new FormData();
    myForm.append("chatId", chatId);

    files.forEach((file) => myForm.append("files", file));
    try {
      const res = await sendAttachments(myForm);
      if (res.data) {
        toast.success(`${key} sent successfully`, getToastConfig(theme));
        const type = files[0].type.split("/")[0];
        if (type === "image") {
          dispatch(setImageCount());
        } else if (type === "video") {
          dispatch(setVideoCount());
        } else if (type === "audio") {
          dispatch(setAudioCount());
        }
      }
      if (res.error) {
        toast.error(
          res.error.data.message + " upload less than 50 MB",
          getToastConfig(theme)
        );
      }
    } catch (error) {
      toast.error(error.message, getToastConfig(theme));
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };

  const menuItemStyle = {
    transition: "transform 0.4s ease, opacity 0.4s ease", // smooth transitions
    transform: isFileMenu ? "scale(1)" : "scale(0)",
    opacity: isFileMenu ? 1 : 0,
  };

  return (
    <Menu
      onClose={closeFileMenu}
      open={isFileMenu}
      anchorEl={anchorEl}
      PaperProps={{
        elevation: 8,
        sx: {
          borderRadius: "12px",
          width: "14rem",
        },
      }}
      sx={{ left: "calc(100vw - 33vw)", top: "-2vw" }}>
      <MenuList sx={{ padding: "0.5rem" }}>
        {/* File Options with Icons and Zoom effect */}
        <Zoom in={isFileMenu}>
          <MenuItem onClick={() => selectImage(imageRef)} sx={menuItemStyle}>
            <Tooltip title="Insert Image" arrow>
              <IconButton>
                <InsertPhotoIcon sx={{ color: "#4caf50" }} />
              </IconButton>
            </Tooltip>
            Insert Image
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/gif"
              style={{ display: "none" }}
              onChange={(e) => {
                fileChangeHandler(e, "Images");
              }}
              ref={imageRef}
            />
          </MenuItem>
        </Zoom>

        <Zoom
          in={isFileMenu}
          style={{ transitionDelay: isFileMenu ? "100ms" : "0ms" }}>
          <MenuItem onClick={() => selectAudio(audioRef)} sx={menuItemStyle}>
            <Tooltip title="Audio" arrow>
              <IconButton>
                <AudiotrackIcon sx={{ color: "#1976d2" }} />
              </IconButton>
            </Tooltip>
            Audio
            <input
              type="file"
              multiple
              accept="audio/mpeg, audio/wav"
              style={{ display: "none" }}
              onChange={(e) => {
                fileChangeHandler(e, "Audios");
              }}
              ref={audioRef}
            />
          </MenuItem>
        </Zoom>

        <Zoom
          in={isFileMenu}
          style={{ transitionDelay: isFileMenu ? "200ms" : "0ms" }}>
          <MenuItem onClick={() => selectVideo(videoRef)} sx={menuItemStyle}>
            <Tooltip title="Videos" arrow>
              <IconButton>
                <MovieIcon sx={{ color: "#ff9800" }} />
              </IconButton>
            </Tooltip>
            Videos
            <input
              type="file"
              multiple
              accept="video/mp4, video/webm, video/ogg"
              style={{ display: "none" }}
              onChange={(e) => {
                fileChangeHandler(e, "Videos");
              }}
              ref={videoRef}
            />
          </MenuItem>
        </Zoom>

        <Zoom
          in={isFileMenu}
          style={{ transitionDelay: isFileMenu ? "300ms" : "0ms" }}>
          <MenuItem onClick={() => selectFile(fileRef)} sx={menuItemStyle}>
            <Tooltip title="Files" arrow>
              <IconButton>
                <DescriptionIcon sx={{ color: "#1976d2" }} />
              </IconButton>
            </Tooltip>
            Files
            <input
              type="file"
              multiple
              accept="*"
              style={{ display: "none" }}
              onChange={(e) => {
                fileChangeHandler(e, "Files");
              }}
              ref={fileRef}
            />
          </MenuItem>
        </Zoom>

        {/* Optional divider for separating groups */}
        <Divider />

        <Zoom
          in={isFileMenu}
          style={{ transitionDelay: isFileMenu ? "400ms" : "0ms" }}>
          <MenuItem onClick={closeFileMenu} sx={menuItemStyle}>
            Close Menu
          </MenuItem>
        </Zoom>
      </MenuList>
    </Menu>
  );
};

export default FileMenu;
