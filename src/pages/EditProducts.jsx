import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const EditProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({ name: "", price: "", image: "" });
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    })
      .then((res) => res.json())
      .then(() => {
        toast({ title: "Product updated!", status: "success", duration: 2000 });
        navigate("/");
      });
  };

  if (loading) return <Spinner />;

  return (
    <Box maxW="md" mx="auto" mt={8} padding={4}>
      <Button onClick={() => navigate("/")} colorScheme="gray" mb={4}>
        Back to Products
      </Button>

      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel>Name</FormLabel>
          <Input
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Price</FormLabel>
          <Input
            name="price"
            type="number"
            value={product.price}
            onChange={handleChange}
            required
          />
        </FormControl>

        <FormControl mb={4}>
          <FormLabel>Image URL</FormLabel>
          <Input
            name="image"
            value={product.image}
            onChange={handleChange}
            required
          />
        </FormControl>

        <Button type="submit" colorScheme="teal">
          Update Product
        </Button>
      </form>
    </Box>
  );
};

export default EditProduct;
