<template>
  <div>
    <!-- Dashboard Header -->
    <v-toolbar dark color="secondary" app>
      <v-toolbar-side-icon class="hidden-xs-only" @click="sideNavBar = !sideNavBar"></v-toolbar-side-icon>
      <v-toolbar-title class="text-uppercase white--text">On Point Academy</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-menu>
          <template #activator="{ on: menu }">
            <v-btn flat v-on="{ ...menu }" class="hidden-xs-only">Your Groups</v-btn>
          </template>
          <v-list>
            <div v-for="(group, index) in groups" :key="index">
              <v-list-tile @click="goToGroup(group.title)">
                <v-list-tile-title>{{ group.title }}</v-list-tile-title>
              </v-list-tile>
            </div>
          </v-list>
        </v-menu>
        <v-menu>
          <template #activator="{ on: menu }">
            <v-btn flat v-on="{ ...menu }" class="hidden-xs-only">Settings</v-btn>
          </template>
          <v-list>
            <div>
              <v-list-tile @click="goToUploadImage">
                <v-list-tile-title>Change Profile Picture</v-list-tile-title>
              </v-list-tile>
            </div>
          </v-list>
        </v-menu>
        <v-btn flat router to="/" class="hidden-xs-only">Sign out</v-btn>
      </v-toolbar-items>
      <v-toolbar-side-icon class="hidden-sm-and-up" @click="mobilePanel = !mobilePanel"></v-toolbar-side-icon>
    </v-toolbar>

    <!-- End Header -->

    <!-- Side Nav Bar  -->
    <v-navigation-drawer width="230" v-model="sideNavBar" app class="accent">
      <v-expansion-panel v-model="panel" expand>
        <v-expansion-panel-content v-for="item in personalChapters" :key="item.id">
          <template v-slot:header>
            <div>{{ item.title }}</div>
          </template>
          <div v-for="course in item.personal_courses" :key="course.id">
            <v-card @click="goToCourse(course.id)">
              <v-card-text class="grey lighten-3">
                {{ course.title }}
                <v-icon v-if="course.users[0]" color="success" right>done</v-icon>
              </v-card-text>
            </v-card>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-navigation-drawer>
    <!-- End Side Nav Bar -->

    <!-- Mobile Expansion Panel -->
    <v-navigation-drawer
      width="220"
      class="hidden-sm-and-up accent"
      right
      v-model="mobilePanel"
      app
    >
      <v-expansion-panel v-model="panel" expand>
        <v-expansion-panel-content>
          <template #activator="{ on: menu }">
            <v-btn flat v-on="{ ...menu }">Your Groups</v-btn>
          </template>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-navigation-drawer>
    <!-- End Mobile Expansion Panel -->

    <!-- Dashboard Content -->
    <div class="container" justify-center>
      <v-layout row wrap justify-center>
        <v-flex xs12 s12 md12 lg12 xl12 justify-center>
          <div class="radial-container">
          <radial-progress-bar
            :diameter="240"
            :completed-steps="totalComplete"
            :total-steps="totalSteps"
            :strokeWidth="15"
            startColor="green"
            stopColor="red"
            :animateSpeed="600"
          >
    
            <div class="main-icon-div">
              <img class="profile-pic" :src="image">
            </div>
          </radial-progress-bar>
          </div>
        </v-flex>
      </v-layout>
      <v-layout row wrap justify-center>
        <v-flex xs12 s12 md12 lg12 xl12 justify-center>
          <div
            style="display:inline-block;"
            v-for="(chapter,index) in personalChapters"
            :key="index"
          >
            <div @click="goToAnswerPage(chapter.id)">
              <radial-progress-bar
                :diameter="160"
                :completed-steps="value[index]"
                :total-steps="totalSteps"
                :strokeWidth="15"
                :startColor="colors[index]"
                :stopColor="colors[index]"
                :animateSpeed="600"
              >
                <img class="icon" :src="icons[index]" alt>
              </radial-progress-bar>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </div>
    <!-- End DashBoard Content  -->
  </div>
</template>
<script>
import Service from "../Service";
import RadialProgressBar from "vue-radial-progress";
import { parse } from "path";

