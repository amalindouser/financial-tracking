import { useState, useEffect, use } from "react";
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
} from "@chakra-ui/react";

const Savings = () => {
  const [saldoAwal, setSaldoAwal] = useState(0);
  const [inputSaldo, setInputSaldo] = useState("");

  // Ambil saldo awal
  useEffect(() => {
    const saveSaldo = localStorage.getItem("saldo");
    if (saveSaldo) {
      setSaldoAwal(parseFloat(saveSaldo));
    }
  }, []);

  // Simpan saldo baru
  const handleSaveSaldo = () => {
    const newSaldo = parseeFload(inputSaldo);
    if (isNaN(newSaldo)) return;
    setSaldoAwal(newSaldo);
    localStorage.setItem("saldo", JSON.stringify(newSaldo));
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
              Saldo Awal: Rp {saldoAwal.toLocaleString()}
            </Text>
            <Input
              type="number"
              placeholder="Masukkan saldo awal"
              value={inputSaldo}
              onChange={(e) => setInputSaldo(e.target.value)}
            />
          </Stack>
        </CardBody>
        <CardFooter>
          <Button colorScheme="teal" onClick={handleSaveSaldo} w="full">
            Simpan
          </Button>
        </CardFooter>
      </Card>
    </Box>
  );
};

export default Savings;
