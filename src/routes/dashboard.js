import React, { useEffect, useState } from "react";
import { Box, IconButton, Image, Stack, Text } from "@chakra-ui/react";
import Header from "../components/header";
import { Link, Redirect } from "react-router-dom";

const Dashboard = (props) => {
  useEffect(() => {}, []);

  return (
    <Stack backgroundColor="#eef2f9" ml="250px" h="100vh">
      <Link to="/bill">
        <Text fontSize="30">Dashboard</Text>
      </Link>
    </Stack>
  );
};

export default Dashboard;