export default {
  components: {
    RadialProgressBar
  },
  name: "Dashboard",
  data() {
    return {
      sideNavBar: false,
      mobilePanel: false,
      panel: [false],
      user: {},
      personalChapters: [],
      groups: [],
      image: "",
      progress: [],
      overallProgress: "",
      value: [],
      completedSteps: 0,
      totalSteps: 100,
      totalComplete: 0,
      icons: [
        "data:image/png;base64,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",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt0NcsDQYLxFiDkt4BV8-3xclXxkYhvfACKmIKNz-seSSPnXLcXA",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA9DJGEs0drLffSMJDxGwFMRo-mIzxAnWWTuwZr8Q0sqI8gAZV",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdQxUAnbcWVFMKevtUKxfLAtIHIATG6iLRpPYTyeIQuzbxxuSg",
        "https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/WPVG_icon_2016.svg/1024px-WPVG_icon_2016.svg.png",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzOT4uekAcWnhWFJ691CSzeyaw81YVHWYXTes30KLNGqqeGag_Xw",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3Qx5GWpzEnfTx7YQWX4rEjENki6qHoic0uyknmY5W20ph81cYJw"
      ],
      colors: [
        "#7DF683",
        "#7DF6F4",
        "yellow",
        "green",
        "blue",
        "indigo",
        "violet"
      ]
    };
  },
  async created() {
    try {
      // Get User Data
      var userData = await Service.getUserProfile(this.$route.params.id);
      this.user = userData.data.user;
      this.image = userData.data.user.image;

      // Get all groups that this user belongs to
      var groupData = await Service.getGroups(this.$route.params.id);
      this.groups = groupData.data.usersGroups.groups;
        
      // Get all personal chapters and courses
      var personalChaptersData = await Service.getPersonalChapters();
      this.personalChapters = personalChaptersData.data.data;

      //Get all personal course completes
      var userTotal = 0;
      var courseTotal = 0;
      for (var i in this.personalChapters) {
        var getCompletes = await Service.getCompletes(
          this.$route.params.id,
          this.personalChapters[i].id
        );

        // Concatenating Users overall progress and putting in data()
        userTotal += getCompletes.data.user.count;
        courseTotal += getCompletes.data.courses.count;
        this.overallProgress = `${userTotal}/${courseTotal}`;

        // Concatenating Users individual course progress and putting in data()
        var completes = `${getCompletes.data.user.count}/${
          getCompletes.data.courses.count
        }`;
        this.progress.push(completes);

        // Getting value for progress bars
        var numerator = parseInt(completes);
        this.value.push(numerator * 20);
      }
      var a = this.overallProgress;
      var split = a.split("/");
      var result = parseInt(split[0], 10) / parseInt(split[1], 10);
      this.totalComplete = Math.floor(result * 100);
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    goToGroup(groupTitle) {
      this.$router.push(`/${this.$route.params.id}/${groupTitle}`);
    },
    goToCourse(courseId) {
      this.$router.push(`/dashboard/${this.$route.params.id}/${courseId}`);
    },
    goToUploadImage() {
      this.$router.push(`/dashboard/${this.$route.params.id}/upload`);
    },
    goToAnswerPage(courseId) {
      this.$router.push(
        `/dashboard/${this.$route.params.id}/summary/${courseId}`
      );
    }
  }
};
</script>
<style scoped>
.container {
  margin: auto;
}
.radial-container {
    margin:auto;
}
.main-icon-div {
  border: 5px solid rgba(97, 24, 24, 0.986);
  border-radius: 100px;
  height: 200px;
  width: 200px;
  margin: auto;
  display: block;
}
.profile-pic {
  width: 100%;
  height: 100%;
  border-radius: 51%;
}
.main-icon {
  width: 100%;
}
.course-icon {
  border: 1px solid black;
  border-radius: 75px;
  height: 100px;
  width: 100px;
  display: inline-block;
  vertical-align: top;
}
.icon-wrapper {
  display: inline-block;
  vertical-align: top;
  margin: auto;
}
.icon {
  width: 92%;
  height: 78%;
  border-radius: 51%;
}
.v-progress-circular {
  border-radius: 51%;
  margin-left:50%;
}
</style>


