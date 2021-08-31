import React ,{useEffect,useState} from "react";

import {
  Stack,
  Text,
  Input,
  Box,
  Skeleton,
  useDisclosure,
  Button,
  Tooltip,
} from "@chakra-ui/react";
import Header from "../components/header";
import {
  Table,
  Thead,
  Tbody,
  Badge,
  Tr,
  Th,
  Td,
  TableCaption,
  IconButton,
  SkeletonCircle,
} from "@chakra-ui/react";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import BillPrint from "../components/billPrint";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import { UilTrashAlt, UilReceiptAlt, UilPrint } from "@iconscout/react-unicons";
import supabase from "../components/supabase";
import ProductAdd from "./product_add";
import { useHistory } from "react-router-dom";

// Note: `user` comes from the URL, courtesy of our router
const Orders = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState();
  const [orders, setOrders] = useState([]);
  const [recieptOpen, setRecieptOpen] = useState(false);
  const [paid, setPaid] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory()

  useEffect(() => {
    const getProducts = async () => {
      setOrders([]);
      const response = await supabase
        .from("orders")
        .select("*")
        .order("id", { ascending: false });
      setOrders(response.data);
      setIsLoading(false);
    };

    getProducts();
  }, []);

  const printReciept = (orderDetails) => {
    setSelectedOrder(orderDetails);
    setRecieptOpen(true);
    setTimeout(async () => {
      const node = document.getElementById("order_reciept");
      html2canvas(node, {
        allowTaint: true,
        useCORS: true,
        logging: true,
      }).then((img) => {
        let nWindow = window.open("");
        nWindow.document.body.appendChild(img);
        nWindow.focus();
        nWindow.print();
        location.reload();
      });
      setRecieptOpen(false);
    }, 100);
  };

  const deleteProduct = async (id) => {
    if (confirm(`Deleting Order ${id}`)) {
      await supabase.from("orders").delete().eq("id", id);
      setOrders((old) => old.filter((item) => item.id !== id));
    }
  };

  const downloadReciept = (orderDetails) => {
    setSelectedOrder(orderDetails);
    onOpen();
  };

  return (
    <Stack backgroundColor="#eef2f9" ml="250px" h="100%">
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Order#:{selectedOrder?.id}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="grid" placeItems="center" mb="10px">
            <BillPrint data={selectedOrder} />
          </ModalBody>
        </ModalContent>
      </Modal>
      {recieptOpen && <BillPrint data={selectedOrder} />}
      <Box
        borderRadius="15px"
        m="40px"
        bgColor="white"
        p="40px"
        boxShadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
      >
        <Stack w="100%" direction="row" justifyContent="space-between">
          <Text fontWeight="bold" fontSize="20px" mb="20px">
            Orders
          </Text>

            <Button onClick={()=>history.push("/bill")} bgColor="#00d67e" color="white">
              Add Order
            </Button>

        </Stack>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>id</Th>
              <Th>Date</Th>
              <Th isNumeric>Total Amount</Th>
              <Th>Payment</Th>
              <Th>Paid</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading && (
              <Tr>
                <Td>
                  <Skeleton>loading</Skeleton>
                </Td>

                <Td>
                  <Skeleton>loading</Skeleton>
                </Td>

                <Td isNumeric>
                  <Skeleton>140</Skeleton>
                </Td>
                <Td>
                  <Skeleton>loading</Skeleton>
                </Td>

                <Td>
                  <SkeletonCircle size="10" />
                </Td>
              </Tr>
            )}
            {orders?.map((item) => (
              <Tr>
                <Td>{item.id}</Td>
                <Td>{`${new Date(item.date).toLocaleDateString(
                  "en-IN"
                )} - ${new Date(item.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`}</Td>

                <Td isNumeric fontWeight="bold">
                  ₹{item.total_amount}
                </Td>
                <Td>
                  {item.payment === "CASH" ? (
                    item.payment
                  ) : (
                    <Badge color="white" variant="solid" colorScheme="green">
                      {item.payment}
                    </Badge>
                  )}
                </Td>
                <Td>
                  <Input
                    w="70px"
                    onChange={(e) => setPaid(e.target.value)}
                    value={paid}
                  />
                </Td>
                <Td>
                  <IconButton
                    isDisabled={!paid}
                    onClick={() => printReciept({ ...item, paid })}
                    borderRadius="full"
                    icon={<UilPrint size="20px" color="orange" />}
                  />
                  <IconButton
                    ml="10px"
                    onClick={() => downloadReciept({ ...item, paid })}
                    borderRadius="full"
                    icon={<UilReceiptAlt size="20px" color="green" />}
                  />
                  <IconButton
                    ml="10px"
                    onClick={() => deleteProduct(item.id)}
                    borderRadius="full"
                    icon={<UilTrashAlt size="20px" color="red" />}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Stack>
  );
};

export default Orders;
