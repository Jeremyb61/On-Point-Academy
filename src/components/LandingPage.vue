<template>
  <div>
    <v-toolbar app height="75px">
      <v-toolbar-title>
        <img src="https://res.cloudinary.com/ducvha2fk/image/upload/v1559515269/oplogo.png">
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn flat>Sign in</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-carousel prev-icon="mdi-arrow-left" next-icon="mdi-arrow-right" dark>
      <v-carousel-item v-for="(item,i) in items" :key="i" :src="item.src">
        <v-container fill-height>
          <v-layout align-center>
            <v-flex text-xs-center>
              <h1 class="display-2 white--text">{{ item.textOne }}!</h1>
            </v-flex>
          </v-layout>
        </v-container>
      </v-carousel-item>
    </v-carousel>
    <v-jumbotron gradient="to top, #E0E0E0,#757575" dark height="400px">
      <v-container fill-height>
        <v-layout align-center>
          <v-flex text-xs-center>
            <h1 class="display-3">Welcome!</h1>
          </v-flex>
        </v-layout>
      </v-container>
    </v-jumbotron>
    <v-parallax src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"></v-parallax>

    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          src: "https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg",
          textOne: "Text for image 1"
        },
        {
          src: "https://cdn.vuetifyjs.com/images/carousel/sky.jpg",
          textOne: "Text for image 2"
        },
        {
          src: "https://cdn.vuetifyjs.com/images/carousel/bird.jpg",
          textOne: "Text for image 3"
        },
        {
          src: "https://cdn.vuetifyjs.com/images/carousel/planet.jpg",
          textOne: "Text for image 4"
        }
      ]
    };
  }
};
</script>

<style>
</style>
