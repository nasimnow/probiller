import React ,{useEffect,useState} from "react";

import {
  Stack,
  Text,
  Input,
  Box,
  Button,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import supabase from "../components/supabase";

const ProductAdd = ({ type, data }) => {
  const [product, setProduct] = useState({ ...data });
  const [isLoading, setIsLoading] = useState(false);

  const addProduct = async () => {
    setIsLoading(true);
    const resp = await supabase.from("products").insert(product);
    setIsLoading(false);
    setProduct({ name: "", price: "" });
  };

  const updateProduct = async () => {
    setIsLoading(true);
    const resp = await supabase
      .from("products")
      .update(product)
      .eq("id", data.id);
    setIsLoading(false);
  };
  return (
    <Stack w="100%" p="30px" pt="10px" spacing="20px">
      <FormControl w="80%">
        <FormLabel>Product Name</FormLabel>
        <Input
          type="text"
          name="name"
          value={product.name}
          onChange={(e) =>
            setProduct((old) => ({ ...old, name: e.target.value }))
          }
        />
      </FormControl>
      <FormControl w="50%" mt="10px">
        <FormLabel>Product Price</FormLabel>
        <Input
          type="number"
          value={product.price}
          onChange={(e) =>
            setProduct((old) => ({ ...old, price: +e.target.value }))
          }
        />
      </FormControl>
      {type == "add" ? (
        <Button
          bgColor="#00d67e"
          color="white"
          onClick={addProduct}
          isLoading={isLoading}
        >
          Add Product
        </Button>
      ) : (
        <Button
          bgColor="#00d67e"
          color="white"
          onClick={updateProduct}
          isLoading={isLoading}
        >
          Update Product
        </Button>
      )}
    </Stack>
  );
};

export default ProductAdd;
