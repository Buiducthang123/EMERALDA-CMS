<template>
    <div>
      <a-button type="primary" @click="showModal">Open Modal</a-button>
      <a-modal v-model:open="open" title="Basic Modal" @ok="handleOk">
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </a-modal>
    </div>
  </template>
  <script lang="ts" setup>
  import { ref } from 'vue';
import type { IRoom } from '~/interfaces/IRoom';

  const props = defineProps<{
    room: IRoom;
    openModal: boolean;
  }>();
  
  const open = ref<boolean>(props.openModal);
  
  const showModal = () => {
    open.value = true;
  };
  
  const handleOk = (e: MouseEvent) => {
    console.log(e);
    open.value = false;
  };
  </script>
  
  