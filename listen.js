const app = require("./app");
const { PORT = 3001 } = process.env;
app.listen(PORT, () => {
  console.log("we are live on radio 3001");
});
