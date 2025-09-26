import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";

const AddRecordModal = ({ onAdd, onAddRecord }) => {
  // Modal untuk Catatan Harian
  const {
    isOpen: isNoteOpen,
    onOpen: onNoteOpen,
    onClose: onNoteClose,
  } = useDisclosure();

  // Modal untuk Record Nama & Warna
  const {
    isOpen: isRecordOpen,
    onOpen: onRecordOpen,
    onClose: onRecordClose,
  } = useDisclosure();

  // State untuk Catatan
  const [date, setDate] = useState("");

  // State untuk Record
  const [nama, setNama] = useState("");
  const [warna, setWarna] = useState("");

  // Simpan Catatan
  const handleSubmitNote = () => {
    if (!date) return;
    const newRecord = {
      id: Date.now(),
      date,
    };
    onAdd(newRecord);
    setDate("");
    onNoteClose();
  };

  // Simpan Record Nama & Warna
  const handleSaveRecord = () => {
    if (!nama || !warna) return;
    onAddRecord({ id: Date.now(), nama, warna });
    setNama("");
    setWarna("");
    onRecordClose();
  };

  return (
    <>
      {/* Tombol di sebelah-sebelah */}
      <HStack spacing={4} mb={4}>
        <Button colorScheme="teal" onClick={onNoteOpen}>
          + Tambah Catatan Harian
        </Button>
      </HStack>

      {/* Modal Catatan Harian */}
      <Modal isOpen={isNoteOpen} onClose={onNoteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pilih Tanggal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Tanggal</FormLabel>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onNoteClose}>
              Batal
            </Button>
            <Button colorScheme="teal" onClick={handleSubmitNote}>
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Record Nama & Warna */}
      <Modal isOpen={isRecordOpen} onClose={onRecordClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tambah Record</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>Nama</FormLabel>
              <Input
                placeholder="Masukkan nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Warna</FormLabel>
              <Select
                placeholder="Pilih warna"
                value={warna}
                onChange={(e) => setWarna(e.target.value)}
              >
                <option value="Merah">Merah</option>
                <option value="Biru">Biru</option>
                <option value="Hijau">Hijau</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onRecordClose}>
              Batal
            </Button>
            <Button colorScheme="blue" onClick={handleSaveRecord}>
              Simpan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddRecordModal;
