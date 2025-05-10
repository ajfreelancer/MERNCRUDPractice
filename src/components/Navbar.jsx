import {
  Box,
  Flex,
  Heading,
  Spacer,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { FaRegLightbulb } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { toggleColorMode } = useColorMode();

  return (
    <Box p={4} boxShadow="md">
      <Flex align="center">
        <Link to="/">
          <Heading size="md">BrandName</Heading>
        </Link>
        <Spacer />
        <Link to="/create">
          <IconButton
            aria-label="Add"
            icon={<AddIcon />}
            colorScheme="teal"
            mr={2}
          />
        </Link>
        <IconButton
          aria-label="Toggle Dark Mode"
          icon={<FaRegLightbulb />}
          onClick={toggleColorMode}
        />
      </Flex>
    </Box>
  );
};

export default Navbar;
