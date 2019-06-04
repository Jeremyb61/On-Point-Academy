<template>
  <div>
    <!-- Dashboard Header -->
    <v-toolbar dark color="success" app>
      <v-toolbar-side-icon @click="sideNavBar = !sideNavBar"></v-toolbar-side-icon>
      <v-toolbar-title class="text-uppercase white--text">On Point Academy</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat @click="backToDashboard">Dashboard</v-btn>
        <v-menu>
          <template #activator="{ on: menu }">
            <v-btn flat v-on="{ ...menu }">Switch Groups</v-btn>
          </template>
          <v-list>
            <div v-for="(group, index) in groups" :key="index">
              <v-list-tile @click="switchGroup(group.title)">
                <v-list-tile-title>{{ group.title }}</v-list-tile-title>
              </v-list-tile>
            </div>
          </v-list>
        </v-menu>
        <v-btn flat>Sign out</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <!-- End Header -->

    <!-- Side Nav Bar  -->
    <v-navigation-drawer width="220" v-model="sideNavBar" app class="accent">
      <v-expansion-panel v-model="panel" expand>
        <v-expansion-panel-content v-for="item in groupChapters" :key="item.id">
          <template v-slot:header>
            <div>{{ item.title }}</div>
          </template>
          <div v-for="course in item.group_courses" :key="course.id">
            <v-card @click="goToGroupCourse(course.id)">
              <v-card-text class="grey lighten-3">{{ course.title }}</v-card-text>
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
          v-if="courseData.video_url !== ''"
          :src="`https://player.vimeo.com/video/${courseData.video_url}`"
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
          <v-alert v-model="submitVal" type="success" dismissible>Answers submitted successfully</v-alert>
          <v-btn @click="submitAnswers">Submit</v-btn>
        </form>
      </div>
    </div>
    <!-- End Course Content -->
  </div>
</template>

<script>
import Service from "../Service.js";
export default {
  name: "GroupCourse",
  data() {
    return {
      sideNavBar: false,
      panel: [false],
      groups: [],
      groupChapters: [],
      usersFirstname: "",
      groupTitle: "",
      courseData: {},
      questions: [],
      answer: [],
      submitVal: false,
    };
  },
  watch: {
    async $route(to, from) {
      try {
        // Get course content
        var CourseContent = await Service.getGroupCourseContent(
          this.$route.params
        );
        this.courseData = CourseContent.data.course;
        this.questions = CourseContent.data.course.group_course_questions;

        var answerData = await Service.getSubmittedGroupAnswers(
          this.$route.params
        );
        this.answer = [];
        for (var i in answerData.data.answers) {
          this.answer.push(answerData.data.answers[i].answer_content);
        }
        this.submitVal = false;
      } catch (err) {
        console.log("ERROR ", err);
      }
    }
  },
  async created() {
    try {
      // Get User Data
      console.log(this.$route.params);
      var userData = await Service.getUserProfile(this.$route.params.id);
      this.usersFirstname = userData.data.user.first_name;

      // Get all other groups that user belongs to
      var groupData = await Service.getOtherGroups(
        this.$route.params.id,
        this.$route.params.group
      );
      this.groups = groupData.data.usersGroups.groups;

      // Get Current Group title
      var myGroup = await Service.getCurrentGroup(this.$route.params.group);
      this.groupTitle = myGroup.data.group.title;

      // Get all Group chapters
      var groupChaptersData = await Service.getGroupChapters();
      this.groupChapters = groupChaptersData.data.data;

      var CourseContent = await Service.getGroupCourseContent(
        this.$route.params
      );
      this.courseData = CourseContent.data.course;
      this.questions = CourseContent.data.course.group_course_questions;

      var answerData = await Service.getSubmittedGroupAnswers(
        this.$route.params
      );
      for (var i in answerData.data.answers) {
        this.answer.push(answerData.data.answers[i].answer_content);
      }
      console.log(this.answer);
    } catch (err) {
      console.log("ERROR ", err);
    }
  },
  methods: {
    async switchGroup(group) {
      // Change route to another group dashboard
      this.$router.push(`/${this.$route.params.id}/${group}`);

      // Get Group Content
      var myGroup = await Service.getCurrentGroup(this.$route.params.group);
      this.groupTitle = myGroup.data.group.title;

      // Show other groups in menu -- Not current group --
      var groupData = await Service.getOtherGroups(
        this.$route.params.id,
        this.$route.params.group
      );
      this.groups = groupData.data.usersGroups.groups;
    },
    goToGroupCourse(courseId) {
      this.$router.push(
        `/dashboard/${this.$route.params.id}/${
          this.$route.params.group
        }/${courseId}`
      );
    },
    backToDashboard() {
      this.$router.push(
        `/${this.$route.params.id}/${this.$route.params.group}`
      );
    },
    async submitAnswers() {
      var answerObj = {};
      for (var i in this.questions) {
        answerObj = {
          questionId: this.questions[i].id,
          answer: this.answer[i]
        };
        var submitResponse = await Service.submitGroupAnswers(
          answerObj,
          this.$route.params
        );
      }
      if(submitResponse.data.newAnswer) {
          this.submitVal = true;
      }

      console.log("submit response", submitResponse);
      //   var groupCourseCompleteData = await Service.submitGroupCourseCompletion(
      //     this.$route.params
      //   );
      //   console.log(groupCourseCompleteData);
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



