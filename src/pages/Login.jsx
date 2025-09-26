import { useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Input,
  Button,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useNavigate} from "react-router-dom";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });


      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      const data = await res.json();

      localStorage.setItem("token", data.token); // simpan token
      navigate("/");
      onLogin(data.token); // update state App.js
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <Box maxW="sm" mx="auto" mt={10} p={6} borderWidth={1} borderRadius="lg">
      <VStack spacing={4}>
        <Heading size="md">Login</Heading>
        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button colorScheme="teal" w="100%" onClick={handleLogin}>
          Login
        </Button>
      </VStack>
    </Box>
  );
}

export default Login;
