# 🗳️ VoteWise India - AI-Powered Election Assistant

![VoteWise India Banner](https://via.placeholder.com/1200x400.png?text=VoteWise+India+-+AI+Election+Assistant)

VoteWise India is a next-generation, AI-powered web application designed to empower the modern Indian voter. Through intelligent conversational interfaces, real-time mapping, and gamified education, it simplifies the complex democratic process—from voter registration to navigating the polling booth.

## 🌟 Key Features

- **🤖 AI Election Assistant**: Integrated with Google Gemini to answer voter queries, explain processes (EVM/VVPAT), and provide instant, accurate election information.
- **🗺️ Real-time Booth Locator**: Utilizes Google Maps Platform to provide real-time GPS tracking of your nearest polling stations.
- **📱 Seamless Digital Journey**: Step-by-step guidance for verifying eligibility, voter registration, and understanding the voting procedure.
- **🌐 Multilingual Support**: Accessible to a diverse demographic with built-in language switching.
- **🏆 Civic IQ & Certification**: Gamified learning modules and quizzes that reward users with digital badges for mastering the election process.
- **🛡️ Truth & Clarity**: A dedicated myth-busting section to combat misinformation regarding voter privacy and EVM security.
- **🔐 Secure User Authentication**: Backed by Firebase Authentication to ensure safe user profiles and tracking.

## 🛠️ Tech Stack

- **Frontend Framework**: [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **Styling & Animations**: Vanilla CSS + [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Integration**: [Google Generative AI (Gemini)](https://ai.google.dev/)
- **Maps & Location**: [`@vis.gl/react-google-maps`](https://visgl.github.io/react-google-maps/)
- **Backend & Auth**: [Firebase](https://firebase.google.com/)

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Firebase Account
- Google Maps API Key
- Google Gemini API Key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Adityasri05/VoteWise-India.git
   cd VoteWise-India
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Environment Variables**

   Create a `.env` file in the root directory and add your API keys and Firebase configuration:

   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. **Run the Development Server**

   ```bash
   npm run dev
   ```

5. **Open in Browser**

   Navigate to `http://localhost:5173` to view the application.

## 📂 Project Structure

```text
├── public/                 # Static assets (favicon, etc.)
├── src/                    # Application source code
│   ├── assets/             # Images and local assets
│   ├── components/         # Reusable React components (AuthModal, Timeline, etc.)
│   ├── context/            # React context providers (LanguageContext)
│   ├── services/           # External API integrations (gemini.js)
│   ├── App.jsx             # Main application component & Routing
│   ├── main.jsx            # React entry point
│   ├── firebase.js         # Firebase initialization
│   ├── index.css           # Global styles and design tokens
│   └── style.css           # Additional specific styles
├── index.html              # HTML entry point
├── package.json            # Project dependencies and scripts
├── vite.config.js          # Vite configuration
└── README.md               # Project documentation
```

## 🎨 Design Philosophy

VoteWise India focuses on providing a premium, accessible, and user-friendly experience. We leverage vibrant yet professional color palettes, modern typography (Inter & Outfit), and subtle micro-animations to ensure the user feels engaged and guided throughout their civic journey.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Developed with ❤️ for a stronger democracy.*
