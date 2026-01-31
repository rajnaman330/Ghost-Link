import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import ViewSecret from "./ViewSecret";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/view/:id" element={<ViewSecret />} />
      </Routes>
    </Router>
  );
}

export default App;