import express from "express";
import { promises as fs } from "fs";
import { createSecureContext } from "tls";

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
      timestamp: new Date().toISOString(),
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

router.get("/:id", async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile("grades.json", "utf8"));
    const grade = data.grades.find(
      (grade) => grade.id === parseInt(req.params.id)
    );
    res.send(grade);
  } catch (err) {
    next(err);
  }
});
router.post("/:total", async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile("grades.json", "utf8"));
    const grade = data.grades.filter(
      (grade) =>
        grade.student === req.body.student && grade.subject === req.body.subject
    );

    const total = grade.reduce((acc, cur) => {
      return acc + cur.value;
    }, 0);

    // const somaMedias = grade.reduce((acc, cur) => acc + cur.value);

    res.send({total});
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile("grades.json", "utf8"));
    data.grades = data.grades.filter(
      (grade) => grade.id !== parseInt(req.params.id)
    );
    await writeFile("grades.json", JSON.stringify(data, null, 2));
    res.end();
  } catch (err) {
    next(err);
  }
});

export default router;
