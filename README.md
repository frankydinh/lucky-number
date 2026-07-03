# 🍀 Lucky Draw - PWA Random Name Picker

A modern, fully responsive Progressive Web App (PWA) built with React for running lucky draw events. Features engaging animations with multiple modes: Wheel of Names and Racing simulators (Car, Fish, and Horse).

![Lucky Draw](https://img.shields.io/badge/PWA-Ready-brightgreen)
![React](https://img.shields.io/badge/React-19.2-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### Core Functionality
- **📝 Name Input**: Add names via text input or CSV file upload
- **🎯 Two Draw Modes**:
  - **🎡 Wheel of Names**: Animated spinning wheel with colorful segments
  - **🏎️ Racing Car**: Exciting race simulation with Top 3 podium display
  - **🐟 Fish Race**: Same race, themed with fish swimming across water lanes
  - **🐎 Horse Race**: Same race, themed with horses galloping across the field
- **⏱️ Customizable Duration**: Adjust draw duration from 5 to 180 seconds
- **🎉 Winner Effects**: Confetti animations and visual celebrations
- **🔄 Smart Options**: Toggle to remove winners from subsequent draws (Wheel mode)

### Technical Features
- **📱 Fully Responsive**: Optimized for mobile, tablet, and desktop
- **💾 PWA Support**: Installable on mobile devices and works offline
- **🎨 Modern UI**: Beautiful gradient backgrounds and smooth animations
- **⚡ Fast Performance**: Built with Vite for optimal loading speeds

## 🚀 Live Demo

Visit the live app: [https://frankydinh.github.io/lucky-number](https://frankydinh.github.io/lucky-number)

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm

### Setup
```bash
# Clone the repository
git clone https://github.com/frankydinh/lucky-number.git
cd lucky-number

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Build & Deploy

### Local Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Deploy to GitHub Pages

#### Automatic Deployment (Recommended)
The app automatically deploys to GitHub Pages when you push to the `main` branch via GitHub Actions.

1. Ensure GitHub Pages is enabled in repository settings
2. Set source to "GitHub Actions"
3. Push to main branch - deployment happens automatically

#### Manual Deployment
```bash
npm run deploy
```

## 📱 Installing as PWA

### On Mobile (iOS/Android)
1. Open the app in your mobile browser
2. Tap the share/menu button
3. Select "Add to Home Screen"
4. The app icon will appear on your home screen

### On Desktop
1. Open the app in Chrome/Edge
2. Click the install icon in the address bar
3. Click "Install"

## 🎮 How to Use

1. **Enter Names**: 
   - Type names separated by commas or new lines
   - Or upload a CSV file with names
   
2. **Select Mode**:
   - Choose between Wheel of Names or a Racing mode (Car, Fish, or Horse)
   
3. **Set Duration**:
   - Adjust the animation duration (default: 60 seconds)
   - Use slider or preset buttons
   
4. **Configure Options** (Wheel mode only):
   - Toggle "Remove winner from next draw" if desired
   
5. **Start Draw**:
   - Click "Start Draw" button
   - Enjoy the animation!
   
6. **View Results**:
   - Wheel mode: See the winner with confetti
   - Racing mode: View Top 3 podium with medals
   
7. **Draw Again**:
   - Click "Draw Again" to run another draw

## 🛠️ Tech Stack

- **Framework**: React 19.2 with Hooks
- **Build Tool**: Vite 7.2
- **Styling**: CSS3 with CSS Variables
- **Animations**: Framer Motion
- **Effects**: Canvas Confetti
- **PWA**: vite-plugin-pwa with Workbox
- **Deployment**: GitHub Pages via GitHub Actions

## 📁 Project Structure

```
lucky-number/
├── src/
│   ├── components/
│   │   ├── NameInput.jsx          # Name input component
│   │   ├── ModeSelector.jsx       # Mode selection UI
│   │   ├── DurationSettings.jsx   # Duration controls
│   │   ├── WheelOfNames.jsx       # Wheel animation
│   │   ├── RacingCar.jsx          # Racing simulation
│   │   └── WinnerDisplay.jsx      # Winner celebration
│   ├── App.jsx                    # Main app component
│   ├── App.css                    # App styles
│   ├── index.css                  # Global styles
│   └── main.jsx                   # Entry point
├── public/
│   ├── icon.svg                   # App icon (SVG)
│   ├── pwa-192x192.png           # PWA icon 192x192
│   └── pwa-512x512.png           # PWA icon 512x512
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Actions workflow
├── index.html                    # HTML template
├── vite.config.js               # Vite configuration
└── package.json                 # Dependencies

```

## 🎨 Customization

### Colors
Edit CSS variables in `src/index.css`:
```css
:root {
  --primary: #4F46E5;
  --secondary: #7C3AED;
  --success: #10B981;
  /* ... */
}
```

### Animation Duration Presets
Modify in `src/components/DurationSettings.jsx`:
```javascript
const presetDurations = [30, 60, 90, 120];
```

### Wheel/Car Colors
Edit color arrays in respective components:
```javascript
const colors = ['#EF4444', '#F59E0B', '#10B981', ...];
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with ❤️ using React and Vite
- Icons and emojis from Unicode standard
- Confetti effects by canvas-confetti
- Animations powered by Framer Motion

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check existing issues for solutions

---

**Enjoy your lucky draws! 🍀**
