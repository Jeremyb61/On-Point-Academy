<template>
  <div>
    <!-- Dashboard Header -->
    <v-toolbar dark color="warning" app>
      <v-toolbar-side-icon @click="sideNavBar = !sideNavBar"></v-toolbar-side-icon>
      <v-toolbar-title class="text-uppercase white--text">On Point Academy</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat @click="backToDashboard">Dashboard</v-btn>
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
        <v-btn flat @click="signOut">Sign out</v-btn>
      </v-toolbar-items>
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

    <!-- Course Content -->
    <div class="container">
      <h1 class="courseTitle">{{ courseData.title }}</h1>
      <div class="videoWrapper">
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
      </div>
      <div class="contentWrapper">
        <p>{{ courseData.content }}</p>

        <form>
          <div v-for="(question,index) in questions" :key="question.id">
            <v-textarea
              v-model="answer[index]"
              name="input-7-1"
              :label="question.question_content"
              height="150"
            ></v-textarea>
          </div>
          <v-alert v-model="submitVal" type="success" dismissible>Answers saved successfully</v-alert>
          <v-btn @click="submitAnswers">Save</v-btn>
        </form>
      </div>
      <!-- End Course Content -->
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
      groups: [],
      submitVal: false,
      usersFirstname: "",
      courseData: {},
      questions: [],
      answer: [],
      videoId: ""
    };
  },
  watch: {
    async $route(to, from) {
      try {
        // Get course content
        var courseContentData = await Service.getPersonalCourseContent(
          to.params
        );
        this.courseData = courseContentData.data.course;
        this.questions = this.courseData.personal_course_questions;
        this.videoId = courseContentData.data.course.video_url;

        var answerData = await Service.getSubmittedAnswers(to.params);
        this.answer = [];
        for (var i in answerData.data.answers.personal_course_questions) {
          this.answer.push(
            answerData.data.answers.personal_course_questions[i].users[0]
              .personal_course_answers.answer_content
          );
        }
      } catch (err) {
        console.log("ERROR ", err);
      }
    }
  },
  async created() {
    try {
      // Get course content
      var courseContentData = await Service.getPersonalCourseContent(
        this.$route.params
      );
      this.courseData = courseContentData.data.course;
      this.videoId = courseContentData.data.course.video_url;
      this.questions = this.courseData.personal_course_questions;

      // Get User Data
      var userData = await Service.getUserProfile(this.$route.params.id);
      this.usersFirstname = userData.data.user.first_name;

      // Get all personal chapters and courses
      var personalChaptersData = await Service.getPersonalChapters();
      this.personalChapters = personalChaptersData.data.data;

      var answerData = await Service.getSubmittedAnswers(this.$route.params);
      if (answerData.data.answers.personal_course_questions[0]) {
        for (var i in answerData.data.answers.personal_course_questions) {
          this.answer.push(
            answerData.data.answers.personal_course_questions[i].users[0]
              .personal_course_answers.answer_content
          );
        }
      }

      // Get all groups that this user belongs to
      var groupData = await Service.getGroups(this.$route.params.id);
      this.groups = groupData.data.usersGroups.groups;
    } catch (err) {
      console.log("ERROR ", err);
    }
  },
  methods: {
    goToCourse(courseId) {
      this.$router.push(`/dashboard/${this.$route.params.id}/${courseId}`);
    },
    backToDashboard() {
      this.$router.push(`/dashboard/${this.$route.params.id}`);
    },
    signOut() {
      this.$router.push(`/`);
    },
    goToGroup(groupTitle) {
      this.$router.push(`/${this.$route.params.id}/${groupTitle}`);
    },
    async submitAnswers() {
      var answerObj = {};
      for (var i in this.questions) {
        answerObj = {
          questionId: this.questions[i].id,
          answer: this.answer[i]
        };
        var submitResponse = await Service.submitPersonalAnswers(
          answerObj,
          this.$route.params.id
        );
      }
      if (submitResponse.data.newAnswer) {
        this.submitVal = true;
      }
      var courseCompleteData = await Service.submitCourseCompletion(
        this.$route.params.id,
        this.$route.params.courseId
      );
      console.log('here')
    }
  }
};
</script>

<style scoped>
.courseTitle {
  margin-left: 60px;
}
iframe {
  position: relative;
  width: 100%;
  margin: auto;
  min-height: 400px;
}
.videoWrapper {
  margin-top: 15px;
  margin-bottom: 10px;
}
.contentWrapper {
  padding: 60px;
}
@media only screen and (max-width: 700px) {
  .videoWrapper {
    width: 100%;
    margin: auto;
  }
  .iframe {
    position: absolute;
    top: 0px;
    height: 100%;
    width: 100%;
    left: 0px;
  }
  .contentWrapper {
    margin-left: 0px;
    padding: 0px;
  }
}
@media only screen and (max-width: 900px) {
  .courseTitle {
    margin: 0px;
  }
}
</style>