import { Routes, Route, Link } from "react-router-dom";
import Lesson01 from "./components/lesson/lesson-01";
import Lesson02 from "./components/lesson/lesson-02";
import Lesson03 from "./components/lesson/lesson-03";
import Lesson04 from "./components/lesson/lesson-04";

export default function App() {
  return (
    <div>
      <nav style={{ padding: "1rem", display: "flex", gap: "1rem" }}>
        <Link to="/lesson-01">Lesson 01</Link>
        <Link to="/lesson-02">Lesson 02</Link>
        <Link to="/lesson-03">Lesson 03</Link>
        <Link to="/lesson-04">Lesson 04</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Lesson04 />} />
        <Route path="/lesson-01" element={<Lesson01 />} />
        <Route path="/lesson-02" element={<Lesson02 />} />
        <Route path="/lesson-03" element={<Lesson03 />} />
        <Route path="/lesson-04" element={<Lesson04 />} />
      </Routes>
    </div>
  );
}
