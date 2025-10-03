import { useState } from "react";
import {
  Box,
  VStack,
  Heading,
  Input,
  Button,
  Alert,
  AlertIcon,
  Flex,
  Image,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const dummyUser = { username: "viki", password: "2312" };
    if (username === dummyUser.username && password === dummyUser.password) {
      const fakeToken = "dummy-token-2312";
      localStorage.setItem("token", fakeToken);
      onLogin(fakeToken);
      navigate("/"); // redirect ke home setelah login
    } else {
      setError("Username atau password salah");
    }
  };

  return (
    <Flex h="100vh" flexDir={{ base: "column", md: "row" }}>
      {/* Bagian kiri (gambar) */}
      <Box flex="1" bg="white" display="flex" alignItems="center" justifyContent="center">
      <Image
      src="/img/user firts welcome website.png"
      alt="Login Illustration"
      objectFit="contain"
      marginLeft="25"
      maxW="100%"
      maxH="100%"
    />

      </Box>


      {/* Bagian kanan (form login) */}
<Flex flex="1" align="center" justify="center" bg="white">
  <Box
    maxW="sm"
    w="100%"
    p={8}
    borderWidth={1}
    borderRadius="xl"
    boxShadow="lg"
    bg="white"
  >
    <VStack spacing={6} align="stretch">
      <Heading size="lg" textAlign="center" color="teal.600">
        Welcome Back 👋
      </Heading>

      {error && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      )}

      <VStack spacing={4}>
        <Input
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          focusBorderColor="teal.400"
        />
        <Input
          placeholder="Enter your password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          focusBorderColor="teal.400"
        />
        <Button colorScheme="teal" w="100%" size="lg" onClick={handleLogin}>
          Login
        </Button>
      </VStack>

      <Box textAlign="center" fontSize="sm" color="gray.500">
        Don’t have an account?{" "}
        <Button variant="link" colorScheme="teal" size="sm">
          Sign Up
        </Button>
      </Box>
    </VStack>
  </Box>
 </Flex>

    </Flex>
  );
}

export default Login;
