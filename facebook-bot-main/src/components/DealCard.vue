<template>
  <Card class="bg-[#5c8ced] hover:bg-[#6d9bf7] transition-colors text-slate-200 flex-grow h-full" v-if="deal"
        @mouseenter="deal.isNew = false">
    <template #header>
      <a :href="deal.link" target="_blank">
        <img :src="deal.imageLink" alt="Image not available" class="object-cover h-60 rounded-md">
      </a>
    </template>
    <template #title>
      <div class="truncate">
        <span v-if="deal.isNew" class="bg-emerald-400 rounded-full text-sm p-1 mr-1">New!</span>
        <span v-if="deal.price !== -1" class="text-green-300 text-lg">${{ deal.price }}&nbsp;</span>
        <a :href="deal.link" target=”_blank” class="text-lg">{{ deal.title }}</a>
      </div>
    </template>
    <template #subtitle>
      <span class="text-slate-300">
        {{ deal.location }}
      </span>
    </template>
    <template #content>
      Category: {{ deal.category.name }}
    </template>
  </Card>
</template>

<script lang="ts">
import { PropType } from "vue";
import { Deal } from "../services/deal";
import Card from "primevue/card";

export default {
  name: "DealCard",
  props: {
    deal: { type: Object as PropType<Deal> },
  },
  computed: {
    description() {
      const t = this.deal?.description
      if (!t || t.length < 100) {
        return t
      }
      return t.substring(0, 98) + "..."
    }
  },
  components: {
    Card
  },
}
</script>

<style scoped>

</style>
