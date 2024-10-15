import 'primevue/resources/themes/lara-light-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import PrimeVue from 'primevue/config';

// Create a new store instance.
const store = createStore({
  state() {
    return {
      autoRefresh: true,
      autoRefreshFrequency: 300,
      allDeals: [],
      filters: {
        minPrice: 0,
        maxPrice: null,
        category: 'All',
        sortBy: 'Date Posted',
      },
      searchSettings: {
        region: 'Kitchener Area',
        pages: 3
      },
    }
  },
  mutations: {},
  actions: {},
})


createApp(App)
  .use(store)
  .use(PrimeVue, { ripple: true })
  .mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
