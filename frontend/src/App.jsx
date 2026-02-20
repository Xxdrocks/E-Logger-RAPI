import React from 'react'
import LogPage from './features/LogPage'
import { BrowserRouter, Route, Routes } from 'react-router'
import OperatorPage from './features/OperatorPage'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        {/* <Route path="/schedule" element={<SchedulePage />} /> */}
        <Route path="/" element={<LogPage />} />
        <Route path="/operators" element={<OperatorPage />} />
        {/* <Route path="/contact" element={<ContactPage />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
