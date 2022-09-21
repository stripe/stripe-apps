import * as dotenv from "dotenv";
import app from "./app";
dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})
