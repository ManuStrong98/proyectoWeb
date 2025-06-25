// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Juego from "./pages/Juego";
import Editor from "Editor";

function App() {
console.log("hola xd")
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Editor />} />
        <Route path="/api/:id/:tipo_de_juego" element={<Juego />} />
      </Routes>
    </Router>
  );
}

export default App;

