# Angular 19 Project

## Project Overview
This is an Angular 19 project that requires specific setup steps to install dependencies and run properly. This README provides instructions on how to set up and run the project.



## Prerequisites
# Project GitHub Repository

The source code is located in the [prod branch](https://github.com/Ziyodilla308/Hire5-Angular14-/tree/prod) of the repository. Follow the steps below to clone the code and proceed with the installation.

---

Before you begin, ensure you have the following installed:

- **Google Chrome** (for installing NVM)
- **NVM (Node Version Manager)**
- **Node.js (Version 20)**
- **npm (Node Package Manager)**
- **TypeScript**
- **Angular CLI (Version 19)**
- **Git**
- **WebStorm or Visual Studio Code (Recommended IDEs)**

## Installation Steps

### Step 1: Install NVM
NVM (Node Version Manager) is required to manage multiple Node.js versions. Install NVM through Google Chrome.

### Step 2: Install Node.js via NVM
Once NVM is installed, open **CMD** and install Node.js versions 20 and 21:
```sh
nvm install 20
nvm install 21
```
Set Node.js version 20 as the active version:
```sh
nvm use 20
```

### Step 3: Verify npm Installation
When NVM installs Node.js, **npm** is installed automatically. Verify the installation:
```sh
npm -v
```

### Step 4: Install TypeScript
Install TypeScript globally:
```sh
npm install -g typescript
```

### Step 5: Install Angular CLI
Install Angular CLI version 19 globally:
```sh
npm install -g @angular/cli@19
```

### Step 6: Clone the Repository
Clone the project from GitHub (recommended to use Git Bash):
```sh
git clone <repository-url>
```

### Step 7: Open the Project in an IDE
Use **WebStorm** or **Visual Studio Code** to open the project folder.

### Step 8: Install Project Dependencies
Navigate to the project directory and install all dependencies:
```sh
npm install
```

### Step 9: Run the Project
Start the Angular application using one of the following commands:
```sh
ng serve
```
Or
```sh
npm start
```

### Step 10: Install and Run JSON Server
The project uses **json-server** for the profile section. Install json-server:
```sh
npm install -g json-server
```

Run json-server in a separate terminal window:
```sh
json-server --watch db.json --port 3000
```

## Usage
- Open **http://localhost:4200/** in your browser to access the application.
- Ensure **json-server** is running before interacting with the profile section.

## Contributing
If you want to contribute to this project, please follow these steps:
1. Fork the repository.
2. Create a new branch.
3. Make your changes and commit them.
4. Push the changes to your fork.
5. Create a pull request.

## Contact
For any inquiries, feel free to reach out via email or open an issue on GitHub.

---
This document provides a structured guide to setting up and running the project. Make sure to follow all steps carefully to avoid issues.

