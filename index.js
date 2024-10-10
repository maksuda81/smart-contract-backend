import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import blockchainRoutes from "./routes/blockChainRoutes.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import rootRoutes from "./routes/root.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  next();
});

// app.use(
//   cors({
//     origin: "https://smart-contract-maksuda.netlify.app",
//   })
// );
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

// Routes Start
app.use("/", rootRoutes);
app.use("/api/", blockchainRoutes);
// Routes End

// Uncomment this part if you want to run the server locally
app.listen(port, () => {
  console.log(`Blockchain server running on production server port:${port}`);
});

// export default app;
