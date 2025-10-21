# 🛠️ Mac and Linux Development Setup Guide for docverse

Welcome to the **docverse** contributor community! 🎉  
This guide is designed for **beginners** who may have never contributed to an open-source project before. It will walk you through **every step** required to set up the development environment on **macOS** and **Linux**, so you can start contributing confidently to this AI-powered document generation platform.

---

## 📚 Table of Contents

- [📆 Prerequisites](#-prerequisites)
- [✅ Step 1: Install a Package Manager](#-step-1-install-a-package-manager)
- [🔧 Step 2: Install Git](#-step-2-install-git)
- [🧰 Step 3: Install Node.js and npm via NVM](#-step-3-install-nodejs-and-npm-via-nvm)
- [💻 Step 4: Terminal & Shell Setup (Optional but Recommended)](#-step-4-terminal--shell-setup-optional-but-recommended)
- [🧑‍💻 Step 5: Install VS Code and Extensions](#-step-5-install-vs-code-and-extensions)
- [📂 Step 6: Clone and Set Up the Project](#-step-6-clone-and-set-up-the-project)
- [⚙️ Step 7: Setup Environment Variables](#-step-7-setup-environment-variables)
- [🚀 Step 8: Run the Project Locally](#-step-8-run-the-project-locally)
- [🎨 Step 9: Optional Dev Enhancements](#-step-9-optional-dev-enhancements)
- [🧪 Step 10: Common Issues & Fixes](#-step-10-common-issues--fixes)
- [🤝 Need Help?](#-need-help)

---

## 📆 Prerequisites

Before you begin, ensure you have the following:
- A **GitHub account**: [Sign up here](https://github.com/join)
- **Basic familiarity** with opening a terminal (Command Line Interface)
- **Admin rights** on your machine (to install tools)

---

## ✅ Step 1: Install a Package Manager

### 🍎 macOS – Homebrew
Homebrew is a popular package manager that simplifies installing software on macOS.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Verify installation:
```bash
brew --version
```

---

### 🐧 Linux – APT (Ubuntu/Debian)
APT is the default package manager on most Debian-based Linux systems.

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential curl file git
```

---

## 🔧 Step 2: Install Git

Git is used to track code changes and collaborate with others.

### macOS

```bash
brew install git
```

### Linux

```bash
sudo apt install git
```

Verify installation:

```bash
git --version
```

---

## 🧰 Step 3: Install Node.js and npm via NVM

NVM (Node Version Manager) helps manage multiple Node versions easily.

### 3.1 Install NVM

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Then activate NVM:

```bash
source ~/.bashrc   # or ~/.zshrc
```

### 3.2 Install Node.js (Latest LTS)

```bash
nvm install --lts
nvm use --lts
```

Verify:

```bash
node -v
npm -v
```

---

## 💻 Step 4: Terminal & Shell Setup (Optional but Recommended)

### macOS

- Terminal: [iTerm2](https://iterm2.com/)
- Shell: [Oh My Zsh](https://ohmyz.sh/)
- Theme: [Powerlevel10k](https://github.com/romkatv/powerlevel10k)

Install Zsh + Oh My Zsh:

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

Add Powerlevel10k:

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/powerlevel10k
echo 'source ~/powerlevel10k/powerlevel10k.zsh-theme' >> ~/.zshrc
```

### Linux

```bash
sudo apt install zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

---

## 🧑‍💻 Step 5: Install VS Code and Extensions

### macOS

```bash
brew install --cask visual-studio-code
```

### Linux

```bash
sudo snap install code --classic
```

### Recommended Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- GitLens
- Markdown All in One
- DotENV

---

## 📂 Step 6: Clone and Set Up the Project

### Step 6.1: Fork the Repository

Go to [https://github.com/Muneerali199/docverse](https://github.com/Muneerali199/docverse) and click the **Fork** button.

### Step 6.2: Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/docverse.git
cd docverse
```

> Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 6.3: Install Dependencies

```bash
npm install
```

---

## ⚙️ Step 7: Setup Environment Variables

### Copy the example file

```bash
cp .env.local.example .env.local
```

### Edit `.env.local` and add:

- Supabase keys
- Google API keys
- Any other required environment variables

Ask maintainers if you need development sample credentials.

---

## 🚀 Step 8: Run the Project Locally

```bash
npm run dev
```

Visit the app locally in your browser:

[http://localhost:3000](http://localhost:3000)

---

## 🎨 Step 9: Optional Dev Enhancements

- **Terminal Themes**: Dracula, One Dark, Nord
- **VS Code Themes**: GitHub Dark, Night Owl, Monokai Pro
- **Shell Plugins**: autosuggestions, syntax highlighting

---

## 🧪 Step 10: Common Issues & Fixes

### ❌ `npm install` Errors

```bash
rm -rf node_modules
npm cache clean --force
npm install
```

### ❌ Node or npm not recognized

```bash
nvm use
```

---

## 🤝 Need Help?

- Refer to [`README.md`](./README.md) and [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- Comment under your assigned GitHub issue
- Join the community Discord or reach out to project mentors

---

Made with ❤️ by the [docverse](https://github.com/Muneerali199/docverse) community.

Happy coding and welcome aboard! 🚀
