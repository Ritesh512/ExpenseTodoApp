import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
:root {
  /* Common Variables */
  --color-brand-50: #eef2ff;
  --color-brand-100: #e0e7ff;
  --color-brand-200: #c7d2fe;
  --color-brand-500: #6366f1;
  --color-brand-600: #4f46e5;
  --color-brand-700: #4338ca;
  --color-brand-800: #3730a3;
  --color-brand-900: #312e81;

  --border-radius-tiny: 4px;
  --border-radius-sm: 8px;
  --border-radius-md: 12px;
  --border-radius-lg: 20px;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 8px 30px rgba(0, 0, 0, 0.2);
  --shadow-lg: 0 20px 50px rgba(0, 0, 0, 0.3);
}

[data-theme='light'] {
  --color-bg-main: #f8fafc;
  --color-bg-card: rgba(255, 255, 255, 0.8);
  --color-bg-accent: rgba(99, 102, 241, 0.1);
  
  --color-grey-0: #ffffff;
  --color-grey-50: #f9fafb;
  --color-grey-100: #f3f4f6;
  --color-grey-200: #e5e7eb;
  --color-grey-300: #d1d5db;
  --color-grey-400: #9ca3af;
  --color-grey-500: #6b7280;
  --color-grey-600: #4b5563;
  --color-grey-700: #374151;
  --color-grey-800: #1f2937;
  --color-grey-900: #111827;

  --glass-bg: rgba(255, 255, 255, 0.7);
  --glass-border: rgba(0, 0, 0, 0.08);
  --glass-blur: blur(12px);

  --color-blue-100: #e0f2fe;
  --color-blue-700: #0369a1;
  --color-green-100: #dcfce7;
  --color-green-700: #15803d;
  --color-red-100: #fee2e2;
  --color-red-700: #b91c1c;
}

[data-theme='dark'] {
  --color-bg-main: #0a0a0c;
  --color-bg-card: rgba(23, 23, 26, 0.7);
  --color-bg-accent: rgba(99, 102, 241, 0.1);
  
  --color-grey-0: #17171a;
  --color-grey-50: #0a0a0c;
  --color-grey-100: #262626;
  --color-grey-200: #404040;
  --color-grey-300: #525252;
  --color-grey-400: #737373;
  --color-grey-500: #a3a3a3;
  --color-grey-600: #d4d4d4;
  --color-grey-700: #e5e5e5;
  --color-grey-800: #f5f5f5;
  --color-grey-900: #ffffff;

  --glass-bg: rgba(255, 255, 255, 0.03);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-blur: blur(12px);

  --color-blue-100: #0c4a6e;
  --color-blue-700: #38bdf8;
  --color-green-100: #064e3b;
  --color-green-700: #34d399;
  --color-red-100: #7f1d1d;
  --color-red-700: #f87171;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s, box-shadow 0.3s;
}

html {
  font-size: 62.5%;
}

body {
  font-family: "Poppins", sans-serif;
  color: var(--color-grey-700);
  background-color: var(--color-bg-main);
  min-height: 100vh;
  line-height: 1.5;
  font-size: 1.6rem;
  overflow-x: hidden;
}

input,
button,
textarea,
select {
  font: inherit;
  color: inherit;
}

button {
  cursor: pointer;
  border: none;
  background: none;
}

*:disabled {
  cursor: not-allowed;
}

select:disabled,
input:disabled {
  background-color: var(--color-grey-200);
  color: var(--color-grey-400);
}

input:focus,
button:focus,
textarea:focus,
select:focus {
  outline: 2px solid var(--color-brand-600);
  outline-offset: -1px;
}

a {
  color: inherit;
  text-decoration: none;
}

ul {
  list-style: none;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
  hyphens: auto;
  color: var(--color-grey-900);
}

img {
  max-width: 100%;
}
`;

export default GlobalStyles;
