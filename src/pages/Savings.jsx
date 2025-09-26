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
} from "@chakra-ui/react";

const Savings = () => {
  const [saldoAwal, setSaldoAwal] = useState(0);
  const [inputSaldo, setInputSaldo] = useState("");

  // Ambil saldo awal
  useEffect(() => {
    const fetchSaldo = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/savings");
        const data = await res.json();
        setSaldoAwal(data.amount || 0);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSaldo();
  }, []);

  // Simpan saldo baru
  const handleSaveSaldo = async () => {
    const newSaldo = parseFloat(inputSaldo);
    if (isNaN(newSaldo)) return;

    try {
      const res = await fetch("http://localhost:5000/api/savings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: newSaldo }),
      });
      const data = await res.json();
      setSaldoAwal(data.amount);
      setInputSaldo("");
    } catch (err) {
      console.error(err);
    }
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
