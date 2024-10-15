<template>
  <div class="bg-[#4267B2] h-screen flex flex-col">
    <header class="text-slate-200 flex-initial">
      <div class="flex p-4 ">
        <div class="flex-1 mr-4">
          <div class="p-4 rounded-xl bg-[#537ac9] mb-4">
            <Checkbox v-model="autoRefresh" binary inputId="auto-refresh" class="align-middle"
                      @change="autoRefreshChanged"/>
            <label for="auto-refresh" class="ml-2 mr-4">Auto Refresh</label>
            <InputNumber v-model="refreshInterval" showButtons :disabled="!autoRefresh"
                         @update:modelValue="refreshIntervalChanged"/>
          </div>
          <div class="p-4 rounded-xl bg-[#537ac9]">
            <Button @click="manualRefresh" :label="!fetching ? 'Refresh Deals' : fetchStatus.s" :disabled="fetching"
                    :icon="`pi ${fetching? 'pi-spin pi-spinner' : 'pi-refresh'}`" class="w-full"/>
          </div>
        </div>
        <div class="table flex-1 p-2 rounded-xl bg-[#537ac9]">
          <div class="table-row">
            <div class="table-cell">
              Maximum price:
            </div>
            <div class="table-cell pb-1">
              <InputNumber v-model="maxPrice" showButtons/>
            </div>
            <div class="table-cell">
              Fetch Mode:
            </div>
            <div class="table-cell pb-1">
              <Dropdown v-model="fetchMode" :options="fetchModes" option-label="name"/>
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell">
              Category:
            </div>
            <div class="table-cell pb-1">
              <Dropdown v-model="category" :options="categories" option-label="name"/>
            </div>
            <div class="table-cell">
              Sort:
            </div>
            <div class="table-cell pb-1">
              <Dropdown v-model="sortMode" :options="sortModes" option-label="name"/>
            </div>
          </div>
          <div class="table-row">
            <div class="table-cell">
              Region:
            </div>
            <div class="table-cell pb-1">
              <Dropdown v-model="region" :options="regions" option-label="name"/>
            </div>
            <div class="table-cell">
              Save Mode:
            </div>
            <div class="table-cell pb-1">
              <Dropdown v-model="saveMode" :options="saveModes" option-label="name"/>
            </div>
          </div>
        </div>
      </div>
      <div class="mx-4 h-1 rounded-full bg-zinc-600"/>
    </header>
    <Body :deals="deals.filter(deal => deal.price <= maxPrice)" ref="body"/>
  </div>
</template>

<script>
import Checkbox from 'primevue/checkbox';
import InputNumber from 'primevue/inputnumber';
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import Body from './components/Body.vue'
import { categories } from "@/services/categories";
import { regions } from "@/services/regions";
import { fetchModes } from "@/services/fetchModes";
import { filterRegions } from "@/services/filterRegions";
import { sortModes } from "@/services/sortModes";
import { saveModes } from "@/services/saveModes";
import { fetchDeals } from "@/services/dealFetcher";

export default {
  data() {
    return {
      timer: null,
      autoRefresh: true,
      refreshInterval: 300,
      fetching: false,
      fetchStatus: { s: "" },
      maxPrice: 6000,
      category: categories[1],
      categories: categories,
      region: regions[0],
      regions: regions,
      fetchMode: fetchModes[2],
      fetchModes: fetchModes,
      sortMode: sortModes[1],
      sortModes: sortModes,
      saveMode: saveModes[0],
      saveModes: saveModes,
      deals: [],
    }
  },
  created() {
    this.manualRefresh()
  },
  methods: {
    manualRefresh() {
      if (this.autoRefresh) {
        clearInterval(this.timer);
        this.timer = this.createInterval();
      }
      if (!this.fetching) {
        this.fetchDealsWithRetries();
      }
    },
    createInterval() {
      return setInterval(this.fetchDealsWithRetries, this.refreshInterval * 1000);
    },
    async fetchDealsWithRetries() {
      let success = false
      while (!success) {
        try {
          await this.fetchDeals()
          success = true
        } catch (e) {
          console.error(e.message)
          console.error(e.stack)
          console.log("Retrying after 1 second")
          this.fetchStatus.s = "An error occurred. Retrying..."
          // Wait 1 second
          await new Promise(r => setTimeout(r, 1000));
        }
      }
    },
    async fetchDeals() {
      this.fetching = true;

      const oldDeals = this.deals;
      const _newDeals = await fetchDeals(this.category, this.region, this.fetchMode, 3, this.fetchStatus)
      if (!_newDeals) {
        throw new Error("An error was encountered")
      }
      const newDeals = filterRegions(_newDeals);
      console.log(`Found ${_newDeals.length} deals, filtered out ${_newDeals.length - newDeals.length} deals`)

      newDeals.filter((deal) => {
        for (const d of oldDeals) {
          if (d.link === deal.link) {
            return false
          }
        }
        return true
      }).forEach((deal) => deal.isNew = true)
      let modifiedDeals = this.saveMode.modify(oldDeals, newDeals);
      modifiedDeals = this.sortMode.sort(modifiedDeals);

      this.deals = modifiedDeals
      this.$refs.body && this.$refs.body.scrollToTop()
      console.log(`Fetched ${this.deals.length} deals`)

      this.fetching = false;
    },
    refreshIntervalChanged() {
      if (this.autoRefresh) {
        this.manualRefresh()
      }
    },
    autoRefreshChanged() {
      if (this.autoRefresh) {
        this.timer = this.createInterval();
        if (!this.fetching) {
          this.fetchDeals();
        }
      } else {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  },
  watch: {
    sortMode(value) {
      this.deals = value.sort(this.deals)
    },
  },
  components: {
    Checkbox,
    InputNumber,
    Button,
    Dropdown,
    Body,
  },
};
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
