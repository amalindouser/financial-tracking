import React from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  // cek token dari localStorage
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); // redirect ke login setelah logout
  };

  return (
    <Box bg="teal.500" px={4} py={2} color="white">
      <Flex alignItems="center" justifyContent="space-between">
        {/* Logo */}
        <Text fontSize="lg" fontWeight="bold">
          Financial Tracker
        </Text>

        {/* Desktop Menu */}
        <HStack spacing={4} display={{ base: "none", md: "flex" }}>
          <Button
            as={Link}
            to="/"
            variant="ghost"
            _hover={{ bg: "teal.600" }}
            color="white"
          >
            Home
          </Button>
          <Button
            as={Link}
            to="/savings"
            variant="ghost"
            _hover={{ bg: "teal.600" }}
            color="white"
          >
            Tabungan
          </Button>

          {!token ? (
            <Button
              as={Link}
              to="/login"
              variant="ghost"
              _hover={{ bg: "teal.600" }}
              color="white"
            >
              Login
            </Button>
          ) : (
            <Button
              onClick={handleLogout}
              variant="ghost"
              _hover={{ bg: "teal.600" }}
              color="white"
            >
              Logout
            </Button>
          )}
        </HStack>

        {/* Hamburger (Mobile Only) */}
        <IconButton
          aria-label="Open Menu"
          icon={<HamburgerIcon />}
          display={{ base: "block", md: "none" }}
          onClick={onOpen}
          color="white"
          bg="teal.600"
          _hover={{ bg: "teal.700" }}
        />
      </Flex>

      {/* Drawer for Mobile Menu */}
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack align="start" spacing={4}>
              <Button as={Link} to="/" variant="ghost" onClick={onClose}>
                Home
              </Button>
              <Button as={Link} to="/savings" variant="ghost" onClick={onClose}>
                Tabungan
              </Button>

              {!token ? (
                <Button
                  as={Link}
                  to="/login"
                  variant="ghost"
                  onClick={onClose}
                >
                  Login
                </Button>
              ) : (
                <Button variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
