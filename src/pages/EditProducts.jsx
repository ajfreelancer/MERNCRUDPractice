import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";

// Validation schema
const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be greater than 0")
    .required("Price is required"),
  image: Yup.string()
    .url("Must be a valid URL")
    .required("Image URL is required"),
});

const EditProduct = () => {
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      price: "",
      image: "",
    },
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`
        );
        const product = res.data;
        setValue("name", product.name);
        setValue("price", product.price);
        setValue("image", product.image);
      } catch (err) {
        toast({
          title: "Error loading product",
          description: err.response?.data?.message || err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchProduct();
  }, [id, setValue, toast]);

  const onSubmit = async (formData) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast({
        title: "Product updated!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      navigate("/");
    } catch (err) {
      toast({
        title: "Error updating product",
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
            isLoading={isSubmitting}
            width="full"
          >
            Update Product
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default EditProduct;
