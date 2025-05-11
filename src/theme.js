import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "dark", // Set the default color mode to dark
    useSystemColorMode: false, // Optional: Don't follow the system's preference
  },
});

export default theme;
