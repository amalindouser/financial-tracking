// RecordTable.jsx
import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Text,
  Input,
  Select,
} from "@chakra-ui/react";

const RecordTable = ({ items = [], setItems }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState(null);
  const [mode, setMode] = useState("detail");
  const [editValues, setEditValues] = useState({
    keperluan: "",
    jenis: "pemasukan",
    keterangan: "",
    jumlah: "",
  });

  // Tampilkan detail modal
  const handleDetail = (item) => {
    setSelectedItem(item);
    setMode("detail");
    onOpen();
  };

  // Tampilkan edit modal
  const handleEdit = (item) => {
    setSelectedItem(item);
    setMode("edit");
    setEditValues({
      keperluan: item.keperluan,
      jenis: item.jenis,
      keterangan: item.keterangan,
      jumlah: item.jumlah,
    });
    onOpen();
  };

  // Simpan hasil edit ke backend dan update frontend
  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/records/${selectedItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editValues, date: selectedItem.date }),
      });
      const data = await res.json();
      if (data.updated) {
        // update frontend
        setItems(items.map(item =>
          item.id === selectedItem.id ? { ...item, ...editValues } : item
        ));
        onClose();
      }
    } catch (err) {
      console.error("Gagal update:", err);
    }
  };

  // Hapus record
  // Hapus record
const handleDelete = async (item) => {
  try {
    const token = localStorage.getItem("token");

    // Hapus record
    const res = await fetch(`http://localhost:5000/api/records/${item.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // ✅ pakai token
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Gagal menghapus data");
    }

    const data = await res.json();
    if (!data.deleted) {
      throw new Error("Record tidak terhapus");
    }

    // Update frontend (hapus dari state)
    setItems((prev) => prev.filter((it) => it.id !== item.id));

    // Ambil saldo saat ini
    const saldoRes = await fetch("http://localhost:5000/api/savings", {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ pakai token juga
      },
    });

    if (!saldoRes.ok) {
      const text = await saldoRes.text();
      throw new Error(text || "Gagal ambil saldo");
    }

    const saldoData = await saldoRes.json();
    let saldoBaru = saldoData.amount;

    // Sesuaikan saldo
    if (item.jenis === "pemasukan") {
      saldoBaru -= item.jumlah;
    } else if (item.jenis === "pengeluaran") {
      saldoBaru += item.jumlah;
    }

    // Update saldo di backend
    await fetch("http://localhost:5000/api/savings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ jangan lupa token
      },
      body: JSON.stringify({ amount: saldoBaru }),
    });

  } catch (err) {
    console.error("Gagal menghapus data:", err.message);
  }
};



  return (
    <>
      <Table variant="simple" size="sm">
        <Thead bg="gray.100">
          <Tr>
            <Th>Jenis Keperluan</Th>
            <Th>Jenis</Th>
            <Th>Keterangan</Th>
            <Th isNumeric>Jumlah</Th>
            <Th>Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item) => (
            <Tr key={item.id}>
              <Td>{item.keperluan}</Td>
              <Td>{item.jenis}</Td>
              <Td>{item.keterangan}</Td>
              <Td isNumeric>Rp{item.jumlah.toLocaleString()}</Td>
              <Td>
                <Button size="sm" colorScheme="blue" mr={2} onClick={() => handleDetail(item)}>Detail</Button>
                <Button size="sm" colorScheme="yellow" mr={2} onClick={() => handleEdit(item)}>Edit</Button>
                <Button size="sm" colorScheme="red" onClick={() => handleDelete(item)}>Hapus</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Modal Detail / Edit */}
      {selectedItem && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{mode === "detail" ? "Detail Catatan" : "Edit Catatan"}</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {mode === "detail" ? (
                <>
                  <Text><b>Jenis Keperluan:</b> {selectedItem.keperluan}</Text>
                  <Text><b>Jenis:</b> {selectedItem.jenis}</Text>
                  <Text><b>Keterangan:</b> {selectedItem.keterangan}</Text>
                  <Text><b>Jumlah:</b> Rp{selectedItem.jumlah.toLocaleString()}</Text>
                </>
              ) : (
                <>
                  <Input
                    mb={3}
                    placeholder="Jenis Keperluan"
                    value={editValues.keperluan}
                    onChange={(e) => setEditValues({ ...editValues, keperluan: e.target.value })}
                  />
                  <Select
                    mb={3}
                    value={editValues.jenis}
                    onChange={(e) => setEditValues({ ...editValues, jenis: e.target.value })}
                  >
                    <option value="pemasukan">Pemasukan</option>
                    <option value="pengeluaran">Pengeluaran</option>
                  </Select>
                  <Input
                    mb={3}
                    placeholder="Keterangan"
                    value={editValues.keterangan}
                    onChange={(e) => setEditValues({ ...editValues, keterangan: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Jumlah"
                    value={editValues.jumlah}
                    onChange={(e) => setEditValues({ ...editValues, jumlah: parseFloat(e.target.value) || 0 })}
                  />
                </>
              )}
            </ModalBody>
            {mode === "edit" && (
              <ModalFooter>
                <Button colorScheme="teal" mr={3} onClick={handleSaveEdit}>Simpan</Button>
                <Button variant="ghost" onClick={onClose}>Batal</Button>
              </ModalFooter>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default RecordTable;
