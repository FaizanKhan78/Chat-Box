import moment from "moment";
export const fileFormat = (url) => {
  const fileExtension = url?.split(".").pop();
  if (
    fileExtension === "mp4" ||
    fileExtension === "webm" ||
    fileExtension === "ogg"
  ) {
    return "video";
  } else if (fileExtension === "mp3" || fileExtension === "wav") {
    return "audio";
  } else if (
    fileExtension === "jpg" ||
    fileExtension === "jpeg" ||
    fileExtension === "png" ||
    fileExtension === "gif"
  ) {
    return "image";
  } else {
    return "file";
  }
};

export const transformImage = (url, width = 100) => {
  const newUrl = url?.replace("upload/", `upload/dpr_auto/w_${width}/`);
  return newUrl;
};

export const getOrSaveFromLocalStorage = ({ key, value, get }) => {
  if (get) {
    if (localStorage.getItem(key)) {
      return JSON.parse(localStorage.getItem(key));
    }
    return null;
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// export const getSevenDays = () => {
//   const currentDate = moment();
//   const lastSevenDays = [];
//   for (let i = 0; i < 7; i++) {
//     const dayDate = currentDate.clone().subtract(i, "days").format("MMMM DD");
//     const dayName = dayDate.format("dddd");
//     lastSevenDays.unshift(dayName);
//   }
//   return lastSevenDays;
// };

export const getSevenDays = () => {
  const currentDate = moment();
  const lastSevenDays = [];

  for (let i = 0; i < 7; i++) {
    const dayDate = currentDate.clone().subtract(i, "days");
    const formattedDate = dayDate.format("D");
    const dayName = dayDate.format("dddd");
    lastSevenDays.unshift(`${formattedDate} ${dayName}`);
  }

  return lastSevenDays;
};

export const getToastConfig = (theme) => ({
  style: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.default,
  },
});
