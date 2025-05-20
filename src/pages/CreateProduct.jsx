import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Validation schema
const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be greater than 0")
    .required("Price is required"),
  image: Yup.string()
    .url("Image must be a valid URL")
    .required("Image URL is required"),
});

const CreateProduct = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const toast = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/products`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast({
        title: "Product created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("/");
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      minH="79vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={4}
    >
      <Box maxW="md" width="100%">
        <Button onClick={() => navigate("/")} colorScheme="gray" mb={4}>
          Back to Products
        </Button>
        <Heading mb={6}>Add New Product</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl mb={4} isInvalid={!!errors.name}>
            <FormLabel>Name</FormLabel>
            <Input {...register("name")} />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors.price}>
            <FormLabel>Price</FormLabel>
            <Input type="number" {...register("price")} />
            <FormErrorMessage>{errors.price?.message}</FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors.image}>
            <FormLabel>Image URL</FormLabel>
            <Input {...register("image")} />
            <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            width="full"
            isLoading={isSubmitting}
          >
            Create Product
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default CreateProduct;
