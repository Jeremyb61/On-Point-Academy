<template>
  <div>
    <!-- Dashboard Header -->
    <v-toolbar dark color="secondary" app>
      <v-toolbar-side-icon @click="sideNavBar = !sideNavBar"></v-toolbar-side-icon>
      <v-toolbar-title class="text-uppercase white--text">On Point Academy</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-menu>
          <template #activator="{ on: menu }">
            <v-btn flat v-on="{ ...menu }">Your Groups</v-btn>
          </template>
          <v-list>
            <div v-for="(group, index) in groups" :key="index">
              <v-list-tile @click="goToGroup(group.title)">
                <v-list-tile-title>{{ group.title }}</v-list-tile-title>
              </v-list-tile>
            </div>
          </v-list>
        </v-menu>
        <v-menu>
          <template #activator="{ on: menu }">
            <v-btn flat v-on="{ ...menu }">Settings</v-btn>
          </template>
          <v-list>
            <div>
              <v-list-tile @click="goToUploadImage">
                <v-list-tile-title>Change Profile Picture</v-list-tile-title>
              </v-list-tile>
            </div>
          </v-list>
        </v-menu>
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
      <h1>{{ user.first_name }}'s User Dashboard</h1>
      <!-- <img class="profile-pic" src='../assets/uploads/image-1558408989537.png' > -->
        {{ overallProgress }}
      <div class="main-icon-div">
        <v-img class="profile-pic" :src="this.image"></v-img>
        <!-- <img class="main-icon" src="../assets/icons/rocket.png" alt="Image not loading"> -->
      </div>

      <div class="icon-wrapper" v-for="(chapter,index) in personalChapters" :key="chapter.id">
        <div class="course-icon" @click="goToAnswerPage(chapter.id)">
          <!-- <img style="width:115%;" src="../assets/icons/icon6.png" alt="Image not loading"> -->
          {{progress[index]}}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Service from "../Service";
// import profileImage from this.user.image

export default {
  name: "Dashboard",
  data() {
    return {
      sideNavBar: false,
      panel: [false],
      user: {},
      personalChapters: [],
      groups: [],
      image:'',
      progress: [],
      overallProgress: "",
      userIcons:[],
      icons:[{
          ch1:{ic1:'icon1.png',ic2:'icon2.png',ic3:'icon3.png',ic4:'icon4.png',ic5:'icon5.png',ic6:'icon6.png'},
          ch2:{ic1:'icon1.png',ic2:'icon2.png',ic3:'icon3.png',ic4:'icon4.png',ic5:'icon5.png'},
          ch3:{ic1:'icon1.png',ic2:'icon2.png',ic3:'icon3.png',ic4:'icon4.png',ic5:'icon5.png'},
          ch4:{ic1:'icon1.png',ic2:'icon2.png',ic3:'icon3.png',ic4:'icon4.png',ic5:'icon5.png'},
          ch5:{ic1:'icon1.png',ic2:'icon2.png',ic3:'icon3.png',ic4:'icon4.png',ic5:'icon5.png'},
          ch6:{ic1:'icon1.png',ic2:'icon2.png',ic3:'icon3.png',ic4:'icon4.png',ic5:'icon5.png'},
          ch7:{ic1:'icon1.png',ic2:'icon2.png',ic3:'icon3.png',ic4:'icon4.png',ic5:'icon5.png'},
      
          }]
    };
  },
  async created() {
    try {
      // Get User Data
      var userData = await Service.getUserProfile(this.$route.params.id);
      this.user = userData.data.user;
      this.image = userData.data.user.image;
    //   this.image = userData.data.user.image;
 

      // Get all personal chapters and courses
      var personalChaptersData = await Service.getPersonalChapters();
      this.personalChapters = personalChaptersData.data.data;

      // Get all groups that this user belongs to
      var groupData = await Service.getGroups(this.$route.params.id);
      this.groups = groupData.data.usersGroups.groups;

      //Get all personal course completes
      var userTotal = 0;
      var courseTotal = 0;
      for (var i in this.personalChapters) {
        var getCompletes = await Service.getCompletes(
          this.$route.params.id,
          this.personalChapters[i].id
        );

        userTotal += getCompletes.data.user.count;
        courseTotal += getCompletes.data.courses.count;
        this.overallProgress = `${userTotal}/${courseTotal}`;

        var completes = `${getCompletes.data.user.count}/${getCompletes.data.courses.count}`;
        this.progress.push(completes);

        // if(i==0 && getCompletes.data.user.count==5) {
        //     this.userIcons.push(this.icons[0].ch1.ic1);
        // } else if (i===0 && getCompletes.data.user.count==6) {
        //     this.userIcons.push(this.icons[0].ch1.ic6);
        // }
      }
      
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    goToGroup(groupTitle) {
      this.$router.push(`/${this.$route.params.id}/${groupTitle}`);
    },
    goToCourse(courseId) {
      this.$router.push(`/dashboard/${this.$route.params.id}/${courseId}`);
    },
    goToUploadImage() {
      this.$router.push(`/dashboard/${this.$route.params.id}/upload`);
    },
    goToAnswerPage(courseId) {
      this.$router.push(
        `/dashboard/${this.$route.params.id}/summary/${courseId}`
      );
    },
    // getImg(image) {
    //     // console.log('#%$#@%$#',image)
    //     return require(image);
    // }
  }
};
</script>
<style scoped>
.main-icon-div {
  border: 1px solid black;
  border-radius: 100px;
  height: 200px;
  width: 200px;
  margin: auto;
  display: block;
}
.profile-pic {
    width:100%;
    border-radius: 100px;
    height: 100%;
}
.main-icon {
  width: 100%;
}
.course-icon {
  border: 1px solid black;
  border-radius: 75px;
  height: 100px;
  width: 100px;
  display: inline-block;
  vertical-align: top;
}
.icon-wrapper {
  display: inline-block;
  vertical-align: top;
  margin-left: 4.8%;
  margin-top: 4%;
}
.icons {
  width: 10%;
  position: absolute;
}
</style>


