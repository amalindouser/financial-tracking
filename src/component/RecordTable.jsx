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
    jumlah: 0,
  });

  // Detail modal
  const handleDetail = (item) => {
    setSelectedItem(item);
    setMode("detail");
    onOpen();
  };

  // Edit modal
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

  // Simpan hasil edit
  const handleSaveEdit = () => {
    setItems(
      items.map((item) =>
        item.id === selectedItem.id ? { ...item, ...editValues } : item
      )
    );
    onClose();
  };

  // Hapus record
  const handleDelete = (item) => {
    setItems((prev) => prev.filter((it) => it.id !== item.id));
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
          {items
          .filter((item) => item.keperluang || item.keterangan || item.jumlah)
          .map((item) => (
            <Tr key={item.id}>
              <Td>{item.keperluan}</Td>
              <Td>{item.jenis}</Td>
              <Td>{item.keterangan}</Td>
              <Td isNumeric>Rp{Number(item.jumlah || 0).toLocaleString()}</Td>
              <Td>
                <Button
                  size="sm"
                  colorScheme="blue"
                  mr={2}
                  onClick={() => handleDetail(item)}
                >
                  Detail
                </Button>
                <Button
                  size="sm"
                  colorScheme="yellow"
                  mr={2}
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete(item)}
                >
                  Hapus
                </Button>
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
            <ModalHeader>
              {mode === "detail" ? "Detail Catatan" : "Edit Catatan"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {mode === "detail" ? (
                <>
                  <Text>
                    <b>Jenis Keperluan:</b> {selectedItem.keperluan}
                  </Text>
                  <Text>
                    <b>Jenis:</b> {selectedItem.jenis}
                  </Text>
                  <Text>
                    <b>Keterangan:</b> {selectedItem.keterangan}
                  </Text>
                  <Text>
                    <b>Jumlah:</b> Rp
                    {Number(selectedItem.jumlah || 0).toLocaleString()}
                  </Text>
                </>
              ) : (
                <>
                  <Input
                    mb={3}
                    placeholder="Jenis Keperluan"
                    value={editValues.keperluan}
                    onChange={(e) =>
                      setEditValues({ ...editValues, keperluan: e.target.value })
                    }
                  />
                  <Select
                    mb={3}
                    value={editValues.jenis}
                    onChange={(e) =>
                      setEditValues({ ...editValues, jenis: e.target.value })
                    }
                  >
                    <option value="pemasukan">Pemasukan</option>
                    <option value="pengeluaran">Pengeluaran</option>
                  </Select>
                  <Input
                    mb={3}
                    placeholder="Keterangan"
                    value={editValues.keterangan}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        keterangan: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Jumlah"
                    value={editValues.jumlah}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        jumlah: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </>
              )}
            </ModalBody>
            {mode === "edit" && (
              <ModalFooter>
                <Button colorScheme="teal" mr={3} onClick={handleSaveEdit}>
                  Simpan
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  Batal
                </Button>
              </ModalFooter>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default RecordTable;
