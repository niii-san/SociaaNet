import express from "express";

export const moderatorsRouter = express.Router();

moderatorsRouter.get("/", (req, res) => {
    res.send("List of moderators");
});
