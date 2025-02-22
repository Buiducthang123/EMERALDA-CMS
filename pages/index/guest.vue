<template>
  <div>
    <a-table :columns="columns" :data-source="dataUser ?? []" bordered class="w-full" childrenColumnName="mx-auto">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'name'">
          <div class="flex flex-col items-center gap-2">

            <NuxtImg loading="lazy" v-if="record.avatar" :src="record.avatar" class="w-10" />
            <NuxtImg v-else src="https://placehold.co/32x32" class="w-10" />
            <b>{{ record.name }}</b>
          </div>
        </template>

        <template v-if="column.dataIndex === 'status'">
          <div v-if="text == EAccountStatus.Active">
            <a-tag color="green">Hoạt động</a-tag>
          </div>
          <div v-else>
            <a-tag color="red">Tạm khóa</a-tag>
          </div>
        </template>
        <template v-if="column.dataIndex === 'birthday'">
          {{ formatDate(text) }}
        </template>

        <template v-if="column.dataIndex === 'created_at'">
          {{ formatDate(text) }}
        </template>

        <template v-if="column.dataIndex === 'action'">
          <div class="flex gap-2">
            <a-button type="primary"
              @click="()=>{userSelected=record as IUser; openModalUserDetails=true}">Xem</a-button>
            <a-button v-if="record.status==EAccountStatus.Blocked" @click="() => { userSelected = record as IUser; openModalBlockUser = true }"
              class="border border-green-500 text-green-500 ">
              Mở Khóa
            </a-button>
            <a-button v-else danger @click="()=>{userSelected=record as IUser; openModalBlockUser=true}">Khóa</a-button>
          </div>
        </template>
      </template>


      <template #title>
        <div class="flex justify-between">
          <h1 class="text-xl font-bold">Thông tin khách hàng</h1>
          <a-input-search style="width: 200px" placeholder="Search" />
        </div>
      </template>
    </a-table>

    <GuestsModalsProfile v-if="openModalUserDetails" :user="userSelected" :visible="openModalUserDetails"
      @update:visible="openModalUserDetails = $event" />
    <GuestsModalsBlock v-if="openModalBlockUser" :user="userSelected" :visible="openModalBlockUser" @refresh-user ="refreshUser"
      @update:visible="openModalBlockUser = $event" />
  </div>
</template>

<script lang="ts" setup>
import { EUserRole } from '~/enums/EUserRole';
import { EAccountStatus } from '~/enums/AccountStatus';
import type { IUser } from '~/interfaces/IUser';

const userSelected = ref<IUser>();
const openModalUserDetails = ref(false);
const openModalBlockUser = ref(false);
const columns:any = [
  {
    title: 'Tên khách hàng',
    dataIndex: 'name',
    align: 'center',
    key: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    align: 'center',
    key: 'email',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    align: 'center',
    key: 'address'
  },
  {
    title: 'Ngày sinh',
    dataIndex: 'birthday',
    align: 'center',
    key: 'birthday',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    align: 'center',
    key: 'status'
  },
  {
    title: 'Ngày đăng ký',
    dataIndex: 'created_at',
    align: 'center',
    key: 'created_at',
  },
  {
    title: 'Hành động',
    dataIndex: 'action',
    key: 'action',
    align: 'center',
  }
];

const authStore = useAuthStore();
const { accessToken } = authStore;
const { data: dataUser, refresh:refreshUser } = await useFetch<IUser[]>('api/users/all', {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
  baseURL: useRuntimeConfig().public.baseURL,
  query: {
    role: EUserRole.GUEST,
  },
  method: 'GET',
  immediate: true,
});

if (dataUser) {
  console.log(dataUser);
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
</script>

<style scoped>
th.column-money,
td.column-money {
  text-align: right !important;
}
</style>