export const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    "http://192.168.1.2:5173/",
    process.env.CLIENT_URL,
  ],
  method: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  credentials: true,
};
