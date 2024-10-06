<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Quản Lý Phòng</h1>
      <a-button type="primary" @click="openModalCreate=true">Thêm Phòng</a-button>
    </div>

    <a-table :columns="columns" :data-source="roomData?.data || []" bordered class="w-full" childrenColumnName="mx-auto"
      :pagination="false">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'room_type'">
          <span>{{ record.room_type.name }}</span>
        </template>

        <template v-if="column.dataIndex === 'status'">
          <a-tag v-if="text==ERoomStatus.AVAILABLE" color="green">{{ RoomStatusText[text] }}</a-tag>
          <a-tag v-else-if="text==ERoomStatus.BOOKED" color="red">{{ RoomStatusText[text] }}</a-tag>
          <a-tag v-else-if="text==ERoomStatus.MAINTENANCE" color="yellow">{{ RoomStatusText[text] }}</a-tag>
        </template>

        <template v-if="column.dataIndex === 'actions'">
          <div class="space-x-2 w-fit">
            <a-button type="primary" @click="()=>{
                  roomSelected = record;
                  openModalUpdate = true;
                  console.log(roomSelected);
                }">Sửa</a-button>
            <a-button danger @click="()=>{openModalDelete=true; roomSelected=record}">Xóa</a-button>
          </div>
        </template>
      </template>

      <template #title>
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <h1 class="text-base font-bold">Thông tin phòng </h1>
            <a-tooltip>
              <template #title>làm mới</template>
              <span class="inline-block h-5 cursor-pointer" @click="handleResetFilter()">
                <Icon name="i-ri-refresh-line" size="20px" />
              </span>
            </a-tooltip>
          </div>
          <div class="flex space-x-2">
            <a-select v-model:value="filter.room_type" placeholder="Loại phòng" style="width: 200px"
              @change="fetchRoomData">
              <a-select-option value="">Tất cả</a-select-option>
              <a-select-option v-for="(type, index) in roomType" :key="type.id" :value="type.id">{{ type.name
                }}</a-select-option>
            </a-select>
            <a-select v-model:value="filter.status" placeholder="Trạng thái" style="width: 150px"
              @change="fetchRoomData">
              <a-select-option value="">Tất cả</a-select-option>
              <a-select-option :value="ERoomStatus.AVAILABLE">{{ RoomStatusText[ERoomStatus.AVAILABLE]
                }}</a-select-option>
              <a-select-option :value="ERoomStatus.BOOKED">{{ RoomStatusText[ERoomStatus.BOOKED] }}</a-select-option>
              <a-select-option :value="ERoomStatus.MAINTENANCE">{{ RoomStatusText[ERoomStatus.MAINTENANCE]
                }}</a-select-option>
            </a-select>
            <a-input-search v-model:value="filter.room_number" placeholder="Tìm kiếm tên phòng" enter-button class="w-60" />
          </div>
        </div>
      </template>
    </a-table>
    <div class="text-end mt-4">
      <a-pagination v-model:current="filter.page" :page-size="roomData?.per_page" :total="roomData?.total"
        show-less-items />
    </div>
    <rooms-modal-edit v-show="openModalUpdate" :room="roomSelected||undefined" :open="openModalUpdate"
      @handle-cancel="openModalUpdate=false" @refresh-room="refreshRoom" />

    <rooms-modal-create :open="openModalCreate" @handle-cancel="openModalCreate=false"
      @refresh-room="refreshRoom" />

    <rooms-modal-delete :room="roomSelected" :open="openModalDelete" @handle-cancel="openModalDelete=false"
      @refresh-room="refreshRoom" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '#imports';
import type { IRoom } from '~/interfaces/IRoom';
import { RoomStatusText, ERoomStatus } from '~/enums/ERoomStatus';
import type { PaginationResponse } from '~/interfaces/IPaginationResponse';
import type { IRoomType } from '~/interfaces/IRoomType';

const openModalUpdate = ref(false);
const openModalCreate = ref(false);
const openModalDelete = ref(false);
const authStore = useAuthStore();
const { accessToken } = authStore;
const columns = ref([
  { 
    title: 'Tên phòng', 
    dataIndex: 'room_number', key: 'room_number' 
  },
  { 
    title: 'Loại phòng', 
    dataIndex: 'room_type', key: 'room_type' 
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
  },
  { 
    title: 'Hành Động', 
    key: 'actions',
    dataIndex: 'actions',
  },
]);

const filter = reactive({
  room_number: '',
  room_type: '',
  status: '',
  price: '',
  page: 1,
});

const { data: roomData, refresh: refreshRoom } = await useFetch<PaginationResponse<IRoom[]>>('/api/rooms', {
  method: 'GET',
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  query: filter,
});

const roomSelected = ref<IRoom | any>();

function fetchRoomData() {
  refreshRoom();
}

const handleResetFilter = () => {
  filter.room_number = '';
  filter.room_type = '';
  filter.status = '';
  filter.price = '';
}

const { data: roomType } = await useFetch<IRoomType[] | null>('/api/room-types', {
  method: 'GET',
  baseURL: useRuntimeConfig().public.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

</script>

<style scoped>
/* Thêm style nếu cần */
</style>