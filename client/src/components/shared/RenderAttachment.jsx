import { transformImage } from "../../lib/features";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";

const RenderAttachment = ({ file, url }) => {
  switch (file) {
    case "video":
      return <video src={url} preload="none" width={"200px"} controls />;

    case "image":
      return (
        <img
          src={transformImage(url, 200)}
          width={"200px"}
          height={"150px"}
          style={{ objectFit: "cover", borderRadius: "10px" }}
          alt="Attachment"
        />
      );

    case "audio":
      return <audio src={url} preload="none" controls />;

    default:
      <FontAwesomeIcon icon={faFile} />;
      break;
  }
};

export default RenderAttachment;
