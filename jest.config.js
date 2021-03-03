module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    globals: {
        "ts-jest": {
            tsconfig: "./tsconfig.test.json",
        },
    },
    transform: {
        "^.+\\.(js|ts)$": "ts-jest",
        ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "jest-transform-stub",
    },
    transformIgnorePatterns: [
        // allow lit-html transformation
        "node_modules/(?!(lit-html|lit-element))",
    ],
};
