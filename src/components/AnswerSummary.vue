<template>
  <div>
    <!-- Dashboard Header -->
    <v-toolbar dark color="grey darken-3" app>
      <v-toolbar-side-icon @click="sideNavBar = !sideNavBar"></v-toolbar-side-icon>
      <img style="width:192px" src="https://res.cloudinary.com/ducvha2fk/image/upload/v1559515269/oplogo.png">
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat @click="backToDashboard">Back</v-btn>
        <v-btn flat router to="/">Sign out</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <!-- End Header -->

    <!-- Side Nav Bar  -->
    <v-navigation-drawer width="220" v-model="sideNavBar" app class="grey darken-3" temporary>
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

    <v-sheet elevation="8" class="mx-auto" min-height="250" width="80%" style="border-radius:10px; margin-top: 25px; margin-bottom:20px">
    <div class="container" >
        <h1 style="text-align:center; font-weight:300">Your {{this.chapterData.title}} Summary</h1>
        <hr style="display:block; margin-top:5px">
        <div v-for="(answer,index) in answerSummary" :key="index">
           
            <h3 style="font-weight:300"><em>{{ answer.question_content }}</em></h3>
            
            <p>{{ answer.answer_content }}</p>
            <hr>
            
        </div>

    </div>
    </v-sheet>
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
      answerSummary: [],
      chapterData: {}
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


      for(var i in this.personalChapters) {
          if (this.personalChapters[i].id == this.$route.params.courseId){
            this.chapterData = this.personalChapters[i]
          }
      }

      //Get all questions/Answers user has submitted for this course
      var answers = await Service.getAnswers(this.$route.params);
      this.answerSummary = answers.data.answers
      
      console.log(this.$route.params);

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


