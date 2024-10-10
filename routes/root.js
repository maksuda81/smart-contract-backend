import express from "express";
import { indexVar } from "../controllers/indexController.js";

const router = express.Router();

/* GET home page. */
router.get("/", indexVar);

export default router;
