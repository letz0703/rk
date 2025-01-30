module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended"
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  settings: {
    react: {
      version: "detect", // React 버전을 자동 감지
    },
  },
  plugins: ["react-refresh"],
  rules: {
    "react/prop-types": "off", // PropTypes 검사 비활성화
    "react-refresh/only-export-components": "warn", // 컴포넌트 export 제한
  },
};
