import path from "node:path";
import { defineConfig, loadEnv, searchForWorkspaceRoot } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

// /home/zshmeta/bhcmarkets/apps/admin/vite.config.ts

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const r = (p: string) => path.resolve(__dirname, p);

    return {
        plugins: [
            react(),
            tsconfigPaths(),
        ],
        envPrefix: ["VITE_", "PUBLIC_"],

        resolve: {
            alias: {
                "@": r("src"),
            },
        },

        server: {
            host: true,
            port: Number(env.VITE_ADMIN_PORT ?? 5183),
            strictPort: false,
            open: false,
            fs: {
                allow: [searchForWorkspaceRoot(process.cwd()), r("."), r("..")],
            },
        },

        preview: {
            host: true,
            port: Number(env.VITE_ADMIN_PREVIEW_PORT ?? 4183),
            strictPort: false,
        },

        build: {
            target: "es2020",
            outDir: "dist",
            assetsDir: "assets",
            cssCodeSplit: true,
            sourcemap: mode !== "production",
            reportCompressedSize: false,
            emptyOutDir: true,
        },

        optimizeDeps: {
            esbuildOptions: {
                target: "es2020",
            },
        },

        define: {
            __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
            __BUILD_ENV__: JSON.stringify(mode),
            __APP_NAME__: JSON.stringify(env.VITE_APP_NAME || "admin"),
        },
    };
});