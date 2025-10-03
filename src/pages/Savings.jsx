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
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#E53E3E", "#3182CE", "#38A169", "#D69E2E", "#805AD5"];

const Savings = () => {
  const [saldoAwal, setSaldoAwal] = useState(0);
  const [inputSaldo, setInputSaldo] = useState("");
  const [weeklyData, setWeeklyData] = useState([]);

  // Ambil saldo awal dari localStorage
  useEffect(() => {
    const saveSaldo = localStorage.getItem("saldo");
    if (saveSaldo) {
      setSaldoAwal(JSON.parse(saveSaldo));
    }
  }, []);

  // Ambil records untuk grafik pengeluaran
  useEffect(() => {
    const records = JSON.parse(localStorage.getItem("records") || "[]");

    // Filter hanya pengeluaran
    const expenses = [];
    records.forEach((r) => {
      if (r.items) {
        r.items.forEach((item) => {
          if (item.jenis === "pengeluaran") {
            expenses.push({ date: r.date, amount: item.jumlah });
          }
        });
      }
    });

    // Group berdasarkan minggu
    const grouped = {};
    expenses.forEach((exp) => {
      const date = new Date(exp.date);
      const weekKey = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
      if (!grouped[weekKey]) {
        grouped[weekKey] = 0;
      }
      grouped[weekKey] += exp.amount;
    });

    // Ubah ke array untuk chart
    const chartData = Object.keys(grouped).map((week, idx) => ({
      name: week,
      value: grouped[week],
      color: COLORS[idx % COLORS.length],
    }));

    setWeeklyData(chartData);
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

  // Edit saldo
  const handleEditSaldo = () => {
    const editSaldo = parseFloat(inputSaldo);
    if (isNaN(editSaldo)) return;

    setSaldoAwal(editSaldo);
    localStorage.setItem("saldo", JSON.stringify(editSaldo));
    setInputSaldo("");
  };

  // Reset saldo
  const handleResetSaldo = () => {
    setSaldoAwal(0);
    localStorage.setItem("saldo", JSON.stringify(0));
    setInputSaldo("");
  };

  return (
    <Box p={4}>
      {/* Card Saldo */}
      <Box display="flex" justifyContent="center">
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

      {/* Grafik Pengeluaran Donut */}
      <Box mt={10} w="100%" h="300px">
        <Heading size="sm" mb={4}>
          Grafik Pengeluaran per Minggu
        </Heading>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={weeklyData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={50} // 🔹 jadi donut
              dataKey="value"
              label
            >
              {weeklyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default Savings;
