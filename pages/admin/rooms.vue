<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Quản Lý Phòng</h1>
      <a-button type="primary" @click="">Thêm Phòng</a-button>
    </div>
    
    <a-table :columns="columns" :data-source="roomData??[]" bordered class="w-full" childrenColumnName="mx-auto" :pagination="false">
        <template #bodyCell="{ column, text, record   }">

            <template v-if="column.dataIndex === 'room_type'">
                <span>{{ record.room_type.name }}</span>
            </template>

            <template v-if="column.dataIndex === 'status'">
              
                <a-tag v-if="text==ERoomStatus.AVAILABLE" color="green">{{ RoomStatusText[text] }}</a-tag>
                <a-tag v-if="text==ERoomStatus.BOOKED" color="red">{{ RoomStatusText[text] }}</a-tag>
                <a-tag v-if="text==ERoomStatus.MAINTENANCE" color="yellow">{{ RoomStatusText[text] }}</a-tag>
            </template>

            <template v-if="column.dataIndex === 'actions'">
              <div class="space-x-2 w-fit">
                <a-button type="primary" @click="">Sửa</a-button>
                <a-button danger @click="">Xóa</a-button> 
              </div>
          </template>
        </template>

        <template #title>
          <div class="flex justify-between">
            <h1 class="text-base font-bold">Thông tin phòng</h1>
            <a-input-search  v-model:value="room_number_val" style="width: 200px" placeholder="Tìm kiếm" @search = "filter.room_number=room_number_val"/>
          </div>
        </template>
      </a-table>

      <rooms-modal-edit :room="roomSelected" :open="openModalUpdate"/>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useAuthStore } from '#imports';
import type { IRoom } from '~/interfaces/IRoom';
import { RoomStatusText, ERoomStatus } from '~/enums/ERoomStatus';

const openModalUpdate = ref(true);
const authStore = useAuthStore();
const {accessToken} = authStore;
const columns = ref([
  { 
    title: 'Tên phòng', 
    dataIndex: 'room_number', key: 'room_number' 
  },

  { 
    title: 'Loại phòng', 
    dataIndex: 'room_type', key: 'room_type' },

  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Giá',
    dataIndex: 'price',
    key: 'price',
  },
  { 
    title: 'Hành Động', 
    key: 'actions',
    dataIndex: 'actions',
    
  },
]);
const room_number_val = ref('');

const filter = reactive({
  room_number: '',
  room_type: '',
  status: '',
  price: '',
});

const {data: roomData} = await useFetch<IRoom[]>('/api/rooms',{
  method: 'GET',
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  query: filter,
})


const roomSelected = ref<IRoom|null>(roomData?.value?.[0] || null);

</script>

<style scoped>
/* Thêm style nếu cần */
</style>