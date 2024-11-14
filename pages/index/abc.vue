<template>
  <div>
    <button @click="exportToExcel">Xuất Excel</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const data = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
]);

const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(data.value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, 'output.xlsx');
};
</script>