import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './app/routes/auth/login';
import UploadPromt from './app/routes/home/home';
import { ActiveNumberProvider } from './service/activePage';


function App() {
  return (
    <Router>
      <ActiveNumberProvider>
        <Routes>
          <Route path="/" element={<UploadPromt />} />
          <Route path="/auth/login" element={<LoginPage />} />
        </Routes>
      </ActiveNumberProvider>
    </Router>
  )
}

export default App
