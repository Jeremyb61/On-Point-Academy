<template>
  <div>
    <!-- Dashboard Header -->
    <v-toolbar dark color="black" app>
      <v-toolbar-side-icon @click="sideNavBar = !sideNavBar"></v-toolbar-side-icon>
       <img style="width:192px" src="https://res.cloudinary.com/ducvha2fk/image/upload/v1559515269/oplogo.png">
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat @click="backToDashboard">Dashboard</v-btn>
        <v-menu>
          <template #activator="{ on: menu }">
            <v-btn flat v-on="{ ...menu }" class="hidden-xs-only">Your Groups</v-btn>
          </template>
          <v-list>
            <div v-for="(group, index) in groups" :key="index">
              <v-list-tile @click="goToGroup(group.title,group.id)">
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
    <v-navigation-drawer width="230" v-model="sideNavBar" app class="grey darken-3" temporary>
      <v-expansion-panel v-model="panel" expand>
        <v-expansion-panel-content v-for="item in personalChapters" :key="item.id">
          <template v-slot:header>
            <div>{{ item.title }}</div>
          </template>
          <div v-for="course in item.personal_courses" :key="course.id">
            <v-card @click="goToCourse(course.id)">
              <v-card-text class="grey lighten-3">
                {{ course.title }}
                <div style="display:inline-block" v-if="course.users[0]">
                  <div v-for="(complete,index) in course.users" :key="index">
                    <v-icon v-if="complete.id == userParam" color="success" right>done</v-icon>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-navigation-drawer>
    <!-- End Side Nav Bar -->

    <!-- Course Content -->
    <v-sheet elevation="8" class="mx-auto" min-height="250" width="85vw" style="border-radius:10px; margin-top: 20px; margin-bottom:20px">
    <div class="container">
      
      <h1 style= "font-weight:300; text-align:center; margin-right:40px" class="courseTitle">{{ courseData.title }}</h1>
      <hr style="display:block">
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
        <h1 style= "font-weight:300; text-align:center; margin-right:40px; padding-bottom: 5px" class="courseTitle">Summary</h1>
        <p style= "text-align:center; padding 10px">{{ courseData.content }}</p>
      </div>
      </v-sheet>
      <v-sheet elevation="8" class="mx-auto" min-height="250" width="85vw" style="border-radius:10px; margin-bottom:20px">
      <h1 style= "font-weight:300; text-align:center; margin-right:40px; margin-top:10px; padding-top: 10px" class="courseTitle">Action Steps</h1>
      <hr style="display:block; width:93%; justify-content: center; margin-left:3%; margin-top:5px">
        <form style="padding:30px">
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
          <v-btn v-if="complete===false" :disabled="noContinue" @click="submitComplete">Complete</v-btn>
          <v-btn v-else @click="deleteComplete">Uncomplete</v-btn>
        </form>
      
      </v-sheet>
      <!-- End Course Content -->
    </div>
</template>

<script>
import Service from "../Service";
export default {
  name: "PersonalCourse",
  data() {
    return {
      userParam: this.$route.params.id,
      sideNavBar: false,
      panel: [false],
      personalChapters: [],
      noContinue: true,
      groups: [],
      submitVal: false,
      usersFirstname: "",
      courseData: {},
      questions: [],
      answer: [],
      videoId: "",
      complete: Boolean
    };
  },
  watch: {
    async $route(to, from) {
      try {
        this.submitVal = false;
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
        var checkComplete = await Service.checkPersonalComplete(to.params);
        if (!checkComplete.data.complete[0]) {
          this.complete = false;
        } else {
          this.complete = true;
        }
        window.scrollTo(0, 0);
      } catch (err) {
        console.log("ERROR ", err);
      }
    },
    answer: function() {
      for (var i in this.answer) {
        if (this.answer[i] != "") {
          this.noContinue = false;
        } else {
          this.noContinue = true;
        }
      }
    }
  },

  async created() {
    try {
      window.scrollTo(0, 0);
      // Get course content
      var userData = await Service.getUserProfile(this.$route.params.id);
      if (userData.data.error) {
        this.$router.push(`/login`);
      } else {
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

        var checkComplete = await Service.checkPersonalComplete(
          this.$route.params
        );
        if (!checkComplete.data.complete[0]) {
          this.complete = false;
        } else {
          this.complete = true;
        }
      }
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
      this.$router.push(`/login`);
    },
    goToGroup(groupTitle, groupId) {
      this.$router.push(
        `/group-dashboard/${this.$route.params.id}/${groupId}/${groupTitle}`
      );
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
    },
    async submitComplete() {
      await this.submitAnswers();
      var courseCompleteData = await Service.submitCourseCompletion(
        this.$route.params.id,
        this.$route.params.courseId
      );
      this.complete = true;
      var courseId = parseInt(this.$route.params.courseId);
      for (var i in this.personalChapters) {
        for (var j in this.personalChapters[i].personal_courses) {
          if (
            this.courseData.location ===
            this.personalChapters[i].personal_courses[j].location
          ) {
            if (
              this.personalChapters[i].personal_courses[parseInt(j) + 1] ===
              undefined
            ) {
              this.$router.push(`/dashboard/${this.$route.params.id}`);
            } else {
              var currentCourseLocation = this.courseData.location;
              var nextCourseLocation = this.personalChapters[i]
                .personal_courses[parseInt(j) + 1].location;
              var nextLocArr = ("" + nextCourseLocation).split("");
              var currentLocArr = ("" + currentCourseLocation).split("");
              if (currentLocArr[0] === nextLocArr[0]) {
                this.$router.push(
                  `/dashboard/${this.$route.params.id}/${courseId + 1}`
                );
              }
            }
          }
        }
      }
    },
    async deleteComplete() {
      var delComplete = await Service.deleteCourseCompletion(
        this.$route.params
      );
      this.complete = false;
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