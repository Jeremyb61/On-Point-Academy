<template>
  <div>
    <!-- Dashboard Header -->
    <v-toolbar dark color="accent" app>
      <v-toolbar-side-icon @click="sideNavBar = !sideNavBar"></v-toolbar-side-icon>
      <v-toolbar-title class="text-uppercase white--text">On Point Academy</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
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
        <v-btn flat @click="backToDashboard">Dashboard</v-btn>
        <v-btn flat router to="/">Sign out</v-btn>
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
              <!-- <p v-for="(complete,index) in groupCourseCompletes" :key="index">
                <v-icon v-if="groupCourseId[index] === course.id[index] && groupParam === complete.groupId" color="success" right>done</v-icon>
              </p> -->
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
              </div>
              <div class="answers-div" v-for="chap in groupAnswers" :key="chap.id">
                <v-list two-line>
                  <template>
                    <v-subheader>
                      <h2>{{ chap.title }}</h2>
                    </v-subheader>
                    <v-divider></v-divider>

                    <div v-for="course in chap.group_courses" :key="course.id">
                      <v-list-tile
                        v-for="(question,index) in course.group_course_questions"
                        :key="question.id"
                      >
                        <v-list-tile-content 
                        v-if="question.question_content[index]"
                        ripple
                        >
                          <v-list-tile-title>{{ question.question_content }}</v-list-tile-title>
                          <v-list-tile-sub-title
                            v-for="answer in question.groups"
                            :key="answer.id"
                          >{{ answer.group_course_answers.answer_content }}
                          </v-list-tile-sub-title>
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
      groupParam: this.$route.params.groupId,
      sideNavBar: false,
      panel: [false],
      groups: [],
      groupAnswers: [],
      groupChapters: [],
      usersFirstname: "",
      currentGroup: {},
      groupCourseCompletes: []
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
      this.groups = groupData.data.usersGroups.groups;

      var answerData = await Service.getGroupQuestionsAnswers(to.params.group);
      this.groupAnswers = answerData.data.answers;
    //   console.log(this.groupAnswers);
    }
  },
  async created() {
    try {
      console.log(this.$route.params);
      // Get User Data
      var userData = await Service.getUserProfile(this.$route.params.id);
      this.usersFirstname = userData.data.user.first_name;

      // Get Current Group title
      var myGroup = await Service.getCurrentGroup(this.$route.params.group);
      this.currentGroup = myGroup.data.group;
    //   console.log(this.currentGroup);

      // Get all others groups that user belongs to
      var groupData = await Service.getOtherGroups(
        this.$route.params.id,
        this.$route.params.group
      );
      this.groups = groupData.data.usersGroups.groups;
      
      //Get all group course completes
      var groupCourseComplete = await Service.getGroupCourseCompletes(
        this.$route.params
      );
      this.groupCourseCompletes = groupCourseComplete.data.gCourseCompletes;
      console.log(groupCourseComplete.data.gCourseCompletes)

      // Get all Group chapters
      var groupChaptersData = await Service.getGroupChapters();
      this.groupChapters = groupChaptersData.data.data;


      var answerData = await Service.getGroupQuestionsAnswers(
        this.$route.params.group
      );
      this.groupAnswers = answerData.data.answers;
    //   console.log(this.groupAnswers);
    } catch (err) {
      console.log("ERROR", err);
    }
  },
  methods: {
    switchGroup(group) {
      this.$router.push(`/${this.$route.params.id}/${group}`);
    },
    goToGroupCourse(courseId) {
      this.$router.push(
        `/dashboard/${this.$route.params.id}/${
          this.$route.params.group
        }/${courseId}`
      );
    },
    backToDashboard() {
      this.$router.push(`/dashboard/${this.$route.params.id}`);
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


