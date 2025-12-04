import "dotenv/config";
import app from "./app.js";

// Determine the port from the environment, defaulting to 3000. In a
// containerised or AWS environment, the platform will typically
// provide this via the PORT environment variable.
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`✅ API ready at http://localhost:${port}`);
});