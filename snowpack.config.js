module.exports = {
    mount: {
        public: { url: "/", static: true },
        components: { url: "/dist/components" },
    },
    plugins: [
        "@snowpack/plugin-dotenv",
        ["@snowpack/plugin-typescript", { args: "--project ./tsconfig.prod.json" }],
        "@snowpack/plugin-postcss",
    ],
    packageOptions: {
        env: { NODE_ENV: true },
    },
};
