export const errorMiddleWare = (err, req, res, next) => {
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;
  if (err.code === 11000) {
    const error = Object.keys(err.keyPattern).join(",");
    err.message = `Duplicate Field - ${error}`;
    err.statusCode = 400;
  }

  if (err.name === "CastError") {
    const errorPath = err.path;
    err.message = `Invalid Format of Path ${errorPath}`;
    err.status = 400;
  }

  return res.status(err.statusCode).json({
    success: false,
    // message: process.env.NODE_ENV.trim() === "DEVELOPMENT" ? err : err.message,
    message: err.message,
  });
};
