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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";

// Validation schema — note: image URL required only if no file
const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be greater than 0")
    .required("Price is required"),
  image: Yup.string()
    .url("Must be a valid URL")
    .nullable(),
});

const EditProduct = () => {
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    setError,
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
        setValue("image", product.image.startsWith("/uploads/") ? "" : product.image);
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

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      // Clear URL field
      setValue("image", "");
      clearErrors("image");
    }
  };

  const onSubmit = async (data) => {
    // Enforce at least one image input
    if (!imageFile && !data.image) {
      setError("image", {
        type: "manual",
        message: "Either image URL or uploaded file is required",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price);

      if (imageFile) {
        formData.append("imageFile", imageFile);
      } else {
        formData.append("imageUrl", data.image);
      }

      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
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
            <Input
              {...register("image")}
              isDisabled={!!imageFile}
              placeholder="https://..."
            />
            <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
          </FormControl>

          <FormControl mb={6}>
            <FormLabel>Or Upload New Image</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
            />
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
