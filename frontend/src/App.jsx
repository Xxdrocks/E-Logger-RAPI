import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import OperatorPage from './features/operator/OperatorPage'
import Navbar from './components/Navbar'
import HomePage from './features/home/HomePage'
import LogPage from './features/log/LogPage'
import Footer from './components/Footer'
import SchedulePage from './features/schedule/SchedulePage'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path='/logger' element={<LogPage />} />
        <Route path="/operators" element={<OperatorPage />} />
        {/* <Route path="/contact" element={<ContactPage />} /> */}
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
