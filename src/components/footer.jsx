// src/components/Footer.jsx
import { Box, Text, Stack } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box bg="black.100" py={4} mt={10} borderTop="1px solid black">
      <Stack align="center">
        <Text fontSize="sm" color="white.100">
          &copy; {new Date().getFullYear()} Brand Name. All rights reserved.
        </Text>
      </Stack>
    </Box>
  );
};

export default Footer;
