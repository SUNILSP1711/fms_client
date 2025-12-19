import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from "./Components/Header.jsx"
import Home from "./Pages/Home.jsx"
import About from "./Pages/About.jsx"
import Contact from "./Pages/Contact.jsx"
import Signin from "./Pages/Signin.jsx"
import Signup from "./Pages/Signup.jsx"
import AdminDashboard from "./Dashboards/AdminDashBoard"
import StaffDashboard from "./Dashboards/StaffDashBoard"
import StudentDashboard from "./Dashboards/StudentDashBoard"

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
