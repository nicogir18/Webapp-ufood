<template>
  <div class="w-1/2">
    <label class="relative block w-full mx-5">
      <span class="sr-only">Search</span>
      <span class="absolute inset-y-0 left-0 flex items-center pl-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </span>
      <input
        class="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
        placeholder="Search ..."
        ref="searchInput"
        type="text"
        name="search"
        @input="search"
      />
    </label>
    <div v-if="searchTerm" class="search-results">
      <p class="text-xs text-slate-400 mx-5 my-2">
        {{ filteredRestaurants.length + filteredUsers.length }} résultats pour
        "{{ searchTerm }}"
      </p>
      <p class="text-xs text-slate-400 mx-5 my-2">Restaurants</p>
      <ul class="divide-y divide-slate-300">
        <li
          v-for="r in filteredRestaurants"
          :key="r.id"
          class="px-5 py-3 hover:bg-sky-50"
        >
          <router-link
            :to="{ path: '/restaurant', query: { id: r.id } }"
            @click="resetSearch"
          >
            <p class="font-medium text-slate-900">{{ r.name }}</p>
            <p class="text-xs text-slate-400">{{ r.description }}</p>
          </router-link>
        </li>
      </ul>
      <p class="text-xs text-slate-400 mx-5 my-2">Utilisateurs</p>
      <ul class="divide-y divide-slate-300">
        <li
          v-for="u in filteredUsers"
          :key="u.id"
          class="px-5 py-3 hover:bg-sky-50"
        >
          <router-link
            :to="{ path: '/user', query: { id: u.id, userMode: 'read-only' } }"
            @click="resetSearch"
          >
            <p class="font-medium text-slate-900">{{ u.name }}</p>
            <p class="text-xs text-slate-400">{{ u.description }}</p>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { getRestaurants } from "@/api/restaurants";
import { getUsers } from "@/api/users";

export default {
  data() {
    return {
      allRestaurants: [],
      filteredRestaurants: [],
      totalRestaurants: 0,
      allUsers: [],
      filteredUsers: [],
      totalUsers: 0,
      searchTerm: "",
    };
  },
  async mounted() {
    getRestaurants().then((res) => {
      this.allRestaurants = res.data.items;
      this.filteredRestaurants = res.data.items;

      this.totalRestaurants = res.data.total;
    });
    getUsers().then((res) => {
      this.allUsers = res.data.items;
      this.filteredUsers = res.data.items;

      this.totalUsers = res.data.total;
    });
  },
  methods: {
    search(event) {
      const searchTerm = event.target.value.toLowerCase();

      const filteredRestaurants = this.allRestaurants.filter((r) =>
        r.name.toLowerCase().includes(searchTerm)
      );
      const filteredUsers = this.allUsers.filter((u) =>
        u.name.toLowerCase().includes(searchTerm)
      );

      this.filteredRestaurants = filteredRestaurants;
      this.filteredUsers = filteredUsers;
      this.searchTerm = searchTerm;
    },
    resetSearch() {
      this.filteredRestaurants = this.allRestaurants;
      this.filteredUsers = this.allUsers;
      this.searchTerm = "";
      this.$refs.searchInput.value = "";
    },
  },
};
</script>
<style scoped>
.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 999;
  background-color: #fff;
  border: 1px solid #ccc;
  border-top: none;
  max-height: 300px;
  overflow-y: auto;
}
</style>
