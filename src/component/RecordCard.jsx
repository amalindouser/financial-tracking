// RecordCard.jsx
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

const RecordCard = ({ date, onDeleteCard }) => {
  const [items, setItems] = useState([]);
  const [keperluan, setKeperluan] = useState("");
  const [jenis, setJenis] = useState("pemasukan");
  const [keterangan, setKeterangan] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [saldoAwal, setSaldoAwal] = useState(0);

  const toggleOpen = () => setIsOpen(!isOpen);

  // Ambil data record sesuai tanggal
useEffect(() => {
  const fetchRecords = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/records", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ kirim token
        },
      });

      if (!res.ok) {
        const text = await res.text(); // kalau error, jangan parse JSON
        throw new Error(text || "Gagal ambil records");
      }

      const data = await res.json();
      const filtered = data.filter((record) => record.date === date);
      setItems(filtered);
    } catch (error) {
      console.error("Gagal mengambil data:", error.message);
    }
  };
  fetchRecords();
}, [date]);


  // Ambil saldo global dari backend
  useEffect(() => {
  const fetchSaldo = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/savings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ kirim token
        },
      });

      if (!res.ok) {
        // kalau backend balikin 401 Unauthorized
        const text = await res.text(); 
        throw new Error(text || "Gagal ambil saldo");
      }

      const data = await res.json();
      if (data && typeof data.amount === "number") {
        setSaldoAwal(data.amount);
      }
    } catch (err) {
      console.error("Gagal ambil saldo:", err.message);
    }
  };
  fetchSaldo();
}, []);


  // Tambah record baru dan update saldo global
  const handleAddItem = async () => {
    const jumlahNum = parseFloat(jumlah);
    if (!keperluan || isNaN(jumlahNum)) return;

    const newRecord = { keperluan, jenis, keterangan, jumlah: jumlahNum, date };

    try {
      const res = await fetch("http://localhost:5000/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecord),
      });
      const data = await res.json();

      if (data.id) {
        setItems((prev) => [...prev, data]);

        // Update saldo global di backend
        const newSaldo =
          jenis === "pemasukan" ? saldoAwal + jumlahNum : saldoAwal - jumlahNum;

        await fetch("http://localhost:5000/api/savings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: newSaldo }),
        });

        setSaldoAwal(newSaldo);
      }

      // Reset form
      setKeperluan("");
      setJenis("pemasukan");
      setKeterangan("");
      setJumlah("");
    } catch (error) {
      console.error("Gagal tambah data:", error);
    }
  };

  // Total pemasukan & pengeluaran di card ini (informasi saja)
  const totalPemasukan = items
    .filter((item) => item.jenis === "pemasukan")
    .reduce((sum, item) => sum + item.jumlah, 0);

  const totalPengeluaran = items
    .filter((item) => item.jenis === "pengeluaran")
    .reduce((sum, item) => sum + item.jumlah, 0);

  // Gunakan saldo global sebagai saldo card
  const saldo = saldoAwal;

  return (
    <Box borderWidth="1px" borderRadius="lg" p={{ base: 3, md: 5 }} boxShadow="md" bg="white" w="100%">
      <HStack justify="space-between" align="center" mb={4}>
        <Heading size={{ base: "md", md: "lg" }}>Catatan {date}</Heading>
        <HStack spacing={2}>
          <Box bg="green.100" px={2} py={1} borderRadius="md">
            <Text fontSize="sm" color="green.700">+ {totalPemasukan.toLocaleString("id-ID")}</Text>
          </Box>
          <Box bg="red.100" px={2} py={1} borderRadius="md">
            <Text fontSize="sm" color="red.700">- {totalPengeluaran.toLocaleString("id-ID")}</Text>
          </Box>
          <Box bg="teal.100" px={2} py={1} borderRadius="md">
            <Text fontSize="sm" color="teal.700">Saldo: {saldo.toLocaleString("id-ID")}</Text>
          </Box>
          <IconButton icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />} onClick={toggleOpen} variant="ghost" aria-label="Toggle" />
          <IconButton colorScheme="red" size="sm" icon={<DeleteIcon />} onClick={() => onDeleteCard(date)} aria-label="Hapus catatan" />
        </HStack>
      </HStack>

      <Collapse in={isOpen} animateOpacity>
        <Stack direction={{ base: "column", md: "row" }} spacing={3} mb={4} align={{ base: "stretch", md: "flex-end" }}>
          <Input placeholder="Jenis Keperluan" value={keperluan} onChange={(e) => setKeperluan(e.target.value)} flex="1" />
          <Select value={jenis} onChange={(e) => setJenis(e.target.value)} flex="1">
            <option value="pemasukan">Pemasukan</option>
            <option value="pengeluaran">Pengeluaran</option>
          </Select>
          <Input placeholder="Keterangan" value={keterangan} onChange={(e) => setKeterangan(e.target.value)} flex="1" />
          <Input type="number" placeholder="Jumlah" value={jumlah} onChange={(e) => setJumlah(e.target.value)} flex="1" inputMode="numeric" />
          <Button colorScheme="teal" onClick={handleAddItem} w={{ base: "100%", md: "auto" }}>Tambah</Button>
        </Stack>

        <Box overflowX="auto">
          {items.length > 0 ? (
            <RecordTable items={items} setItems={setItems} saldoAwal={saldoAwal} setSaldoAwal={setSaldoAwal} />
          ) : (
            <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>Belum ada catatan.</Text>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};

export default RecordCard;
