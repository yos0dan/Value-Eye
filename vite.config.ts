import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import fs from "fs";
import path from "path";

// Optional: local HTTPS dev server
// Place server.key and server.crt in a `certs/` directory at the project root
// These files are gitignored automatically
const certsDir = path.resolve("certs");
const keyPath = path.join(certsDir, "server.key");
const certPath = path.join(certsDir, "server.crt");
const hasLocalCerts = fs.existsSync(keyPath) && fs.existsSync(certPath);

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: 4832,
    ...(hasLocalCerts
      ? {
          https: {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath),
          },
        }
      : {}),
    host: "0.0.0.0",
  },
});
