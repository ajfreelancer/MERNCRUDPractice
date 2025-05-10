import { useEffect, useState, useRef } from "react";

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
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { IconButton, HStack } from "@chakra-ui/react";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const priceColor = useColorModeValue('teal.500', 'teal.100');
  const cardColor = useColorModeValue('gray.100', 'gray.800');




  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched products:", data); // <-- Add this
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
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      onClose();
    }
  };

  if (loading) {
    return (
      <Center py={10}>
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Center>
      <Box p={4} maxWidth={"1300px"}>
        <Center>
          <Heading
            mb={6}
            marginTop={"8"}
            marginBottom={"12"}
            width={"fit-content"}
          >
            All Products
          </Heading>
        </Center>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
          {products.map((product, index) => (
            <Card
              key={index}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              shadow="md"
            >
              <Image
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
                    <Link to={`/edit/${product._id}`}>
                      <IconButton
                        icon={<FiSettings />}
                        aria-label="Edit product"
                        size="sm"
                        colorScheme="teal"
                      />
                    </Link>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => {
                        setSelectedProductId(product._id);
                        onOpen();
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
