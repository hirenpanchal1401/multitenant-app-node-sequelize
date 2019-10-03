import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import routes from "./src/routes";

const PORT = 8080;
dotenv.config();
const app = express();

app.set("port", PORT);
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(cors());
app.use(bodyParser.json());

app.use("/", routes);

app.get("/", (req, res, next) => {
  res.json({ body: "Hello multi-tenant application." });
});

app.listen(PORT, () => {
  console.log(`Express server started at port: ${PORT}`);
});
