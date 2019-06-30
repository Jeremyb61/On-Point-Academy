<template>
  <div>
    <!-- Dashboard Header -->
    <v-toolbar dark color="black" app>
      <v-toolbar-side-icon @click="sideNavBar = !sideNavBar"></v-toolbar-side-icon>
      <img style="width:192px" src="https://res.cloudinary.com/ducvha2fk/image/upload/v1559515269/oplogo.png">
      <v-spacer></v-spacer>
      <v-toolbar-items>
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
        <v-btn flat @click="backToDashboard">Dashboard</v-btn>
        <v-btn flat @click="signOut">Sign out</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <!-- End Header -->

    <!-- Side Nav Bar  -->
    <v-navigation-drawer width="220" v-model="sideNavBar" app class="grey darken-3" temporary>
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
    <div class="container">
      <v-container grid-list-xl>
        <v-layout wrap>
          <v-flex>
            <v-sheet elevation="8" class="mx-auto" min-height="500" width="100%">
              <div style="text-align:center;">
                <img :src="currentGroup.icon">
                <h1 style="font-weight:300">The {{currentGroup.title}} Group Change Plan</h1>
              </div>
              <div class="answers-div" v-for="chap in groupQuestions" :key="chap.id">
                <v-list two-line>
                  <template>
                    <v-subheader>
                      <h2 style="font-weight:300">{{ chap.title }}</h2>
                    </v-subheader>
                    <v-divider></v-divider>

                    <div v-for="course in chap.group_courses" :key="course.id">
                      <v-list-tile
                        v-for="(question,index) in course.group_course_questions"
                        :key="question.id"
                      >
                        <v-list-tile-content v-if="question.question_content[index]" ripple>
                          <v-list-tile-title>{{ question.question_content }}</v-list-tile-title>
                          <div v-for="answer in groupAnswers" :key="answer.id">
                            <v-list-tile-sub-title
                              v-if="answer.groupCourseQuestionId == question.id"
                            >{{ answer.answer_content }}</v-list-tile-sub-title>
                          </div>
                        </v-list-tile-content>
                      </v-list-tile>
                    </div>
                  </template>
                </v-list>

                <hr>
              </div>
            </v-sheet>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>
<script>
import Service from "../Service";

export default {
  name: "GroupDashboard",
  data() {
    return {
      userParam: this.$route.params.id,
      groupParam: this.$route.params.groupId,
      sideNavBar: false,
      panel: [false],
      groups: [],
      groupQuestions: [],
      groupAnswers: [],
      groupChapters: [],
      usersFirstname: "",
      currentGroup: {},
      groupCompletes: [],
      denied: true,
      otherGroupStatus: true
    };
  },
  watch: {
    async $route(to, from) {
      var myGroup = await Service.getCurrentGroup(to.params.group);
      //   console.log(myGroup);
      this.currentGroup = myGroup.data.group;

      var groupData = await Service.getOtherGroups(
        this.$route.params.id,
        to.params.group
      );
      if (groupData.data.status === false) {
        this.otherGroupStatus = false;
      } else {
        this.groups = groupData.data.usersGroups.groups;
      }
      var answerData = await Service.getGroupQuestionsAnswers(
        this.$route.params
      );
      this.groupQuestions = answerData.data.questions;
      this.groupAnswers = answerData.data.answers;

      var groupCourseComplete = await Service.getGroupCourseCompletes(
        this.$route.params
      );
      this.groupCompletes = groupCourseComplete.data.completes;
    }
  },
  async created() {
    try {
      // Get User Data
      var userData = await Service.getUserProfile(this.$route.params.id);

      if (userData.data.error) {
        this.$router.push("/login");
      } else {
        if (userData.data.user.groups.length === 0) {
          this.$router.push(`/dashboard/${this.$route.params.id}/`);
        } else {
          for (var i in userData.data.user.groups) {
      
            if (userData.data.user.groups[i].id == this.$route.params.groupId) {
              this.denied = false;
            }
          }
        }
        if (this.denied == true) {
          this.$router.push(`/dashboard/${this.$route.params.id}/`);
        }

        // Get Current Group title
        var myGroup = await Service.getCurrentGroup(this.$route.params.group);
        this.currentGroup = myGroup.data.group;

        // Get all others groups that user belongs to
        var groupData = await Service.getOtherGroups(
          this.$route.params.id,
          this.$route.params.group
        );
        if (groupData.data.status === false) {
          this.otherGroupStatus = false;
        } else {
          this.groups = groupData.data.usersGroups.groups;
        }
        //Get all group course completes
        var groupCourseComplete = await Service.getGroupCourseCompletes(
          this.$route.params
        );
        this.groupCompletes = groupCourseComplete.data.completes;

        // Get all Group chapters
        var groupChaptersData = await Service.getGroupChapters();
        this.groupChapters = groupChaptersData.data.data;

        var answerData = await Service.getGroupQuestionsAnswers(
          this.$route.params
        );
        this.groupQuestions = answerData.data.questions;
        this.groupAnswers = answerData.data.answers;
        //   console.log(this.groupAnswers);
      }
    } catch (err) {
      console.log("ERROR", err);
    }
  },
  methods: {
    switchGroup(groupTitle, groupId) {
      this.$router.push(
        `/group-dashboard/${this.$route.params.id}/${groupId}/${groupTitle}`
      );
    },
    goToGroupCourse(courseId) {
      this.$router.push(
        `/dashboard/${this.$route.params.id}/${this.$route.params.group}/${
          this.$route.params.groupId
        }/${courseId}`
      );
    },
    backToDashboard() {
      this.$router.push(`/dashboard/${this.$route.params.id}`);
    },
    signOut() {
      this.$router.push(`/login`);
    }
  }
};
</script>
<style scoped>
.answers-div {
  min-height: 100px;
  padding: 25px;
}
.answer {
  margin-top: 15px;
  min-height: 57px;
}
img {
  width: 200px;
}
</style>


