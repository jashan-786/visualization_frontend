import { useState } from "react";
import "./App.css";
import { Landing } from "./Landing";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Visual from "./Visual";

const graphData = {
  nodes: [
    { id: "1", label: "Node 1", x: 0, y: 0, size: 10, color: "red" },
    { id: "2", label: "Node 2", x: 2, y: 2, size: 10, color: "blue" },
    { id: "3", label: "Node 3", x: 4, y: 0, size: 10, color: "green" },
    { id: "4", label: "Node 4", x: 6, y: 2, size: 10, color: "purple" },
    { id: "5", label: "Node 5", x: 6, y: -1, size: 10, color: "orange" },
  ],
  edges: [
    { source: "1", target: "2", color: "gray" },
    { source: "2", target: "3", color: "gray" },
    { source: "2", target: "4", color: "gray" },
    { source: "2", target: "5", color: "gray" },
  ],
};
function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/visualize" element={<Visual />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
