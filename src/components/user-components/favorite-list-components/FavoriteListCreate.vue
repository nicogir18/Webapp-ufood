<template>
  <div class="rounded overflow-hidden shadow-lg ml-5 mr-5 mt-5">
    <form class="mt-2 mb-2 ml-2">
      <label class="text-primary-500 font-bold text-1xl mr-2" for="list-name"
        >List name :</label
      >
      <input
        id="list-name"
        type="text"
        v-model="listName"
        @input="checkInput()"
      />
      <button
        class="bg-blue-500 rounded-full text-white px-4 py-2 hover:bg-blue-600 ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
        @click.prevent="createList"
        :disabled="isInputEmpty()"
      >
        Ajouter
      </button>
    </form>
    <ProblemSnackbar
      :show="alert"
      v-on:update="alert = $event"
      :message="snackbarMessage"
    />
  </div>
</template>
<script>
import ProblemSnackbar from "@/components/utils/ProblemSnackbar.vue";
import { createFavoriteList } from "@/api/favorites.js";

export default {
  components: {
    ProblemSnackbar,
  },
  props: {
    email: {},
  },
  data() {
    return {
      listName: "",
      alert: false,
      snackbarMessage: "error",
    };
  },
  methods: {
    async createList() {
      const listName = this.listName;
      createFavoriteList({
        name: listName,
        owner: this.email,
      })
        .then((response) => {
          this.fetchFavorites();
          this.listName = "";
        })
        .catch((error) => {
          this.showSnackbar(
            "Problème avec la création de la liste, veuillez réessayer plus tard"
          );
        });
    },
    fetchFavorites() {
      this.$emit("fetchUserFavorites");
    },
    showSnackbar(message) {
      this.alert = true;
      this.snackbarMessage = message;
    },
    isInputEmpty() {
      return this.listName === null || this.listName.trim() === "";
    },
    checkInput() {
      this.listName = this.listName.trim();
    },
  },
};
</script>
