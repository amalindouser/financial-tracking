import { useState, useEffect } from "react";
import {
  Box,
  Input,
  Button,
  Text,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  Flex,
} from "@chakra-ui/react";

const Savings = () => {
  const [saldoAwal, setSaldoAwal] = useState(0);
  const [inputSaldo, setInputSaldo] = useState("");

  // Ambil saldo awal dari localStorage
  useEffect(() => {
    const saveSaldo = localStorage.getItem("saldo");
    if (saveSaldo) {
      setSaldoAwal(JSON.parse(saveSaldo)); // ✅ lebih aman pakai JSON.parse
    }
  }, []);

  // Tambah saldo
  const handleAddSaldo = () => {
    const tambahSaldo = parseFloat(inputSaldo);
    if (isNaN(tambahSaldo)) return;

    const newSaldo = saldoAwal + tambahSaldo;
    setSaldoAwal(newSaldo);
    localStorage.setItem("saldo", JSON.stringify(newSaldo));
    setInputSaldo("");
  };

  // Edit saldo (ganti langsung)
  const handleEditSaldo = () => {
    const editSaldo = parseFloat(inputSaldo);
    if (isNaN(editSaldo)) return;

    setSaldoAwal(editSaldo);
    localStorage.setItem("saldo", JSON.stringify(editSaldo));
    setInputSaldo("");
  };

  // Reset saldo ke 0
  const handleResetSaldo = () => {
    setSaldoAwal(0);
    localStorage.setItem("saldo", JSON.stringify(0));
    setInputSaldo("");
  };

  return (
    <Box p={4} display="flex" justifyContent="center">
      <Card w="400px" shadow="md" borderRadius="lg">
        <CardHeader>
          <Heading size="md">Saldo Tabungan</Heading>
        </CardHeader>
        <CardBody>
          <Stack spacing={3}>
            <Text fontWeight="bold">
              Saldo: Rp {saldoAwal.toLocaleString("id-ID")}
            </Text>
            <Input
              type="number"
              placeholder="Masukkan jumlah saldo"
              value={inputSaldo}
              onChange={(e) => setInputSaldo(e.target.value)}
            />
          </Stack>
        </CardBody>
        <CardFooter>
          <Flex gap={2} w="full">
            <Button colorScheme="teal" onClick={handleAddSaldo} w="full">
              Tambah
            </Button>
            <Button colorScheme="orange" onClick={handleEditSaldo} w="full">
              Edit
            </Button>
            <Button colorScheme="red" onClick={handleResetSaldo} w="full">
              Reset
            </Button>
          </Flex>
        </CardFooter>
      </Card>
    </Box>
  );
};

export default Savings;
