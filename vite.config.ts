import { defineConfig, loadEnv } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { readFileSync } from "fs";

const env = loadEnv("all", process.cwd());

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svelte({
            onwarn: (warning, handler) => {
                // e.g. don't warn on a11y-autofocus
                if (warning.code.includes("a11y")) {
                    // console.log(warning)
                    return;
                }

                // let Rollup handle all other warnings normally
                handler(warning);
            },
        }),
    ],
    server: {
      https: {
        key: readFileSync(env.VITE_SSL_KEY),
        cert: readFileSync(env.VITE_SSL_CERT)
      }
    }
});
