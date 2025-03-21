# Medusa Electron Browser (Beta)

![image](https://github.com/user-attachments/assets/685e5293-95ac-4214-8019-f12b72f1cac7)

A minimal web browser developed with **Electron JS**, focusing on **security**, **lightweight design**, and **simplicity**. The project follows **Electron JS security standards**, uses **the minimal necessary dependencies**, and is written in **Vanilla JavaScript and CSS**.

## 📌 Features

- 🔐 **Security**: Complies with Electron security best practices.
- 📦 **Minimal dependencies**: Avoids unnecessary packages.
- 🎨 **Simplicity**: Pure CSS UI.
- ⚡ **Lightweight and fast**: Designed for a smooth experience without extra overhead.
- 🏗 **Custom Web Components**: Implements JavaScript Custom Elements for modular and reusable UI components, located in the [`src/components/`](https://github.com/and75/Medusa-Electron-Browser-beta/tree/main/src/components) folder.

## 🚀 Installation

### 1. Clone the repository

```sh
git clone https://github.com/and75/Medusa-Electron-Browser-beta.git
cd Medusa-Electron-Browser-beta
```

### 2. Install dependencies

Make sure you have **Node.js** installed, then run:

```sh
npm install
```

### 3. Run the application

```sh
npm start
```

To build the application for distribution:

```sh
npm run build
```

## 🏗️ Project Architecture

### File Structure

- **`src/`**: Contains the main source code of the application.
  - **`main.ts`**: Manages Electron's main process, creates the main window, and sets security options.
  - **`renderer.ts`**: Manages the rendering process, including UI and browser logic.
  - **`components/`**: Contains custom JavaScript web components used in the application.
- **Configuration Files**:
  - **`package.json`**: Defines project dependencies and scripts for building and running.
  - **`tsconfig.json`**: Configures TypeScript compiler options.
  - **`webpack.main.config.ts`** & **`webpack.renderer.config.ts`**: Configure Webpack for bundling main and renderer processes.

### Technologies Used

- **Electron**: Framework for building cross-platform desktop applications with JavaScript, HTML, and CSS.
- **TypeScript**: Ensures static typing and better maintainability.
- **Webpack**: Manages code bundling for efficient distribution.
- **JavaScript Custom Elements**: Enables the creation of reusable and encapsulated UI components.

### Custom Web Components Overview

The Medusa Electron Browser uses JavaScript Custom Elements to modularize and encapsulate UI functionality:

- **`AddressBar`**: Manages the URL input field where users can enter web addresses. Handles user input, navigation events, and displays the current URL.
- **`NavigationButtons`**: Provides back, forward, refresh, and home buttons for browser navigation, triggering the corresponding actions.
- **`Tab`**: Represents an individual browser tab, displaying the title and favicon of the webpage, and managing the loading state.
- **`TabBar`**: Contains and manages multiple `Tab` components, allowing users to switch between open tabs and add new ones.
- **`BrowserWindow`**: Encapsulates the webview element that renders web content, handling loading events, errors, and communication between the web content and the rest of the application.

These components communicate via custom events and shared state objects to ensure a seamless browsing experience.

### Security

The application follows Electron's best security practices:

- **Context Isolation**: Enabled to prevent unauthorized access between the main and renderer processes.
- **Disabled Node Integration**: Prevents unauthorized execution of code in the renderer process.
- **CSP (Content Security Policy)**: Implemented to mitigate XSS attacks.

## 📜 License

This project is released under the **MIT License**.

---

If you have suggestions or want to contribute, feel free to open an issue or pull request! 😊

