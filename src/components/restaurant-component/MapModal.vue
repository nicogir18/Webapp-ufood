<template>
  <v-dialog v-model="dialog">
    <template v-slot:activator="{ props }">
      <button
        class="bg-blue-500 rounded-full text-white px-4 py-2 hover:bg-blue-600"
        v-bind="props"
      >
        View On Map
      </button>
    </template>
    <v-card>
      <div id="map-container" style="height: 500px"></div>
      <v-card-actions class="button-action-container">
        <button
          class="bg-blue-500 rounded-full text-white px-4 py-2 hover:bg-blue-600 mr-2"
          @click="drawRoute"
        >
          View Direction
        </button>
        <button
          class="bg-blue-500 rounded-full text-white px-4 py-2 hover:bg-blue-600"
          @click="dialog = false"
        >
          Close
        </button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import mapboxgl from "mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

export default {
  props: {
    location: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      map: null,
      directions: null,
    };
  },
  watch: {
    dialog(value) {
      if (value) {
        setTimeout(() => {
          this.initMap();
        }, 1000);
      }
    },
  },
  methods: {
    initMap() {
      const API_KEY = process.env.VUE_APP_MAPBOX_API_TOKEN;

      mapboxgl.accessToken = API_KEY;
      this.map = new mapboxgl.Map({
        container: "map-container",
        style: "mapbox://styles/mapbox/streets-v11",
        center: this.location.coordinates,
        zoom: 12,
      });
      this.map.on("load", () => {
        this.map.addLayer({
          id: "markers",
          type: "symbol",
          source: {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "Point",
                    coordinates: this.location.coordinates,
                  },
                },
              ],
            },
          },
          layout: {
            "icon-image": "marker-15",
            "icon-size": 2.5,
          },
        });
      });
    },
    drawRoute() {
      const defaultMarkerCoords = this.location.coordinates;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const userCoords = [
            position.coords.longitude,
            position.coords.latitude,
          ];

          this.directions = new MapboxDirections({
            accessToken: mapboxgl.accessToken,
            unit: "metric",
            profile: "mapbox/driving-traffic",
            interactive: true,
            controls: {
              inputs: false,
              instructions: false,
            },
          });

          this.directions.setOrigin([userCoords[0], userCoords[1]]);
          this.directions.setDestination([
            defaultMarkerCoords[0],
            defaultMarkerCoords[1],
          ]);

          this.directions.on("result", (e) => {
            const route = e.routes[0];
            this.map.addLayer({
              id: "route",
              type: "line",
              source: {
                type: "geojson",
                data: {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "LineString",
                    coordinates: route.geometry.coordinates,
                  },
                },
              },
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#888",
                "line-width": 8,
                "line-opacity": 0.8,
              },
            });
          });

          this.map.addControl(this.directions, "top-left");
        });
      }
    },
  },
};
</script>

<style>
.v-card-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
