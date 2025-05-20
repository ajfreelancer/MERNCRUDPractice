import { useEffect, useState, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import {
  Box,
  Heading,
  Text,
  Image,
  SimpleGrid,
  Spinner,
  Center,
  Card,
  CardBody,
  Stack,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  useColorModeValue,
  IconButton,
  HStack,
  Button,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const cancelRef = useRef();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const priceColor = useColorModeValue("teal.500", "teal.100");
  const cardColor = useColorModeValue("gray.100", "gray.800");
  const toast = useToast();

  useEffect(() => {
    // Initialize AOS animation
    AOS.init({ duration: 300, once: true, easing: "ease-out" });
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        toast({
          title: "Product deleted",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Something went wrong",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast({
        title: "Error",
        description: "Network error or server not responding",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

  if (loading) {
    return (
      <Center py={10} minH={"80vh"}>
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Center>
      <Box p={4} maxWidth={"1300px"} minH={"100vh"}>
        <Center>
          <Heading mb={6} mt={8} width={"fit-content"}>
            All Products
          </Heading>
        </Center>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
          {products.map((product, index) => (
            <Card
              key={product._id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              shadow="md"
            >
              <Image
                loading="lazy"
                src={product.image}
                alt={product.name}
                height="300px"
                width="100%"
                objectFit="cover"
                fallbackSrc="https://via.placeholder.com/200"
                backgroundColor={"white"}
              />
              <CardBody bg={cardColor}>
                <Stack spacing={2}>
                  <Heading size="sm">{product.name}</Heading>
                  <Text fontWeight="bold" fontSize={"lg"} color={priceColor}>
                    PKR {product.price.toLocaleString()}
                  </Text>
                  <HStack spacing={2} mt={3}>
                    <IconButton
                      icon={<FiSettings />}
                      aria-label="Edit product"
                      size="sm"
                      colorScheme="teal"
                      onClick={() => {
                        const token = localStorage.getItem("token");
                        if (token) {
                          navigate(`/edit/${product._id}`);
                        } else {
                          toast({
                            title: "Unauthorized",
                            description:
                              "You must be logged in to edit a product.",
                            status: "warning",
                            duration: 3000,
                            isClosable: true,
                          });
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => {
                        const token = localStorage.getItem("token");
                        if (token) {
                          setSelectedProductId(product._id);
                          onOpen();
                        } else {
                          toast({
                            title: "Unauthorized",
                            description:
                              "You must be logged in to delete a product.",
                            status: "warning",
                            duration: 3000,
                            isClosable: true,
                          });
                        }
                      }}
                    >
                      <MdDelete />
                    </Button>
                  </HStack>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Box>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Product
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this product? This action cannot
              be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => handleDelete(selectedProductId)}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Center>
  );
};

export default Home;
