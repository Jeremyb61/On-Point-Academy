<template>
  <div>
    <!-- Dashboard Header -->
    <v-toolbar dark color="success" app>
      <v-toolbar-side-icon @click="sideNavBar = !sideNavBar"></v-toolbar-side-icon>
      <v-toolbar-title class="text-uppercase white--text">On Point Academy</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat @click="backToDashboard">Dashboard</v-btn>
        <v-menu v-if="otherGroupStatus === true">
          <template #activator="{ on: menu }">
            <v-btn flat v-on="{ ...menu }">Switch Groups</v-btn>
          </template>
          <v-list>
            <div v-for="(group, index) in groups" :key="index">
              <v-list-tile @click="switchGroup(group.title,group.id)">
                <v-list-tile-title>{{ group.title }}</v-list-tile-title>
              </v-list-tile>
            </div>
          </v-list>
        </v-menu>
        <v-btn @click="signOut" flat>Sign out</v-btn>
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
              <v-card-text class="grey lighten-3">
                {{ course.title }}
                <span v-for="(complete,index) in groupCompletes" :key="index">
                  <v-icon v-if="complete.groupCourseId === course.id" color="success" right>done</v-icon>
                </span>
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
          <v-alert v-model="submitVal" type="success" dismissible>Answers saved successfully</v-alert>
          <v-btn @click="submitAnswers">Save</v-btn>
          <v-btn v-if="complete===false" :disabled="noContinue" @click="submitComplete">Complete</v-btn>
          <v-btn v-else @click="deleteComplete">uncomplete?</v-btn>
        </form>
      </div>
    </div>
    <!-- End Course Content -->
  </div>
</template>

<script>
import Service from "../Service.js";
import { setTimeout } from "timers";
export default {
  name: "GroupCourse",
  data() {
    return {
      complete: Boolean,
      noContinue: true,
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
      answerStatus: [],
      groupCompletes: [],
      denied: true,
      otherGroupStatus: true
    };
  },
  watch: {
    async $route(to, from) {
      try {
        window.scrollTo(0, 0);
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

        var checkComplete = await Service.checkForComplete(this.$route.params);
        if (!checkComplete.data.complete) {
          this.complete = false;
        } else {
          this.complete = true;
        }

        console.log(this.complete);
      } catch (err) {
        console.log("ERROR ", err);
      }
    },
    answer: function() {
      for (var i in this.answer) {
        if (this.answer[i] === "") {
          this.noContinue = true;
        } else {
          this.noContinue = false;
        }
      }
    }
  },
  async created() {
    try {
      window.scrollTo(0, 0);

      // Get User Data
      console.log(this.$route.params);
      var userData = await Service.getUserProfile(this.$route.params.id);
      if (userData.data.error) {
        this.$router.push(`/login`);
      } else {
        if (userData.data.user.groups.length === 0) {
          this.$router.push(`/dashboard/${this.$route.params.id}/`);
        } else {
          for (var i in userData.data.user.groups) {
            console.log(userData.data.user.groups[i]);
            if (userData.data.user.groups[i].id == this.$route.params.groupId) {
              this.denied = false;
              console.log("denied: ", this.denied);
            }
          }
        }
        if (this.denied == true) {
          this.$router.push(`/dashboard/${this.$route.params.id}/`);
        }
        // Get all other groups that user belongs to
        var groupData = await Service.getOtherGroups(
          this.$route.params.id,
          this.$route.params.group
        );
        console.log(groupData);
        if (groupData.data.status === false) {
          this.otherGroupStatus = false;
        } else {
          this.groups = groupData.data.usersGroups.groups;
        }

        // Get Current Group title
        var myGroup = await Service.getCurrentGroup(this.$route.params.group);
        this.groupTitle = myGroup.data.group.title;

        // Get all Group chapters
        var groupChaptersData = await Service.getGroupChapters();
        this.groupChapters = groupChaptersData.data.data;
        console.log("groupChapters", this.groupChapters);

        var CourseContent = await Service.getGroupCourseContent(
          this.$route.params
        );
        this.courseData = CourseContent.data.course;
        this.questions = CourseContent.data.course.group_course_questions;
        console.log(this.courseData);

        var answerData = await Service.getSubmittedGroupAnswers(
          this.$route.params
        );
        for (var i in answerData.data.answers) {
          this.answer.push(answerData.data.answers[i].answer_content);
        }
        console.log("answerData", answerData);

        var checkComplete = await Service.checkForComplete(this.$route.params);
        if (!checkComplete.data.complete) {
          this.complete = false;
        } else {
          this.complete = true;
        }
        console.log(this.complete);

        //Get all group course completes
        var groupCourseComplete = await Service.getGroupCourseCompletes(
          this.$route.params
        );
        this.groupCompletes = groupCourseComplete.data.completes;
        console.log(this.groupCompletes);
      }
    } catch (err) {
      console.log("ERROR ", err);
    }
  },
  methods: {
    async switchGroup(groupTitle, groupId) {
      // Change route to another group dashboard
      this.$router.push(
        `/group-dashboard/${this.$route.params.id}/${groupId}/${groupTitle}`
      );

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
        `/dashboard/${this.$route.params.id}/${this.$route.params.group}/${
          this.$route.params.groupId
        }/${courseId}`
      );
    },
    backToDashboard() {
      this.$router.push(
        `/group-dashboard/${this.$route.params.id}/${
          this.$route.params.groupId
        }/${this.$route.params.group}`
      );
    },
    async submitAnswers() {
      var answerObj = {};
      console.log("question ", this.questions);
      for (var i in this.questions) {
        answerObj = {
          questionId: this.questions[i].id,
          answer: this.answer[i]
        };
        console.log("answerObj", answerObj);
        var submitResponse = await Service.submitGroupAnswers(
          answerObj,
          this.$route.params
        );
      }
      if (submitResponse.data.newAnswer) this.submitVal = true;

      console.log("Submit Response", submitResponse);
    },
    async submitComplete() {
      await this.submitAnswers();
      await Service.submitGroupCourseCompletion(this.$route.params);
      var courseId = parseInt(this.$route.params.courseId);
      console.log("pre for");
      for (var i in this.groupChapters) {
        for (var j in this.groupChapters[i].group_courses) {
          if (
            this.courseData.location ===
            this.groupChapters[i].group_courses[j].location
          ) {
            if (
              this.groupChapters[i].group_courses[parseInt(j) + 1] === undefined
            ) {
              console.log("Chapter Completed - back to dashboard");
              this.$router.push(
                `/group-dashboard/${this.$route.params.id}/1/${
                  this.$route.params.group
                }`
              );
            } else {
              var currentCourseLocation = this.courseData.location;
              var nextCourseLocation = this.groupChapters[i].group_courses[
                parseInt(j) + 1
              ].location;
              var nextLocArr = ("" + nextCourseLocation).split("");
              var currentLocArr = ("" + currentCourseLocation).split("");
              console.log("current", currentLocArr);
              console.log("next", nextLocArr);
              if (currentLocArr[0] === nextLocArr[0]) {
                console.log("Course Completed - next course");
                this.$router.push(
                  `/dashboard/${this.$route.params.id}/${
                    this.$route.params.group
                  }/${this.$route.params.groupId}/${courseId + 1}`
                );
              }
            }
          }
        }
      }
    },
    async deleteComplete() {
      var delComplete = await Service.deleteGroupCourseCompletion(
        this.$route.params
      );
      this.complete = false;
      console.log(delComplete);
    },
    signOut() {
      this.$router.push(`/login`);
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



