/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  displayName: "aelf.java",
  preset: "ts-jest",
  testEnvironment: "jsdom",
  coverageReporters: ["json-summary"],
  projects: [
    {
      displayName: "aelf.java",
      preset: "ts-jest",
      testMatch: ["<rootDir>/**/*.test.{ts,tsx}"],
      testEnvironment: "jsdom",
      setupFilesAfterEnv: ["<rootDir>/test/global_environment.ts"],
    },
  ],
  testEnvironmentOptions: {},
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  extensionsToTreatAsEsm: [".ts"],
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|my-project|react-native-button|node-fetch)/)",
  ],
};
