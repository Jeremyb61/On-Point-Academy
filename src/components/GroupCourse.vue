<template>
  <div>
    <!-- Dashboard Header -->
    <v-toolbar dark color="success" app>
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

    <h1>{{ groupTitle }}, Course Component</h1>
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
      groupTitle: this.$route.params.group
    };
  },
  async created() {
    try {
      // Get User Data
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
        var groupData = await Service.getOtherGroups(this.$route.params.id, this.$route.params.group);
        this.groups = groupData.data.usersGroups.groups;
    },
    goToGroupCourse(courseId) {
        this.$router.push(`/dashboard/${this.$route.params.id}/${this.$route.params.group}/${courseId}`);
    }
  }
};
</script>
<style scoped>
</style>



