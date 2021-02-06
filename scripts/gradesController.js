import express from "express";
import { promises as fs } from "fs";


const { readFile, writeFile } = fs;
const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    let grades = req.body;

    // if (!grades.name || grades.balance == null) {
    //   throw new Error("Name e balance sao obrigatorios.");
    // }

    const data = JSON.parse(await readFile("grades.json"));

    grades = {
      id: data.nextId++,
      student: grades.student,
      subject: grades.subject,
      type: grades.type,
      value: grades.value,
      timestamp: new Date().toISOString()


    };
    data.grades.push(grades);

    await writeFile("grades.json", JSON.stringify(data, null, 2));

    res.send(grades);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
    try {
      const data = JSON.parse(await readFile("grades.json"));
      delete data.nextId;
      res.send(data);
    } catch (err) {
      next(err);
    }
  });


  export default router;