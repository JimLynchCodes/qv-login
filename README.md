# QV Automation & Session Re-opener

Automate your initial login to QV, save your session cookies locally, and re-open your dashboard instantly without logging in every time.

---

## Prerequisites & One-Time Setup

To allow your scripts to interact with your browser properly, you need to enable remote debugging in Chrome once:

1. Open Google Chrome and go to:
   ```text
   chrome://inspect/#remote-debugging
   ```
2. Check the box labeled **"Allow remote debugging for this browser instance"**.

---

## Environment Variables

Before running the scripts, make sure your environment variables are configured (via a `.env` file or exported in your shell):

Mac / linux:
```bash
export QUICKVEE_STORE="your_store_name"
export QUICKVEE_USERNAME="your_username"
export QUICKVEE_PASSWORD="your_password"
```

Windows:
For Command Prompt (cmd):
```
set QUICKVEE_STORE=your_store_name
set QUICKVEE_USERNAME=your_username
set QUICKVEE_PASSWORD=your_password
```

Method 2: Permanent (System-Wide via Windows Settings)
If you want Windows to remember these variables permanently across all future terminal sessions:

Press the Windows Key, type Environment Variables, and select Edit the system environment variables.

In the System Properties window that pops up, click the Environment Variables... button (bottom right).

Under the top section (User variables for [Your Username]), click New....

Add each variable one by one:

Variable name: QUICKVEE_STORE | Variable value: your_store_name

Variable name: QUICKVEE_USERNAME | Variable value: your_username

Variable name: QUICKVEE_PASSWORD | Variable value: your_password

Click OK on all windows to save.

Note: If you already have a terminal open, close and reopen it so it detects the newly saved environment variables.
---

## Usage Guide

### 1. Initial Login (`index.ts`)
Run this script the first time or whenever your session expires. It launches the browser, logs you into Quickvee automatically, and saves your authentication cookies to `cookies.json`.

```bash
npx tsx index.ts
```

### 2. Re-Opening the Session (`re-open.ts`)
Run this script whenever you want to open your dashboard. It loads your saved cookies from `cookies.json`, bypasses the login screen, and **disconnects**—shutting down the Node process while leaving your browser window wide open and fully interactive for you or other processes.

```bash
npx tsx re-open.ts