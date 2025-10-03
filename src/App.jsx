import { useState } from "react";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Savings from "./pages/Savings";
import Navbar from "./component/Navbar"; // perbaikan folder
import Footer from "./component/Footer"; // perbaikan folder
import Login from "./pages/Login";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <ChakraProvider>
      <Router>
        <Box display="flex" flexDirection="column" minH="100vh">
          <Navbar onLogout={handleLogout} /> {/* menambahkan logout */}
          <Box flex="1" p={4}>
            <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route
                path="/"
                element={token ? <Home /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/savings"
                element={token ? <Savings saldo={0} /> : <Navigate to="/login" replace />}
              />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;
