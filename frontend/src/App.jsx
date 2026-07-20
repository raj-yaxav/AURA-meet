// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { LandingPage } from "./pages/LandingPage.jsx";
import { AuthForm } from "./pages/AuthForm.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import VideoMeetComponent from "./pages/videoMeet.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route path="/join/:roomId" element={<VideoMeetComponent />} />
          <Route path="/:roomId" element={<VideoMeetComponent />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App
