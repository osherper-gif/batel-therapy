import { app } from "./app.js";
import { env } from "./config.js";
import { ensureAdminUser } from "./bootstrap/ensure-admin-user.js";

async function startServer() {
  await ensureAdminUser();

  app.listen(env.PORT, () => {
    console.log(`Backend listening on port ${env.PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
