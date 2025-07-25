import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadPromt from './app/routes/home/home';
import { ActiveNumberProvider } from './service/activePage';


function App() {
  return (
    <Router>
      <ActiveNumberProvider>
        <Routes>
          <Route path="/" element={<UploadPromt />} />
        </Routes>
      </ActiveNumberProvider>
    </Router>
  )
}

export default App
