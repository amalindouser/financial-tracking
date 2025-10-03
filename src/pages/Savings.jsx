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

const Savings = () => {
  const [saldoAwal, setSaldoAwal] = useState(0);
  const [inputSaldo, setInputSaldo] = useState("");
  const [weeklyData, setWeeklyData] = useState([]);
  const [summary, setSummary] = useState({ pemasukan: 0, pengeluaran: 0 });

  // Ambil saldo awal dari localStorage
  useEffect(() => {
    const saveSaldo = localStorage.getItem("saldo");
    if (saveSaldo) {
      setSaldoAwal(JSON.parse(saveSaldo));
    }
  }, []);

  // Ambil records untuk grafik
  useEffect(() => {
    const records = JSON.parse(localStorage.getItem("records") || "[]");

    const sum = { pemasukan: 0, pengeluaran: 0 };

    records.forEach((r) => {
      if (r.items) {
        r.items.forEach((item) => {
          if (item.jenis === "pengeluaran") {
            sum.pengeluaran += item.jumlah;
          } else if (item.jenis === "pemasukan") {
            sum.pemasukan += item.jumlah;
          }
        });
      }
    });

    setSummary(sum);

    // data chart
    const chartData = [
      { name: "Pemasukan", value: sum.pemasukan, color: "#38A169" },
      { name: "Pengeluaran", value: sum.pengeluaran, color: "#E53E3E" },
    ];
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

  const totalTabungan = saldoAwal + summary.pemasukan - summary.pengeluaran;

  return (
    <Box p={4}>
      {/* Card Saldo Awal */}
      <Box display="flex" justifyContent="center" mb={6}>
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

      {/* Card Tabungan Bersih + Donut Chart */}
      <Flex gap={6} justify="center" flexWrap="wrap" mt={6}>
        {/* Card Tabungan Bersih */}
        <Card w="350px" shadow="lg" borderRadius="lg" bg="green.50">
          <CardHeader>
            <Heading size="md" color="green.700">
              Total Tabungan Bersih
            </Heading>
          </CardHeader>
          <CardBody>
            <Text fontSize="2xl" fontWeight="bold" color="green.600">
              Rp {totalTabungan.toLocaleString("id-ID")}
            </Text>
            <Text fontSize="sm" mt={2}>
              (Saldo Awal + Pemasukan − Pengeluaran)
            </Text>
            <Box mt={3}>
              <Text fontSize="sm" color="green.700">
                Pemasukan: Rp {summary.pemasukan.toLocaleString("id-ID")}
              </Text>
              <Text fontSize="sm" color="red.600">
                Pengeluaran: Rp {summary.pengeluaran.toLocaleString("id-ID")}
              </Text>
            </Box>
          </CardBody>
        </Card>

        {/* Donut Chart */}
        <Card w="400px" shadow="lg" borderRadius="lg">
          <CardHeader>
            <Heading size="md">Grafik Pemasukan vs Pengeluaran</Heading>
          </CardHeader>
          <CardBody>
            <Box w="100%" h="250px">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={weeklyData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={50}
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
          </CardBody>
        </Card>
      </Flex>
    </Box>
  );
};

export default Savings;
