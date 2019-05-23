<template>
  <div>
    <!-- Dashboard Header -->
    <v-toolbar dark color="warning" app>
      <v-toolbar-side-icon @click="sideNavBar = !sideNavBar"></v-toolbar-side-icon>
      <v-toolbar-title class="text-uppercase white--text">On Point Academy</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat>Dashboard</v-btn>
        <v-btn flat>Sign out</v-btn>
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

    <!-- Course Content -->
    <div class="container">
      <h1>{{ usersFirstname }}'s Personal Course Dashboard</h1>
      {{ courseData }}
      <iframe
        v-if="videoId !== ''"
        :src="`https://player.vimeo.com/video/${videoId}`"
        width="1000"
        height="400"
        frameborder="0"
        webkitallowfullscreen
        mozallowfullscreen
        allowfullscreen
      ></iframe>

      <form>
        <div v-for="(question,index) in questions" :key="index">
          <v-textarea
            v-model="answers[index]"
            name="input-7-1"
            :label="question.question_content"
            height="150"
          ></v-textarea>
        </div>
        <v-btn @click="submitAnswers">Submit</v-btn>
      </form>

      <!-- End Course Content -->



      1. Loop through data that i get back from "get personal chapters"
        <br>
        <br>
      2. Count how many courses exist.
      <br>
      <br>
      3. For each course, check if that course has an array of users, 
      <br>
      if so, check if one of those users is the user in params. if so
      <br>
      count 1

    </div>
  </div>
</template>

<script>
import Service from "../Service";
export default {
  name: "PersonalCourse",
  data() {
    return {
      sideNavBar: false,
      panel: [false],
      personalChapters: [],
      usersFirstname: "",
      courseData: {},
      questions: [],
      answers: [],
      videoId: ''
    };
  },
  async created() {
    try {
      // Get course content
      var courseContentData = await Service.getPersonalCourseContent(
        this.$route.params.courseId
      );
      this.courseData = courseContentData.data.course;
      this.questions = this.courseData.personal_course_questions;
      this.videoId = courseContentData.data.course.video_url;

    // Get User Data
      var userData = await Service.getUserProfile(this.$route.params.id);
      this.usersFirstname = userData.data.user.first_name;

      // Get all personal chapters and courses
      var personalChaptersData = await Service.getPersonalChapters();
      this.personalChapters = personalChaptersData.data.data;
    //   console.log(this.personalChapters[0].personal_courses);


    //   var iframe = document.querySelector("iframe");
    //   var player = new Vimeo.Player(iframe);

    //   player.on("play", function() {
    //     // console.log("Played the video");
    //   });

    //   player.getVideoTitle().then(function(title) {
    //     // console.log("title:", title);
    //   });
    } catch (err) {
    //   console.log("ERROR ", err);
    }
  },
  methods: {
    goToCourse(courseId) {
      this.$router.push(`/dashboard/${this.$route.params.id}/${courseId}`);
    },
    async submitAnswers() {
      var answerObj = {};
      for (var i in this.questions) {
        answerObj = {
          questionId: this.questions[i].id,
          answer: this.answers[i]
        };
      var submitResponse = await Service.submitPersonalAnswers(
          answerObj,
          this.$route.params.id
        );
      }
        console.log("submit response", submitResponse);
      var courseCompleteData = await Service.submitCourseCompletion(
          this.$route.params.id,
          this.$route.params.courseId
      )
    }
  }
};
</script>

<style scoped>
</style>
