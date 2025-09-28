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

    const dummyUser = { username:"viki", password:"2312" };
    if(username === dummyUser.username && password === dummyUser.password){
      const fakeToken = "dummy-token-2312";
      localStorage.setItem("token", fakeToken);
      onLogin(fakeToken);
      navigate("/"); // redirect ke home setelah login
    }else{
      setError("Username atau password salah");
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
