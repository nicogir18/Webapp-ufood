<template>
  <v-dialog>
    <v-card class="mx-auto">
      <v-card-title class="text-blue-500" id="name">{{ title }}</v-card-title>

      <v-card-title v-if="mode === 'modify'" class="text-blue-500" id="intro"
        >Tell us, how was your diner?</v-card-title
      >
      <v-card-title v-if="mode === 'read-only'" class="text-blue-500" id="intro"
        >How was your diner?</v-card-title
      >

      <v-container class="spacing-playground pa-10" fluid>
        <v-card-title>When did you go?</v-card-title>
        <datePicker
          v-if="mode === 'modify'"
          v-on:chosenDate="setDate"
        ></datePicker>
        <v-textarea
          v-if="mode === 'read-only'"
          :value="date_value"
          readonly
          rows="1"
          variant="solo"
        ></v-textarea>
      </v-container>

      <v-container class="spacing-playground pa-10" fluid>
        <v-card-title>How was your experience?</v-card-title>
        <div id="starRating">
          <star-rating
            v-if="mode === 'modify'"
            @update:rating="setRating"
            :read-only="false"
            :show-rating="false"
            :increment="0.01"
          ></star-rating>
          <star-rating
            v-if="mode === 'read-only'"
            :rating="rating_value"
            :read-only="true"
            :show-rating="false"
            :increment="0.01"
          ></star-rating>
        </div>
      </v-container>

      <v-container class="spacing-playground pa-10" fluid>
        <v-card-title v-if="mode === 'modify'">Write your review</v-card-title>
        <v-card-title v-if="mode === 'read-only'">Your Comment</v-card-title>
        <v-textarea
          v-if="mode === 'modify'"
          counter
          v-model="comment"
          :rules="commentRules"
          label="Comment"
          variant="solo"
          class="pa-md-4 mx-lg-auto"
        ></v-textarea>
        <v-textarea
          v-if="mode === 'read-only'"
          :value="comment_value"
          variant="solo"
          class="pa-md-4 mx-lg-auto"
          readonly
        ></v-textarea>
      </v-container>

      <v-card-actions v-if="mode === 'modify'">
        <v-btn
          class="text-red-500"
          size="x-large"
          variant="plain"
          @click="closeModal"
          >Cancel</v-btn
        >
        <v-btn
          class="text-green-500"
          :disabled="!date || !comment"
          size="x-large"
          variant="plain"
          @click="submit"
          >Submit</v-btn
        >
      </v-card-actions>
      <v-card-actions v-if="mode === 'read-only'">
        <v-btn
          class="text-red-500"
          size="x-large"
          variant="plain"
          @click="closeModal"
          >Close</v-btn
        >
      </v-card-actions>
    </v-card>
    <ProblemSnackbar
      :show="alert"
      v-on:update="alert = $event"
      :message="snackbarMessage"
    />
  </v-dialog>
</template>

<script>
import datePicker from "./DatePicker.vue";
import StarRating from "vue-star-rating";
import ProblemSnackbar from "@/components/utils/ProblemSnackbar.vue";
import { addVisitByUserId } from "@/api/visits.js";

export default {
  data() {
    return {
      form: false,
      date: null,
      rating: 0,
      comment: "",
      commentRules: [
        (value) => {
          if (!value) {
            return "You must write a comment (even a short one)";
          } else if (value?.length > 500) {
            return "Only 500 caracters are allowed for comments";
          } else {
            return true;
          }
        },
      ],
      alert: false,
      snackbarMessage: "error",
    };
  },
  props: {
    mode: {
      type: String,
      required: true,
      validator: (value) => {
        return ["modify", "read-only"].indexOf(value) !== -1;
      },
    },
    title: String,
    restaurant_id: String,
    rating_value: Number,
    date_value: String,
    comment_value: String,
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    setDate(newDate) {
      this.date = newDate;
    },
    setRating: function (rating) {
      this.rating = rating;
    },
    submit() {
      addVisitByUserId(this.$store.getters.StateUser.id, {
        restaurant_id: this.restaurant_id,
        comment: this.comment,
        rating: this.rating,
        date: this.date,
      })
        .then((res) => {
          this.closeModal();
        })
        .catch((error) => {
          this.showSnackbar(
            "L'enregistrement de la visite n'a pas pu être effectué, veuillez réessayer plus tard"
          );
        });
    },
    showSnackbar(message) {
      this.alert = true;
      this.snackbarMessage = message;
    },
  },
  components: {
    datePicker,
    StarRating,
    ProblemSnackbar,
  },
};
</script>

<style>
#starRating {
  display: flex;
  justify-content: space-evenly;
  margin-top: auto;
  align-items: flex-end;
}

#name {
  display: flex;
  justify-content: space-evenly;
  margin-top: auto;
  align-items: flex-end;
  font-weight: bold;
  font-size: xx-large;
}

#intro {
  display: flex;
  justify-content: space-evenly;
  margin-top: auto;
  align-items: flex-end;
}
</style>
