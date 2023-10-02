<template>
  <nav
    class="tailwind-menu z-50 sticky top-0 w-full p-4 bg-white shadow lg:shadow-none"
  >
    <div
      class="flex flex-wrap items-center justify-evenly container mx-auto px-4 flex-row"
    >
      <div class="flex flex-shrink-0">
        <router-link to="/">
          <button class="flex items-center text-primary-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-10 h-10 hover:fill-black"
            >
              <path
                d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z"
              />
              <path
                d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z"
              />
            </svg>
          </button>
        </router-link>
      </div>
      <SearchBar />
      <div class="flex flex-row items-center" id="contUser">
        <div class="flex-col lg:flex-row list-none margin-right px-4">
          <span v-if="!isLoggedIn">
            <router-link to="/login"><v-btn>Login</v-btn></router-link>
          </span>
          <span v-else>
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn color="secondary" v-bind="props">
                  {{ user.name }}
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in items"
                  :key="index"
                  :value="index"
                  :to="item.link"
                  active-color="primary"
                  variant="plain"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </span>
        </div>
        <div class="avatar">
          <Gravatar />
        </div>
      </div>
    </div>
  </nav>
</template>

<style></style>

<script>
import { Menu } from "@headlessui/vue";
import SearchBar from "./navigation-components/SearchBar.vue";
import Gravatar from "@/components/utils/Gravatar.vue";

export default {
  name: "navbar",
  data() {
    return {
      user: this.$store.getters.StateUser,
      items: [
        { title: "Profil", link: "/user" },
        { title: "Logout", link: "/logout" },
      ],
    };
  },
  computed: {
    isLoggedIn: function () {
      return this.$store.getters.isAuthenticated;
    },
  },
  components: {
    // eslint-disable-next-line
    Menu,
    SearchBar,
    Gravatar,
  },
};
</script>

<style scoped>
@media (max-width: 760px) {
  #contUser {
    margin-top: 5%;
  }
  .avatar {
    position: relative;
    width: 4rem;
    height: 4rem;
    overflow: hidden;
    background-color: #f7fafc;
    border-radius: 9999px;
    border: 2px solid #6875f5;
    display: flex;
    align-items: baseline;
    justify-content: center;
    display: none;
  }
}
@media (min-width: 761px) {
  .avatar {
    position: relative;
    width: 4rem;
    height: 4rem;
    overflow: hidden;
    background-color: #f7fafc;
    border-radius: 9999px;
    border: 2px solid #6875f5;
    display: flex;
    align-items: baseline;
    justify-content: center;
    display: block;
  }
}
</style>
