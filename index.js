import dotenv from "dotenv";
dotenv.config();
import chalk from "chalk";
import app from "./src/app.js";

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(chalk.green(`Server running on http://localhost:${PORT}`));
});
