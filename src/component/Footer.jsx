import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box bg="teal.500" py={4} mt="auto" color="white">
      <Flex justify="center" align="center">
        <Text fontSize="sm">
          &copy; {new Date().getFullYear()} Financial Tracker. Bagus Viki Amalindo.
        </Text>
      </Flex>
    </Box>
  );
};

export default Footer;