import "./App.css";
import Home from "./Pages/Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <div
      className="w-[100%] flex justify-center min-h-[100vh]"
      style={{ fontFamily: "Inter" }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/:userid" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
