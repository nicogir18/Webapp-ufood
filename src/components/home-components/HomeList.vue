<script>
import Card from "./Card.vue";

export default {
  components: {
    Card,
  },
  props: {
    restaurants: {
      type: Array,
      required: true,
    },
  },
};
</script>
<template>
  <div>
    <div v-if="typeof restaurants !== 'undefined'">
      <div
        v-if="restaurants.length !== 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
      >
        <Card
          v-for="restaurant in restaurants"
          :key="restaurant.id"
          :image="
            typeof restaurant.pictures[0] !== 'undefined'
              ? restaurant.pictures[0]
              : ''
          "
          :title="restaurant.name"
          :rating="restaurant.rating"
          :id="restaurant.id"
        ></Card>
      </div>
      <div v-else>
        <h2 class="error-title">Nothing found for this filter</h2>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  margin-left: 50px;
  margin-bottom: 20px;
}

.dropdown {
  position: relative;
}

.dropdown-toggle {
  display: flex;
  align-items: center;
  border-radius: 30px;
  padding: 10px 20px;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  padding: 20px 20px;
  width: 300px;
  z-index: 1;
}

.slider-container {
  display: flex;
  justify-content: space-evenly;
  margin-top: 8px;
  margin-bottom: 15px;
}

.button-container {
  display: flex;
  justify-content: space-evenly;
}

.button-image {
  margin-left: 8px;
  width: 20px;
  height: 20px;
}

#button-text-logo-container {
  display: inline-flex;
  align-items: center;
  justify-content: space-around;
}

.error-title {
  font-weight: bold;
  display: block;
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
</style>
