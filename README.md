# SkillSwap

SkillSwap is a campus-based micro-gig platform where students post, browse, book, and manage small skill-based gigs. 
This repository contains the complete autonomous mobile application implementation built as an academic deliverable consisting of 12 experiments.

## Features
- **Authentication**: JWT-based secure login and registration.
- **Responsive Dashboard**: Flexbox layout mapping dynamic viewport constraints.
- **Native Capabilities**: Image picking functionality natively interacting with device camera and photo gallery.
- **Gestures**: Swipe-to-cancel gestures on bookings using robust native UI drivers.
- **Offline Mode**: Stale-while-revalidate local caching, functional while disconnected from backend server.

## Architecture
```
[React Native / Expo Frontend] <---> (REST over HTTP) <---> [Express Backend] <---> [MongoDB]
```

## Tech Stack
- Frontend: Expo, React Native (JS only), Context API, React Navigation, Reanimated.
- Backend: Node.js, Express, MongoDB (Mongoose).

## Prerequisites
- Node.js (18+)
- npm
- Git
- (Optional) MongoDB local installation

## Setup & Running Without Android Studio
Follow these exact instructions if you do not have or wish to install Android Studio.

### 1. Prerequisites Check
\`\`\`powershell
node -v
npm -v
git --version
\`\`\`

### 2. Database (Option A: MongoDB Atlas - Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Build a new FREE cluster.
3. Create a database user with username and password.
4. Under Network Access, Add IP Address \`0.0.0.0/0\` to allow access from anywhere.
5. Click Connect -> Connect your application -> copy the \`MONGO_URI\`.
6. Use this URI in the \`backend/.env\` file.

*(Option B: Local MongoDB)* Install MongoDB Community Server locally.

### 3. Backend Setup
\`\`\`powershell
cd backend
copy .env.example .env
npm install
npm run seed
npm run dev
\`\`\`
Verify it is running:
\`\`\`powershell
Invoke-RestMethod http://localhost:5000/api/health
\`\`\`

### 4. Mobile Setup
\`\`\`powershell
cd ../mobile
npm install
\`\`\`

### 5. Path A: Browser Mobile View (Zero Install, Recommended)
Run the application completely in your browser.
\`\`\`powershell
npm run web
\`\`\`
1. Open the URL shown in the terminal (usually \`http://localhost:8081\`).
2. Interact with the application through the generated WebPhoneFrame. 
   Note: Some native capabilities like physical camera may gracefully fallback to file pickers.

### 6. Path B: Genymotion
1. Create a free Genymotion account and download Genymotion Desktop (choose bundled VirtualBox if needed).
2. Create an Android virtual device (e.g., Pixel 7) and start it.
3. Install standalone Android SDK platform-tools (adb) and add to PATH.
4. Start the app: \`npx expo start\`. Press \`a\` in the terminal to launch on the Genymotion emulator, or install Expo Go manually and point to \`exp://<LAN_IP>:8081\`.
5. Ensure Windows Firewall allows ports 5000 and 8081.

### 7. Path C: BlueStacks
1. Install BlueStacks 5.
2. Enable ADB in Settings -> Advanced.
3. Connect adb: \`adb connect 127.0.0.1:5555\`
4. Run \`npx expo start\` and press \`a\`.

### 8. Network Configuration
Run \`node scripts/detect-lan-ip.js\` to automatically generate the correct \`.env\` pointing to your LAN IP.
If using an emulator, it must be able to reach your machine's IP (e.g., 192.168.1.X). Genymotion can also use \`10.0.3.2\`.

### 9. Reset Commands
\`\`\`powershell
# Clear metro bundler cache
npx expo start -c
# Clear backend database (re-seed)
cd backend && npm run seed
\`\`\`

### 10. Per-Experiment Demo Table

| Experiment | Action | Browser Behavior | Genymotion / BlueStacks Behavior |
| --- | --- | --- | --- |
| 1. Basic UI | View Auth Screens | Renders UI natively to DOM | Renders native Views |
| 2. Flexbox | Resize Window | Grid adjusts columns (1->2->3) | Static columns by resolution |
| 3. Navigation | Click Tabs | URL updates, views push | Stack animations |
| 4. Global State | Login / Add to Cart | State updates synchronously | State updates synchronously |
| 5. Form Validation | Submit empty gig | Inline red text validation | Inline red text validation |
| 6. API Networking | Load gigs | Fetches from \`localhost:5000\` | Fetches from LAN IP / 10.0.3.2 |
| 7. Lists | Scroll Explore list | Infinite scroll & Web Refresh | Native FlatList & Pull-to-refresh |
| 8. Native Features | Post Gig -> Photo | Browser File Dialog / Webcam | Emulator Camera / Drag&Drop |
| 9. Animations | Swipe Booking | Mouse drag triggers pan | Touch drag triggers native pan |
| 10. Storage | Toggle Offline | Cache loads, warns offline | Cache loads, warns offline |

## Demo Accounts
- \`alice@campus.edu\` / \`password123\`
- \`bob@campus.edu\` / \`password123\`
- \`charlie@campus.edu\` / \`password123\`

## Troubleshooting
- **Network request failed (Emulator)**: Usually means the API URL is wrong. Ensure \`EXPO_PUBLIC_API_URL\` points to your LAN IP and firewall allows TCP 5000.
- **CORS errors (Web)**: The backend uses the \`cors\` package configured to allow all origins.
- **Port conflict**: If port 8081 is in use, Expo will ask to use another.
- **Image Picker fails**: On BlueStacks, camera may crash. Use the library fallback.
