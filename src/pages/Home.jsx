import React, { useState, useEffect } from "react";
import { Box, Flex, Stack } from "@chakra-ui/react";
import AddRecordModal from "../component/AddRecordModal";
import RecordCard from "../component/RecordCard";

const Home = () => {
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem("records");
    return saved ? JSON.parse(saved) : [];
  });

  // Sinkronisasi ke localStorage saat records berubah
  useEffect(() => {
    localStorage.setItem("records", JSON.stringify(records));
  }, [records]);

  const handleAddRecord = (newRecord) => {
  const allRecords = JSON.parse(localStorage.getItem("records") || "[]");

  if (!allRecords.find((r) => r.date === newRecord.date)) {
    allRecords.push(newRecord);
  }

  localStorage.setItem("records", JSON.stringify(allRecords));
  setRecords(allRecords);
};


  const handleDeleteCard = (date) => {
    setRecords(records.filter(record => record.date !== date));
  };

  return (
    <Box p={6} bg="white" minH="100vh">
      <Flex justify="left" mb={6}>
        <AddRecordModal onAdd={handleAddRecord} />
      </Flex>

      <Stack spacing={6}>
        {records.map(record => (
          <RecordCard
            key={record.id}
            date={record.date}
            onDeleteCard={handleDeleteCard}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default Home;
