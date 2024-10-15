<template>
  <div class="p-4 text-slate-200 overflow-auto h-auto flex flex-col flex-auto" ref="container">
    <span id="top" class="hidden"></span>
    <div class="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-8 p-4 rounded-xl bg-[#537ac9]">
      <div v-for="(deal, i) in deals" key="i" class="">
        <DealCard :deal="deal" :key="deal.title + deal.description"/>
      </div>
      <div v-if="!deals || !deals.length" class="text-gray-400">
        Deals will show up here.
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Deal } from "../services/deal";
import { PropType } from "vue";
import DealCard from "./DealCard.vue";

export default {
  name: 'Body',
  props: {
    deals: { type: Object as PropType<Deal[]> },
  },
  data() {
    return {}
  },
  methods: {
    scrollToTop() {
      (this.$refs.container as any).scrollTop = 0
    }
  },
  components: { DealCard },
};
</script>

<style>
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.9);
  border-radius: 10px;
  background-color: #444444;
}

::-webkit-scrollbar {
  width: 10px;
  border-radius: 10px;
  background-color: #000000;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
  background-color: #555;
}
</style>
