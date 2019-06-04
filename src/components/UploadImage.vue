<template>
  <div id="app">
    <v-app>
      <v-toolbar dark color="primary">
        <v-toolbar-side-icon></v-toolbar-side-icon>
        <v-toolbar-title class="white--text">Upload an image</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn flat @click="goBack">Back</v-btn>
      </v-toolbar>
      <v-content>
        <v-container fluid>
          <v-flex xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">
            <v-text-field
              label="Select Image"
              @click="pickFile"
              v-model="imageName"
              prepend-icon="attach_file"
            ></v-text-field>
            <input
              type="file"
              ref="file"
              style="display: none"
              accept="image/*"
              @change="onFilePicked"
            >
            <v-btn @click="onUpload">Upload</v-btn>
          </v-flex>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import Service from "../Service";
export default {
  name: "UploadImage",
  data() {
    return {
      imageName: "",
      file: null
    };
  },
  methods: {
    pickFile() {
      this.$refs.file.click();
    },
    onFilePicked(event) {
      console.log(event);
      this.file = event.target.files[0];
      console.log(this.file);
      this.imageName = this.file.name;
    },
    onUpload() {
      const formData = new FormData();
      formData.append("image", this.file);
      
      try {
       

        var uploadData = Service.uploadNewImage(
          this.$route.params.id,
          formData
        );
        this.$router.push(`/dashboard/${this.$route.params.id}`);
      } catch (err) {
        console.log(err);
      }
    },
    goBack() {
      this.$router.push(`/dashboard/${this.$route.params.id}`);
    }
  }
};
</script>

<style scoped>
</style>


