import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  UilArchive,
  UilMoneyStack,
  UilPizzaSlice,
} from "@iconscout/react-unicons";

import sendAsync from "../message-control/renderrer";
import OrdersCountChart from "../components/OrdersChart";
import { DateTime } from "luxon";

const Dashboard = (props) => {
  const [ordersData, setOrdersData] = useState("");
  const [dashBoardStats, setDashboardStats] = useState({
    orders: "_",
    revenue: "_",
    items: "_",
  });
  const [topItems, setTopItems] = useState([]);

  //add datepicker
  useEffect(() => {
    const getOrders = async () => {
      let ordersResponse = await sendAsync(
        `SELECT * FROM orders WHERE date BETWEEN '${DateTime.now().toFormat(
          "yyyy-MM-dd"
        )}' AND '${DateTime.local().plus({ days: 1 }).toFormat("yyyy-MM-dd")}'`
      );

      let revenue = ordersResponse.reduce(
        (sum, item) => sum + item.total_amount,
        0
      );

      let items = ordersResponse.reduce(
        (sum, item) => sum + JSON.parse(item.products).length,
        0
      );

      setDashboardStats({
        orders: ordersResponse.length,
        revenue: "₹" + revenue,
        items,
      });
      let count = {};
      let itemsonly = ordersResponse.map((item) => JSON.parse(item.products));
      itemsonly = itemsonly.reduce((a, b) => a.concat(b), []);
      for (let i of itemsonly) {
        count.hasOwnProperty(i.id)
          ? (count[i.id] += i.qty)
          : (count[i.id] = i.qty);
      }
      let result = Object.keys(count).map((key) => ({
        id: +key,
        count: count[key],
        name: itemsonly.find((item) => item.id === +key).name,
      }));

      setTopItems(result.sort((a, b) => a.count - b.count).reverse());
    };

    getOrders();
  }, []);

  const DetailsIcon = ({ data, name, icon, color }) => {
    return (
      <Stack flexDirection="row" spacing="0" h="60px">
        <Box
          backgroundColor={color}
          boxSize="55px"
          display="grid"
          placeItems="center"
          borderRadius="10px"
        >
          {icon}
        </Box>
        <Stack spacing="0" pl="10px">
          <Text color="#a6a6a6">{name}</Text>
          <Text fontWeight="bold" fontSize="22px">
            {data}
          </Text>
        </Stack>
      </Stack>
    );
  };

  return (
    <Stack backgroundColor="#eef2f9" p="40px" ml="250px" h="100vh" spacing="0">
      <Heading size="lg">Dashboard</Heading>
      <Text>{new Date().toDateString()}</Text>
      <Grid
        width="100%"
        templateColumns="2fr 1fr"
        templateRows="1fr 3fr"
        gap={4}
      >
        <GridItem>
          <Flex
            mt="30px !important"
            borderRadius="15px"
            bgColor="white"
            justifyContent="space-between"
            flexDirection="row"
            p="20px"
            pl="40px"
            pr="40px"
            boxShadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
            alignItems="center"
          >
            <DetailsIcon
              color="#FF9E9F"
              data={dashBoardStats.orders}
              name="Orders"
              icon={<UilArchive size="40px" color="#fff" />}
            />
            <DetailsIcon
              data={dashBoardStats.revenue}
              name="Revenue"
              icon={<UilMoneyStack size="40px" color="#fff" />}
              color="#91C9FA"
            />
            <DetailsIcon
              data={dashBoardStats.items}
              name="Items"
              icon={<UilPizzaSlice size="40px" color="#fff" />}
              color="#FFC09F"
            />
          </Flex>
          {/* {ordersData !== "" && <OrdersCountChart datas={ordersData} />} */}
        </GridItem>
        <GridItem>
          <Flex
            mt="30px !important"
            borderRadius="15px"
            bgColor="white"
            justifyContent="space-around"
            flexDirection="column"
            p="20px"
            boxShadow="rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
            alignItems="center"
          >
            <Heading w="100%" size="md" alignSelf="flex-start">
              Top Items
            </Heading>
            <Stack mt="10px" flexDirection="column" w="100%">
              {topItems?.map((item) => (
                <Stack
                  key={item.id}
                  spacing="0"
                  flexDirection="row"
                  w="100%"
                  justifyContent="space-between"
                >
                  <Text color="gray.500">{item.name}</Text>
                  <Text fontWeight="bold">{item.count}</Text>
                </Stack>
              ))}
            </Stack>
          </Flex>
        </GridItem>
      </Grid>
    </Stack>
  );
};

export default Dashboard;
