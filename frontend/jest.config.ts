// jest.config.js (or jest.config.ts)
module.exports = {
  testEnvironment: 'jest-environment-jsdom', // Use jsdom for React components
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'], // Add jest-dom matchers
  moduleNameMapper: {
    // Handle module aliases (if you have any)
    '^@/(.*)$': '<rootDir>/src/$1', // Example: @/components -> src/components
  },
  transform: {
    // Transform JS/TS files using Babel (or other transformer if needed)
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },
  testMatch: [
    // Look for tests in these locations
    '<rootDir>/__tests__/**/*.test.js', // or .ts, .tsx, .jsx
    '<rootDir>/src/**/*.{test,spec}.js', // or .ts, .tsx, .jsx
    '<rootDir>/app/**/*.{test,spec}.js', // or .ts, .tsx, .jsx (for App Router)
  ],
  collectCoverageFrom: [
    // Collect coverage from these files (optional but recommended)
    'src/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
  ],
  coverageReporters: ['html', 'text', 'clover', 'json', 'lcov', 'cobertura'], // Coverage report formats
};
