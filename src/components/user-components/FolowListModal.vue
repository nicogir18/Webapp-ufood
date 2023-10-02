<template>
  <v-dialog>
    <v-card class="mx-auto my-auto max-h-80">
      <v-card-title v-if="mode === 'followers'" class="text-blue-500" id="name"
        >Followers</v-card-title
      >
      <v-card-title v-if="mode === 'following'" class="text-blue-500" id="name"
        >Following</v-card-title
      >

      <div class="card__body">
        <ul>
          <div
            v-for="user in users"
            :key="user.id"
            class="flex items-start py-1 justify-between align-center"
          >
            <div class="m-2">
              <h3 class="text-base font-semibold">{{ user.name }}</h3>
              <p class="text-gray-600">{{ user.email }}</p>
            </div>
          </div>
        </ul>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    users: Array,
    mode: {
      type: String,
      required: true,
      validator: (value) => {
        return ["followers", "following"].indexOf(value) !== -1;
      },
    },
    userMode: {
      type: String,
      default: "modify",
    },
  },

  data() {
    return {
      alert: false,
      snackbarMessage: "",
    };
  },
  methods: {
    closeModal() {
      this.$emit("closeFollowModal");
    },
  },
};
</script>
