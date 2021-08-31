import React ,{useEffect,useState} from "react";
import { Box, IconButton, Image, Stack, Text } from "@chakra-ui/react";
import Header from "../components/header";
import { Link, Redirect } from "react-router-dom";


const Dashboard = (props) => (
  <Stack backgroundColor="#eef2f9" ml="200px" h="100%">
   <Link to="/bill"> <Text fontSize="500">Dashboard</Text></Link>
  </Stack>
);

export default Dashboard;
