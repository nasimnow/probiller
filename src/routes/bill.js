import React ,{useEffect,useState} from "react";
import "@babel/polyfill"
import {
  Stack,
  Text,
  Box,
  Divider,
  Button,
  Input,
  FormLabel,
  FormControl,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import {
  Radio,
  RadioGroup,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  IconButton,
  SkeletonCircle,
} from "@chakra-ui/react";
import supabase from "../components/supabase";
import BillPrint from "../components/billPrint";
import AsyncSelect from "react-select/async";
import { useHistory } from "react-router-dom";

// Note: `user` comes from the URL, courtesy of our router
const Bill = () => {
  const [selectedQty, setSelectedQty] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState();
  const [billProducts, setBillProducts] = useState([]);
  const [payment, setPayment] = useState("CASH");
  const history = useHistory()

  const searchProducts = async (searchTerm, callBack) => {
    const response = await supabase
      .from("products")
      .select("*")
      .ilike(`name`, `%${searchTerm}%`);
    const filteredResponse = response.data.map((product) => ({
      value: product,
      label: product.name,
    }));

    callBack(filteredResponse);
  };

  const addOrder = async () => {
    setIsLoading(true);
    const resp = await supabase.from("orders").insert({
      date: new Date().toLocaleString(),
      products: JSON.stringify(billProducts),
      total_amount: billProducts.reduce(
        (prev, curr) => prev + curr.qty * curr.price,
        0
      ),
      payment,
    });
    console.log(resp);
    // history.push("/orders");
    setIsLoading(false);
  };

  return (
    <Stack backgroundColor="#eef2f9" ml="250px" h="100%">
      <Stack
        borderRadius="15px"
        m="40px"
        bgColor="white"
        p="40px"
        boxShadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
      >
        <Text fontWeight="bold" fontSize="20px" mb="20px">
          Add Order
        </Text>
        <Box w="40%">
          <AsyncSelect
            loadOptions={searchProducts}
            onChange={(input) => setSelectedProduct({ ...input })}
            value={selectedProduct}
          />
        </Box>
        {selectedProduct && (
          <Stack direction="row" mt="20px">
            <FormControl w="160px">
              <FormLabel>Price</FormLabel>
              <Text>₹{selectedProduct?.value?.price}</Text>
            </FormControl>
            <FormControl w="100px">
              <FormLabel>Qty</FormLabel>
              <InputGroup>
                <Input
                  type="number"
                  value={selectedQty}
                  onChange={(e) => setSelectedQty(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => setSelectedQty((old) => old + 1)}
                  >
                    +
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Stack>
        )}

        <Button
          w="130px"
          mt="30px"
          isDisabled={!selectedProduct && selectedQty}
          onClick={() => {
            setBillProducts((old) => [
              ...old,
              { ...selectedProduct.value, qty: selectedQty },
            ]);
            setSelectedProduct("");
            setSelectedQty(1);
          }}
        >
          Add Product
        </Button>

        <Table variant="simple" mt="20px">
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th>Item</Th>
              <Th isNumeric>Price</Th>
              <Th isNumeric>Qty</Th>
              <Th isNumeric>Total</Th>
            </Tr>
          </Thead>
          <Tbody>
            {billProducts?.map((item, i) => (
              <Tr>
                <Td>{i + 1}</Td>
                <Td>{item.name}</Td>
                <Td isNumeric>₹{item.price}</Td>
                <Td isNumeric>{item.qty}</Td>
                <Td isNumeric>₹{item.price * item.qty}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Stack alignSelf="flex-end" pr="20px" pt="60px">
          <Stack direction="row" mb="20px">
            <Text fontWeight="bold">Grant Total: </Text>
            <Text fontWeight="bold" pl="20px">
              ₹
              {billProducts.length > 0 &&
                billProducts.reduce(
                  (prev, curr) => prev + curr.qty * curr.price,
                  0
                )}
            </Text>
          </Stack>

          <FormControl pb="20px">
            <FormLabel>Payment</FormLabel>
            <RadioGroup onChange={setPayment} value={payment}>
              <Stack direction="row">
                <Radio value="CASH">CASH</Radio>
                <Radio value="ONLINE">ONLINE</Radio>
              </Stack>
            </RadioGroup>
          </FormControl>

          <Button
            size="lg"
            isDisabled={billProducts.length < 1}
            bgColor="#00d67e"
            color="white"
            mr="80px"
            alignSelf="flex-end"
            onClick={addOrder}
            isLoading={isLoading}
          >
            Bill Products
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Bill;
