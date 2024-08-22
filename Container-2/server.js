import express from "express";
import bodyParser from "body-parser";
import csvParser from "csv-parser";
import fs from "fs";

const DIRECTORY_LOCATION = "/raj_PV_dir";

const app = express();

app.use(bodyParser.json());

console.log("terraform");

app.post("/", async (req, res) => {
  console.log("request received.");
  const file = req.body.file;
  const product = req.body.product;

  console.log("parsing started.");
  let parseError = false;
  let products = [];
  var readCSVFile = fs
    .createReadStream(`${DIRECTORY_LOCATION}/${file}`)
    .pipe(
      csvParser({
        headers: ["product", "amount"],
        separator: ",",
        strict: true,
      })
    )
    .on("data", (data) => products.push(data))
    .on("error", (error) => {
      console.log(`parsing error: ${error.message}.`);
      parseError = true;
      readCSVFile.destroy();
    })
    .on("close", () => {
      if (
        parseError ||
        products.length === 0 ||
        products[0].product.trim() !== "product" ||
        products[0].amount.trim() !== "amount"
      ) {
        return res
          .status(400)
          .json({ file, error: "Input file not in CSV format." });
      }

      let sum = 0;
      products.forEach((data) => {
        if (data.product === product) sum += Number(data.amount);
      });
      res.status(200).json({ file, sum });
    });
});

const port = 5000;
app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
