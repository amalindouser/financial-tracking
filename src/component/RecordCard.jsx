import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Stack,
  Input,
  Select,
  Button,
  IconButton,
  Collapse,
  HStack,
  Text,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon, DeleteIcon } from "@chakra-ui/icons";
import RecordTable from "./RecordTable";

const RecordCard = ({ date, onDeleteCard, saldoAwal }) => {
  const [items, setItems] = useState([]);
  const [keperluan, setKeperluan] = useState("");
  const [jenis, setJenis] = useState("pemasukan");
  const [keterangan, setKeterangan] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const toggleOpen = () => setIsOpen(!isOpen);

  // 🔹 Ambil data berdasarkan date
  const loadData = () => {
    const allRecords = JSON.parse(localStorage.getItem("records") || "[]");
    const record = allRecords.find((r) => r.date === date);
    setItems(record && Array.isArray(record.items) ? record.items : []);
  };

  useEffect(() => {
    loadData();
  }, [date]);

  // 🔹 Tambah record baru
  const handleAddItem = () => {
    const jumlahNum = parseFloat(jumlah);
    if (!keperluan || isNaN(jumlahNum)) return;

    const newItem = {
      id: Date.now(),
      keperluan,
      jenis,
      keterangan,
      jumlah: jumlahNum,
    };

    const allRecords = JSON.parse(localStorage.getItem("records") || "[]");
    const recordIndex = allRecords.findIndex((r) => r.date === date);

    if (recordIndex >= 0) {
      if (!Array.isArray(allRecords[recordIndex].items)) {
        allRecords[recordIndex].items = [];
      }
      allRecords[recordIndex].items.push(newItem);
    } else {
      allRecords.push({
        date: date,
        items: [newItem],
      });
    }

    localStorage.setItem("records", JSON.stringify(allRecords));
    loadData();

    // Reset input
    setKeperluan("");
    setJenis("pemasukan");
    setKeterangan("");
    setJumlah("");
  };

  // 🔹 Hitung total pemasukan, pengeluaran, tabungan
  const totalPemasukan = items
    .filter((item) => item.jenis === "pemasukan")
    .reduce((sum, item) => sum + item.jumlah, 0);

  const totalPengeluaran = items
    .filter((item) => item.jenis === "pengeluaran")
    .reduce((sum, item) => sum + item.jumlah, 0);

  const totalTabungan = items
    .filter((item) => item.jenis === "tabungan")
    .reduce((sum, item) => sum + item.jumlah, 0);

  // 🔹 Saldo akhir
  const saldoAkhir =
    (saldoAwal || 0) + totalPemasukan - totalPengeluaran + totalTabungan;

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={{ base: 3, md: 5 }}
      boxShadow="md"
      bg="white"
      w="100%"
    >
      {/* Header Card */}
      <HStack justify="space-between" align="center" mb={4}>
        <Heading size={{ base: "md", md: "lg" }}>Catatan {date}</Heading>
        <HStack spacing={2}>
          <Box bg="blue.100" px={2} py={1} borderRadius="md">
            <Text fontSize="sm" color="blue.700">
              + {totalPemasukan.toLocaleString("id-ID")}
            </Text>
          </Box>
          <Box bg="red.100" px={2} py={1} borderRadius="md">
            <Text fontSize="sm" color="red.700">
              - {totalPengeluaran.toLocaleString("id-ID")}
            </Text>
          </Box>
          <Box bg="green.100" px={2} py={1} borderRadius="md">
            <Text fontSize="sm" color="green.700">
              💰 {totalTabungan.toLocaleString("id-ID")}
            </Text>
          </Box>
          <Box bg="teal.100" px={2} py={1} borderRadius="md">
            <Text fontSize="sm" color="teal.700">
              Saldo: {saldoAkhir.toLocaleString("id-ID")}
            </Text>
          </Box>
          <IconButton
            icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            onClick={toggleOpen}
            variant="ghost"
            aria-label="Toggle"
          />
          <IconButton
            colorScheme="red"
            size="sm"
            icon={<DeleteIcon />}
            onClick={() => onDeleteCard(date)}
            aria-label="Hapus catatan"
          />
        </HStack>
      </HStack>

      {/* Collapse Form & Tabel */}
      <Collapse in={isOpen} animateOpacity>
        {/* Form Input */}
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={3}
          mb={4}
          align={{ base: "stretch", md: "flex-end" }}
        >
          <Input
            placeholder="Jenis Keperluan"
            value={keperluan}
            onChange={(e) => setKeperluan(e.target.value)}
            flex="1"
          />
          <Select value={jenis} onChange={(e) => setJenis(e.target.value)} flex="1">
            <option value="pemasukan">Pemasukan</option>
            <option value="pengeluaran">Pengeluaran</option>
            <option value="tabungan">Tabungan</option>
          </Select>
          <Input
            placeholder="Keterangan"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            flex="1"
          />
          <Input
            type="number"
            placeholder="Jumlah"
            value={jumlah}
            onChange={(e) => setJumlah(e.target.value)}
            flex="1"
            inputMode="numeric"
          />
          <Button
            colorScheme="teal"
            onClick={handleAddItem}
            w={{ base: "100%", md: "auto" }}
          >
            Tambah
          </Button>
        </Stack>

        {/* Tabel */}
        <Box overflowX="auto">
          {items.length > 0 ? (
            <RecordTable items={items} setItems={setItems} date={date} />
          ) : (
            <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
              Belum ada catatan.
            </Text>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default RecordCard;
