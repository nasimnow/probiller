import { Stack, Text, Box, Divider, Button } from "@chakra-ui/react";
const BillPrint = ({ data }) => (
  <Stack
    id="order_reciept"
    position="relative"
    w="7.5cm"
    h="auto"
    border="1px solid grey"
    p="15px"
    alignItems="center"
    spacing="0"
  >
    <Text fontWeight="bold">Coffee Hub</Text>
    <Text fontSize="12px" textAlign="center" pb="5px" pt="4px">
      Calicut Road, Vennakad,
    </Text>
    <Text fontSize="12px" fontWeight="medium">
      Mob: 9946218229
    </Text>
    <Stack direction="row" w="100%" justifyContent="space-between" pt="12px">
      <Text fontSize="12px">{`Bill#:${data.id}`} </Text>
      <Text fontSize="12px">{`Date: ${new Date(data.date).toLocaleDateString(
        "en-IN"
      )} - ${new Date(data.date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`}</Text>
    </Stack>
    <Stack
      pt="20px"
      direction="row"
      fontSize="13px"
      justifyContent="space-between"
      w="100%"
      fontWeight="medium"
    >
      <Text w="10%">No</Text>
      <Text w="40%">Item</Text>
      <Text w="15%">Qty</Text>
      <Text w="15%">Rate</Text>
      <Text w="20%">Total</Text>
    </Stack>
    <Divider pt="6px" />
    {JSON.parse(data.products).map((item, i) => (
      <Stack
        pt="10px"
        direction="row"
        fontSize="13px"
        justifyContent="space-between"
        w="100%"
      >
        <Text w="10%">{i + 1}</Text>
        <Text w="40%">{item.name}</Text>
        <Text w="15%">{item.qty}</Text>
        <Text w="15%">₹{item.price} </Text>
        <Text w="20%">₹{item.price * item.qty}</Text>
      </Stack>
    ))}
    <Divider pt="30px" />
    <Stack direction="row" pt="15px" justifyContent="space-between" w="100%">
      <Text fontWeight="bold">Grant Total</Text>
      <Text fontWeight="bold">₹{data.total_amount}</Text>
    </Stack>
    <Stack
      pt="4px"
      fontSize="13px"
      direction="row"
      justifyContent="space-between"
      w="100%"
    >
      <Text>Balance</Text>
      <Text>₹{data.paid - data.total_amount}</Text>
    </Stack>
    <Box h="45px"></Box>
    <Text
      fontWeight="medium"
      fontSize="14px"
      textAlign="center"
      position="absolute"
      bottom="8px"
    >
      THANK YOU, VISIT AGAIN
    </Text>
  </Stack>
);

export default BillPrint;
