# SnackStore: A React Native Technical Assessment

Welcome! This project is a 1-hour live coding exercise designed to assess your skills in React Native, TypeScript, and modern state management practices.

## 1. Setup and Installation

Get the project running on your local machine with these simple steps.

```bash
# Clone the repository
git clone <repository_url>
cd react-native-cheaf-test

# Install dependencies using pnpm
pnpm install

# Start the Expo development server
pnpm start
```

## 2. Available Scripts

- `pnpm start`: Runs the app in development mode with Expo.
- `pnpm test`: Runs the test suite using Jest.
- `pnpm lint`: Lints the codebase with ESLint.
- `pnpm typecheck`: Runs the TypeScript compiler to check for type errors.
- `pnpm fix`: Automatically fixes linting and formatting issues.

## 3. Project Architecture

The project follows a standard feature-based architecture within the `src/` directory:

- **/app**: Contains all routes, managed by Expo Router.
- **/src/api**: Handles the fake API, data fetching, and Zod schemas.
- **/src/components**: Reusable UI components.
- **/src/config**: Configuration files, like the React Query client.
- **/src/data**: Mock data (`seed.json`).
- **/src/domain**: Core business models and type definitions.
- **/src/hooks**: Custom React hooks.
- **/src/store**: Global state management with Zustand (`cart.store.ts`, `settings.store.ts`).
- **/src/utils**: Utility functions.

## 4. Simulating Real-World Conditions

The **Settings** screen allows you to simulate common mobile development challenges:

- **Simulate Latency**: Adds a variable delay (350-800ms) to all API calls.
- **Simulate Random Errors**: Gives each API call a 20% chance of failure.
- **Clear Local Data**: Resets the cart and clears the React Query cache.
