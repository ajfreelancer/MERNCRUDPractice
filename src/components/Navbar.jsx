import {
  Box,
  Flex,
  Heading,
  Spacer,
  IconButton,
  Button,
  HStack,
  useColorMode,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { FaRegLightbulb } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // adjust path if needed

const Navbar = () => {
  const { toggleColorMode } = useColorMode();
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const fillColor = useColorModeValue("#1A202C", "#B2F5EA");
  const toast = useToast();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box p={4} boxShadow="md">
      <Flex align="center">
        <Link to="/">
          <Heading size="md">My App</Heading>
        </Link>
        <Spacer />
        <HStack spacing={3}>
          <IconButton
            aria-label="Add Product"
            icon={<AddIcon />}
            colorScheme="teal"
            onClick={() => {
              const token = localStorage.getItem("token");
              if (token) {
                navigate("/create");
              } else {
                toast({
                  title: "Unauthorized",
                  description: "You must be logged in to add a product.",
                  status: "warning",
                  duration: 3000,
                  isClosable: true,
                });
              }
            }}
          />
          <IconButton
            aria-label="Toggle Dark Mode"
            icon={<FaRegLightbulb />}
            onClick={toggleColorMode}
          />
          {!isLoggedIn ? (
            <>
              <Link to="/login">
                <Button variant="outline" colorScheme="teal" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button colorScheme="teal" size="sm">
                  Signup
                </Button>
              </Link>
            </>
          ) : (
            <Button colorScheme="red" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
