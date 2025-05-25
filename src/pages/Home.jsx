// Home.jsx
import { useEffect, useState, useRef } from "react";
import axios from "axios";
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
  Input,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const cancelRef = useRef();
  const [selectedProductId, setSelectedProductId] = useState(null);

  const priceColor = useColorModeValue("teal.500", "teal.100");
  const cardColor = useColorModeValue("gray.100", "gray.800");
  const toast = useToast();

  const searchTimeout = useRef(null);
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setPage(1);
  };

  useEffect(() => {
    AOS.init({ duration: 300, once: true, easing: "ease-out" });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/products`,
          {
            params: {
              search: searchQuery,
              page,
              limit: 12,
              minPrice,
              maxPrice,
              sort,
            },
            signal: controller.signal,
          }
        );

        setProducts(res.data.products || []);
        setTotalPages(res.data.pages || 1);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("Error fetching products:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(searchTimeout.current);
    };
  }, [searchQuery, page, minPrice, maxPrice, sort]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
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
          description: res.data.message || "Something went wrong",
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

  return (
    <Center>
      <Box p={4} maxWidth={"1300px"} minH={"100vh"}>
        <Center mb={6} mt={8} flexDirection="column" gap={4}>
          {/* <Heading width={"fit-content"}>Explore Products</Heading> */}
          <HStack spacing={4} justifyContent="center" width="1200px">
            <Input
              placeholder="Search products by name..."
              value={searchQuery}
              onChange={handleSearchChange}
              maxWidth="400px"
            />
            <Box>
              <HStack spacing={4} flexWrap="wrap">
                <input
                  type="number"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setPage(1);
                  }}
                  style={{ padding: "8px", borderRadius: "5px" }}
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setPage(1);
                  }}
                  style={{ padding: "8px", borderRadius: "5px" }}
                />
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setPage(1);
                  }}
                  style={{ padding: "8px", borderRadius: "5px" }}
                >
                  <option value="">Sort By</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A-Z</option>
                  <option value="name_desc">Name: Z-A</option>
                </select>
              </HStack>
            </Box>
          </HStack>
        </Center>

        {loading ? (
          <Center py={10}>
            <Spinner size="xl" />
          </Center>
        ) : products.length === 0 ? (
          <Text textAlign="center" mt={10} fontSize="lg">
            No products found.
          </Text>
        ) : (
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
        )}

        {/* Pagination Buttons */}
        <Center mt={8} gap={4}>
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <Text>
            Page {page} of {totalPages}
          </Text>
          <Button
            onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </Center>
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
