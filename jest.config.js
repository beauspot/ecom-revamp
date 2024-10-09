const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  preset: "ts-jest",
  clearMocks: true,
  forceExit: true,
  collectCoverage: true,
  verbose: true,
  forceExit: true,
  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
  collectCoverageFrom: [
    "<rootDir>/src/api/**/*.ts"
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/" }), 
  testMatch: ["**/**/*.test.ts", "**/**/*.spec.ts"],
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};