import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const DIRECTORY_LOCATION = "/raj_PV_dir";
const CALCULATE_SUM_URL = "http://container-2-service:5000";

const app = express();

app.use(bodyParser.json());

console.log("terraform");

app.post("/store-file", async (req, res) => {
  const { file, data } = req.body;

  if (!file || !data) {
    return res.status(400).json({ file: file, error: "Invalid JSON input." });
  }

  fs.writeFile(`${DIRECTORY_LOCATION}/${file}`, data, (error) => {
    if (error) {
      return res.status(400).json({
        file,
        error: "Error while storing the file to the storage.",
      });
    }
  });

  res.status(201).json({ file, message: "Success." });
});

app.post("/calculate", async (req, res) => {
  const file = req.body.file;

  if (!file) {
    console.log("invalid inputs provided.");
    return res.status(400).json({ file: null, error: "Invalid JSON input." });
  }

  if (!fs.existsSync(`${DIRECTORY_LOCATION}/${file}`)) {
    console.log(`${file} file does not exist.`);
    return res.status(404).json({ file, error: "File not found." });
  }

  console.log(`request for ${file} file made to the second server.`);
  const { status, data } = await fetch(CALCULATE_SUM_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req.body),
  })
    .then(async (response) => {
      const data = await response.json();
      return { status: response.status, data };
    })
    .catch((error) => {
      console.log(`Error: ${error}`);
      return res
        .status(500)
        .json({ file, error: "could not make request to second server." });
    });

  res.status(status).json(data);
});

const port = 6000;
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
