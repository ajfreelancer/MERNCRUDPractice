import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Spinner,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

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
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`);
      const data = await res.json();
      setValue("name", data.name);
      setValue("price", data.price);
      setValue("image", data.image);
    };
    fetchProduct();
  }, [id, setValue]);

  const onSubmit = async (formData) => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      toast({
        title: "Product updated!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      navigate("/");
    } else {
      const data = await res.json();
      toast({
        title: "Error",
        description: data.message || "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={8} padding={4}>
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

        <Button type="submit" colorScheme="teal" isLoading={isSubmitting}>
          Update Product
        </Button>
      </form>
    </Box>
  );
};

export default EditProduct;
