import Index from "./views";
import Repo from "./views/repo";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/repo" element={<Repo />} />
    </Routes>
  );
}

export default App;
