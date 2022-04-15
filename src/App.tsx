import "./App.css";
import Login from "./views/login";
import Home from "./views/home";
import { Routes, Route } from "react-router-dom";
import { AuthGuard } from "./components/auth-guard";

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <AuthGuard>
          <Home />
        </AuthGuard>
      } />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
