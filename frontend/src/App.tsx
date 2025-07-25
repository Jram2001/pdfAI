import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from './app/routes/auth/login';
import UploadPromt from './app/routes/home/home';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPromt />} />
        <Route path="/auth/login" element={<LoginPage />} />
      </Routes>
    </Router>
  )
}

export default App
