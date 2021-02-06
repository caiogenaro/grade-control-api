import express from "express";
import { promises as fs } from "fs";
import gradesControl from "./scripts/gradesController.js";

const { readFile, writeFile } = fs;
const app = express();

app.use(express.json());
app.use("/grades", gradesControl);

app.listen(3000, async () => {
  try {
    await readFile("grades.json");
    console.log("API Started");
  } catch (err) {
    console.log("err---------", err);
  }
});
