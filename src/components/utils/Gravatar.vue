<template>
  <img :src="gravatar" alt="Gravatar Photo" />
</template>

<script>
import md5 from "md5";
import { getUsersById } from "@/api/users.js";

export default {
  props: {
    id: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      email: "",
      user: this.$store.getters.StateUser,
    };
  },

  methods: {
    fetchUserEmail() {
      getUsersById(typeof this.id !== "undefined" ? this.id : this.user.id)
        .then((response) => {
          this.email = response.data.email;
        })
        .catch((error) => {
          this.alert = true;
        });
    },
  },
  computed: {
    gravatar() {
      this.fetchUserEmail();
      const hash = md5(this.email.trim().toLowerCase());
      return `https://www.gravatar.com/avatar/${hash}?d=robohash&s=200`;
    },
  },
};
</script>
