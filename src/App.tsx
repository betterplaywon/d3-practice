import { Routes, Route, Link } from "react-router-dom";
import Lesson01 from "./components/lesson/Lesson01";
import Lesson02 from "./components/lesson/Lesson02";
import Lesson03 from "./components/lesson/Lesson03";
import Lesson04 from "./components/lesson/Lesson04";

export default function App() {
  return (
    <div>
      <nav style={{ padding: "1rem", display: "flex", gap: "1rem" }}>
        <Link to="/lesson01">Lesson 01</Link>
        <Link to="/lesson02">Lesson 02</Link>
        <Link to="/lesson03">Lesson 03</Link>
        <Link to="/lesson04">Lesson 04</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Lesson04 />} />
        <Route path="/lesson01" element={<Lesson01 />} />
        <Route path="/lesson02" element={<Lesson02 />} />
        <Route path="/lesson03" element={<Lesson03 />} />
        <Route path="/lesson04" element={<Lesson04 />} />
      </Routes>
    </div>
  );
}
