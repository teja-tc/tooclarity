// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// const eslintConfig = [
//   ...compat.extends("next/core-web-vitals", "next/typescript"),
// ];

// export default eslintConfig;


import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "src/app/test/**",
      "src/test/**",
      "src/components/auth/testComponents/**",
      "src/components/test/**",
      ".next/**",
      "node_modules/**",
      "dist/**",
      "build/**",
    ],
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      // Production-level unused vars configuration
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "caughtErrorsIgnorePattern": "^_",
          "destructuredArrayIgnorePattern": "^_",
          "ignoreRestSiblings": true,
          "args": "after-used",
          "vars": "all",
          "caughtErrors": "all"
        }
      ],
      "no-unused-vars": "off", // Let TypeScript handle this
      
      // Allow unused parameters in specific contexts
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      //Warns if you define {} as a type. Example: const user: {} = {};
      // We don't know what properties `user` has
      "@typescript-eslint/no-unsafe-function-type": "warn",
      //Always define the function parameters and return types explicitly.TypeScript can’t check if you’re using it correctly.
      //Example:
      //❌let myFunc: Function;  //✅let myFunc: (a: number, b: number) => number;
//❌myFunc = (a: number, b: number) => a + b; //✅myFunc = (a: number, b: number) => number;
//myFunc("hello", "world"); // ❌ TypeScript can’t warn you because it doesn't know what `myFunc` is //✅myFunc("hello", "world"); // ❌ TypeScript can’t warn you because it doesn't know what `myFunc` is

      "@typescript-eslint/no-wrapper-object-types": "warn",
      //Warns if you use wrapper types like String, Number, Boolean instead of lowercase string, number, boolean.
      "@typescript-eslint/ban-ts-comment": "warn",
      //Warns when you use // @ts-ignore or similar comments.
      //These comments bypass TypeScript checking, so better to avoid them.
      "@typescript-eslint/triple-slash-reference": "warn",
      //This is an old TypeScript feature; modules are preferred now.
      
      // React specific rules
      "react-hooks/rules-of-hooks": "error",
      //Hooks must always follow the rules: only call them at the top level, and only in React functions.
      "react-hooks/exhaustive-deps": "warn",
      //Warns if your hook dependencies array (useEffect, useCallback) is missing or incorrect.
      
      // Allow console in development but warn in production
      //"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-console": [
        process.env.NODE_ENV === "production" ? "warn" : "off",
       { allow: ["warn", "error"] } //allows console.warn and console.error in production
      ],
      
      // Import rules
      "import/no-unresolved": "off",
      //Why you might turn it OFF: Sometimes in TypeScript/Next.js, module paths use tsconfig aliases (like @/lib/api), and ESLint might wrongly think the path is invalid.
      "import/extensions": "off",
      //What it does when ON: ESLint enforces using file extensions in imports (like .js, .ts).
    },
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;