# Zi-act

A lightweight, custom React-like UI frontend library built from scratch in JavaScript, featuring a virtual DOM, JSX support, custom hooks, and a modern themeable UI componenet demo.

# Features

- ⚛️ Custom React-like Frontend library
- Virtual DOM diffing and reconciliation
- Fiber-like architecture for efficient updates
- JSX support (with pragma)
- Custom useState hook for functional components
- Custom UI function component
- Create new components using the same functional style as React.

# How It Works

- JSX is compiled (or interpreted via Babel in-browser) to use the custom Zact.createElement function.
- Virtual DOM: The framework builds a virtual DOM tree and efficiently updates the real DOM.
- Hooks: The custom useState hook enables stateful functional components.
- Themes: Theme styles are managed in a JS object and applied dynamically.

# Project Structure

```
├── .babelrc         # Babel configuration
├── app.js           # Main framework and demo app code
├── index.html       # Entry point
├── styles.css       # Basic styles
├── package.json     # Project metadata
├── .gitignore
└── LICENSE
```

# Example: Create a Button Component

```function MyButtonCounter() {
  /* accepts [val, setVal] state */ = Zact.useState('initialvalue');
  return (/*
  calling setVal to update the state for the component
  */);
}
```

# 📦 Babel Build & JSX Compilation

This project uses Babel to compile JSX and modern JavaScript into browser-compatible code. Babel transforms JSX (and ES6+) into plain JavaScript, ensuring compatibility.
