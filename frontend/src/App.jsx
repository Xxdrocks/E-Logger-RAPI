import React from 'react'
import LogPage from './features/LogPage'
import { BrowserRouter, Route, Routes } from 'react-router'
import OperatorPage from './features/OperatorPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LogPage />} />
        <Route path="/operator" element={<OperatorPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
