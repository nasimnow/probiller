import React, { useEffect, useState } from "react";

import {
  Stack,
  Text,
  Input,
  Box,
  Skeleton,
  useDisclosure,
  Button,
  Tooltip,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
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

import html2canvas from "html2canvas";
import printJS from "print-js";

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
import { UilTrashAlt, UilReceiptAlt, UilPrint } from "@iconscout/react-unicons";
import { useHistory } from "react-router-dom";
import sendAsync from "../message-control/renderrer";

// Note: `user` comes from the URL, courtesy of our router
const Orders = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState();
  const [orders, setOrders] = useState([]);
  const [recieptOpen, setRecieptOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [paid, setPaid] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();

  useEffect(() => {
    const getOrders = async () => {
      const response = await sendAsync("SELECT * FROM orders ORDER BY id DESC");
      setOrders(response);
      setIsLoading(false);
    };
    getOrders();
  }, []);

  const printReciept = (orderDetails) => {
    setPaid("");
    setModalType("paid");
    onOpen();
    setSelectedOrder(orderDetails);
  };

  const printProceed = () => {
    onClose();
    setRecieptOpen(true);
    setTimeout(async () => {
      const node = document.getElementById("order_reciept");
      html2canvas(node, {
        allowTaint: true,
        useCORS: true,
        logging: true,
      }).then((img) => {
        try {
          printJS({
            printable: img.toDataURL("image/jpeg"),
            type: "image",
            base64: "true",
          });
        } catch (error) {
          console.log(error);
        }
      });
      setRecieptOpen(false);
    }, 100);
  };

  const deleteOrder = async (id) => {
    if (confirm(`Deleting Order ${id}`)) {
      await sendAsync(`DELETE FROM orders WHERE id=${id}`);
      setOrders((old) => old.filter((item) => item.id !== id));
    }
  };

  const downloadReciept = (orderDetails) => {
    setSelectedOrder(orderDetails);
    setModalType("reciept");
    onOpen();
  };

  return (
    <Stack backgroundColor="#eef2f9" ml="250px" h="100vh">
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Order#:{selectedOrder?.id}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="grid" placeItems="center" mb="10px">
            {modalType == "reciept" ? (
              <BillPrint data={selectedOrder} />
            ) : (
              <Stack w="100%">
                <FormControl w="80%">
                  <FormLabel>Paid</FormLabel>
                  <Input
                    autoFocus
                    w="100%"
                    type="number"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") paid && printProceed();
                    }}
                    onChange={(e) => setPaid(e.target.value)}
                    value={paid}
                  />
                </FormControl>
                <Button
                  bgColor="#00d67e"
                  color="white"
                  w="130px"
                  mt="30px"
                  isDisabled={!paid}
                  onClick={printProceed}
                >
                  Proceed
                </Button>
              </Stack>
            )}
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
          <Button
            onClick={() => history.push("/bill")}
            bgColor="#00d67e"
            color="white"
          >
            Add Order
          </Button>
        </Stack>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>id</Th>
              <Th>Date</Th>
              <Th>Name</Th>

              <Th>Mobile</Th>
              <Th isNumeric>Total Amount</Th>
              <Th>Payment</Th>
              {/* <Th>Paid</Th> */}
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
              <Tr key={item.id}>
                <Td>{item.id}</Td>
                <Td>{`${new Date(item.date).toLocaleDateString(
                  "en-IN"
                )} - ${new Date(item.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`}</Td>
                <Td>{item.name}</Td>
                <Td>{item.mobile}</Td>
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
                  <IconButton
                    p="2px"
                    onClick={() => printReciept({ ...item, paid })}
                    borderRadius="full"
                    icon={<UilPrint size="20px" color="orange" />}
                  />
                  <IconButton
                    p="2px"
                    ml="10px"
                    onClick={() => downloadReciept({ ...item, paid })}
                    borderRadius="full"
                    icon={<UilReceiptAlt size="20px" color="green" />}
                  />
                  <IconButton
                    p="2px"
                    ml="10px"
                    onClick={() => deleteOrder(item.id)}
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
