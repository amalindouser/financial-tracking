import React, { useState } from "react";
import { Box, Flex, Stack } from "@chakra-ui/react";
import AddRecordModal from "../component/AddRecordModal";
import RecordCard from "../component/RecordCard";

const Home = () => {
  const [records, setRecords] = useState(()=> {
    const saved = localStorage.getItem("records");
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    localStorage.setItem("records", JSON.stringify(records));
  }, [records]);

  const handleAddRecord = (newRecord) => {
    if (records.some((record) => record.date === newRecord.date)) return;
    setRecords([...records, newRecord]);
  };

  const handleDeleteCard = (date) => {
    setRecords(records.filter((record) => record.date !== date));
  };

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      <Flex justify="left" mb={6}>
        <AddRecordModal onAdd={handleAddRecord} />
      </Flex>

      <Stack spacing={6}>
        {records.map((record) => (
          <RecordCard 
          key={record.id} 
          date={record.date} 
          onDeleteCard={handleDeleteCard}/>
        ))}
      </Stack>
    </Box>
  );
};

export default Home;
