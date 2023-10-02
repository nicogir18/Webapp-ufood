<template>
  <v-layout v-if="!loading">
    <v-carousel class="picture" :value="0" hide-delimiters show-arrows cycle>
      <template v-slot:prev="{ props }">
        <v-btn
          variant="elevated"
          icon="mdi-chevron-left"
          color="white !important"
          @click="props.onClick"
        ></v-btn>
      </template>
      <template v-slot:next="{ props }">
        <v-btn
          variant="elevated"
          color="white !important"
          icon="mdi-chevron-right"
          @click="props.onClick"
        ></v-btn>
      </template>
      <v-carousel-item
        v-for="(image, index) in pictures"
        :key="index"
        :src="image"
        eager
        cover
      ></v-carousel-item>
    </v-carousel>
  </v-layout>
</template>

<script>
export default {
  props: {
    pictures: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
    };
  },
  watch: {
    pictures: function (newVal, oldVal) {
      if (newVal.length !== 0) {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.picture {
  border-radius: 22px;
}
</style>
