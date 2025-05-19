import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    VStack,
    Flex,
    useToast,
  } from "@chakra-ui/react";
  import { useForm } from "react-hook-form";
  import { yupResolver } from "@hookform/resolvers/yup";
  import * as yup from "yup";
  import { useNavigate } from "react-router-dom";
  import axios from "axios"; // ✅ Import Axios
  
  const schema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  });
  
  export default function Login() {
    const toast = useToast(); // ✅ Correct naming convention
    const navigate = useNavigate();
  
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema) });
  
    const onSubmit = async (data) => {
      try {
        const res = await axios.post("http://localhost:5000/api/users/login", data);
  
        localStorage.setItem("token", res.data.token);
  
        toast({
          title: "Login Successful",
          description: "You have successfully logged in.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
  
        navigate("/");
      } catch (err) {
        toast({
          title: "Login Failed",
          description: err.response?.data?.message || err.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
  
    return (
      <Flex minH="80vh" align="center" justify="center">
        <Box
          maxW="md"
          w="100%"
          p={6}
          boxShadow="md"
          border={"1px solid #333"}
          borderRadius="md"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              <FormControl isInvalid={errors.email}>
                <FormLabel>Email</FormLabel>
                <Input type="email" {...register("email")} />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>
  
              <FormControl isInvalid={errors.password}>
                <FormLabel>Password</FormLabel>
                <Input type="password" {...register("password")} />
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>
  
              <Button isLoading={isSubmitting} colorScheme="teal" type="submit">
                Login
              </Button>
            </VStack>
          </form>
        </Box>
      </Flex>
    );
  }
  