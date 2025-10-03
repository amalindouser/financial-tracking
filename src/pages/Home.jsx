import React, { useState, useEffect } from "react";
import { Box, Flex, Stack } from "@chakra-ui/react";
import AddRecordModal from "../component/AddRecordModal";
import RecordCard from "../component/RecordCard";

const Home = () => {
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem("records");
    return saved ? JSON.parse(saved) : [];
  });

  const [saldoAwal, setSaldoAwal] = useState(0);

  useEffect(() => {
    const savedSaldo = parseFloat(localStorage.getItem("saldo") || "0");
    setSaldoAwal(savedSaldo);
  }, []);

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
    setRecords(records.filter((record) => record.date !== date));
  };

  // 🔹 Urutkan records berdasarkan tanggal (naik)
  const sortedRecords = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <Box p={6} bg="white" minH="100vh">
      <Flex justify="left" mb={6}>
        <AddRecordModal onAdd={handleAddRecord} />
      </Flex>

      <Stack spacing={6}>
        {sortedRecords.reduce((acc, record, index) => {
          // saldoAwal untuk card pertama
          const currentSaldoAwal = index === 0 ? saldoAwal : acc[index - 1].saldoAkhir;

          // hitung total pemasukan & pengeluaran card ini
          const totalPemasukan = (record.items || [])
            .filter((item) => item.jenis === "pemasukan")
            .reduce((sum, item) => sum + item.jumlah, 0);

          const totalPengeluaran = (record.items || [])
            .filter((item) => item.jenis === "pengeluaran")
            .reduce((sum, item) => sum + item.jumlah, 0);

          const saldoAkhir = currentSaldoAwal + totalPemasukan - totalPengeluaran;

          acc.push({
            element: (
              <RecordCard
                key={record.date}
                date={record.date}
                saldoAwal={currentSaldoAwal}
                onDeleteCard={handleDeleteCard}
              />
            ),
            saldoAkhir,
          });

          return acc;
        }, []).map((item) => item.element)}
      </Stack>
    </Box>
  );
};

export default Home;