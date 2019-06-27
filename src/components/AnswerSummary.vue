<template>
  <div>
    <!-- Dashboard Header -->
    <v-toolbar dark color="info" app>
      <v-toolbar-side-icon @click="sideNavBar = !sideNavBar"></v-toolbar-side-icon>
      <v-toolbar-title class="text-uppercase white--text">On Point Academy</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat @click="backToDashboard">Back</v-btn>
        <v-btn flat router to="/">Sign out</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <!-- End Header -->

    <!-- Side Nav Bar  -->
    <v-navigation-drawer width="220" v-model="sideNavBar" app class="accent">
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
    <div class="container">
      <h1>Answer Summary</h1>
      <div v-for="(answer,index) in answerSummary" :key="index">
        <h3>Question:</h3>
        <p>{{ answer.question_content }}</p>
        <h3>Answer:</h3>
        <p>{{ answer.answer_content }}</p>
        <hr>
      </div>
    </div>
  </div>
</template>

<script>
import Service from "../Service";
export default {
  name: "Dashboard",
  data() {
    return {
      sideNavBar: false,
      panel: [false],
      user: {},
      personalChapters: [],
      groups: [],
      answerSummary: []
    };
  },
  async created() {
    try {
      // Get User Data
      var userData = await Service.getUserProfile(this.$route.params.id);
      this.user = userData.data.user;
      if (userData.data.error) {
        this.$router.push(`/login`);
      } else {
        // Get all personal chapters and courses
        var personalChaptersData = await Service.getPersonalChapters();
        this.personalChapters = personalChaptersData.data.data;

        //Get all questions/Answers user has submitted for this course
        var answers = await Service.getAnswers(this.$route.params);
        this.answerSummary = answers.data.answers;

        console.log(this.$route.params);
      }
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    goToCourse(courseId) {
      this.$router.push(`/dashboard/${this.$route.params.id}/${courseId}`);
    },
    backToDashboard() {
      this.$router.push(`/dashboard/${this.$route.params.id}`);
    }
  }
};
</script>
<style scoped>
hr {
  margin-bottom: 25px;
}
</style>


