<template>
  <div>
    <link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet">
    <v-toolbar app height="75px">
      <v-toolbar-title>
        <img src="https://res.cloudinary.com/ducvha2fk/image/upload/v1559515269/oplogo.png">
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn router to="/login" flat>Sign in</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-carousel prev-icon="mdi-arrow-left" next-icon="mdi-arrow-right" dark>
      <v-carousel-item v-for="(item,i) in items" :key="i" :src="item.src">
        <v-container fill-height>
          <v-layout align-center>
            <v-flex text-xs-center>
              <h1 class="display-2 white--text">{{ item.textOne }}!</h1>
            </v-flex>
          </v-layout>
        </v-container>
      </v-carousel-item>
    </v-carousel>
    <div class="customers">
      <div class="container">
        <div class="cust-logo" v-for="(logo,i) in custLogos" :key="i">
          <img :src="logo.src" alt>
        </div>
      </div>
    </div>
    <div class="container" id="c1">
      <div class="objectives">
        <img
          class="obj-icons"
          src="https://res.cloudinary.com/ducvha2fk/image/upload/v1559839959/Landing%20page%20icons/lpage-icon3.png"
          alt
        >
        <p class="subheading font-weight-black obj-header">Managing Expectations</p>
        <p
          style="text-align:justify; text-justify: inter-word;"
        >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce congue sagittis dignissim. Nam id dignissim purus. Maecenas gravida ante sit amet velit volutpat, eget dapibus ex tincidunt. Pellentesque suscipit turpis eu velit laoreet, sed eleifend mi facilisis. Praesent ullamcorper ligula vel odio fringilla, et consectetur massa ornare. Vivamus mauris mauris, ullamcorper a nibh eu, lobortis mollis dolor. Proin ferment</p>
        <v-btn round color="info">Read More</v-btn>
      </div>
      <hr color="#EEEEEE">
      <div class="objectives">
        <img
          class="obj-icons"
          src="https://res.cloudinary.com/ducvha2fk/image/upload/v1559839955/Landing%20page%20icons/lpage-icon2.png"
          alt
        >
        <p class="subheading font-weight-black obj-header">Enabling Others</p>
        <p
          style="text-align:justify; text-justify: inter-word;"
        >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce congue sagittis dignissim. Nam id dignissim purus. Maecenas gravida ante sit amet velit volutpat, eget dapibus ex tincidunt. Pellentesque suscipit turpis eu velit laoreet, sed eleifend mi facilisis. Praesent ullamcorper ligula vel odio fringilla, et consectetur massa ornare. Vivamus mauris mauris, ullamcorper a nibh eu, lobortis mollis dolor. Proin ferment</p>
        <v-btn round color="info">Read More</v-btn>
      </div>
      <hr color="#EEEEEE">
      <div class="objectives">
        <img
          class="obj-icons"
          src="https://res.cloudinary.com/ducvha2fk/image/upload/v1559839819/Landing%20page%20icons/lpage-icon1.png"
          alt
        >
        <p class="subheading font-weight-black obj-header">Culture 101</p>
        <p
          style="text-align:justify; text-justify: inter-word;"
        >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce congue sagittis dignissim. Nam id dignissim purus. Maecenas gravida ante sit amet velit volutpat, eget dapibus ex tincidunt. Pellentesque suscipit turpis eu velit laoreet, sed eleifend mi facilisis. Praesent ullamcorper ligula vel odio fringilla, et consectetur massa ornare. Vivamus mauris mauris, ullamcorper a nibh eu, lobortis mollis dolor. Proin ferment</p>
        <v-btn round color="info">Read More</v-btn>
      </div>
      <hr color="#EEEEEE">
      <div class="objectives">
        <img
          class="obj-icons"
          src="https://res.cloudinary.com/ducvha2fk/image/upload/v1559839819/Landing%20page%20icons/lpage-icon1.png"
          alt
        >
        <p class="subheading font-weight-black obj-header">Culture 101</p>
        <p
          style="text-align:justify; text-justify: inter-word;"
        >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce congue sagittis dignissim. Nam id dignissim purus. Maecenas gravida ante sit amet velit volutpat, eget dapibus ex tincidunt. Pellentesque suscipit turpis eu velit laoreet, sed eleifend mi facilisis. Praesent ullamcorper ligula vel odio fringilla, et consectetur massa ornare. Vivamus mauris mauris, ullamcorper a nibh eu, lobortis mollis dolor. Proin ferment</p>
        <v-btn round color="info">Read More</v-btn>
      </div>
    </div>
    <!-- Coach Bios -->
    <div class="bio">
      <!-- Kathleen -->
      <div class="coach">
        <img
          class="bio-img"
          src="https://res.cloudinary.com/ducvha2fk/image/upload/v1559928006/lpage-bio/kathleen-joy.webp"
        >
        <div class="coach-desc">
          <p class="display-1 coach-name">Kathleen Joy</p>
          <p class="title">Executive Coach and Leadership Consultant</p>
          <p class="font-weight-medium font-italic">Specializing in Change management and Creativity</p>
          <p
            class="title"
          >“I believe humans are incredibly adaptable. We are designed to find creative solutions to impossible situations.”</p>
          <p
            class="coach-para body-1"
          >Kathi is in the service of bringing out the inspired brilliance in leaders, teams, and organizations that wish to fulfill their wildest dreams.</p>
          <p
            class="coach-para body-1"
          >Kathi has consulted to senior leaders, teams and divisions in Fortune 500, mid-size and start-up companies in the USA and Europe. She’s worked in a variety of industries including healthcare, finance, high tech, and bio tech. Kathi’s clients are high performing; smart, driven professionals and organizations who want to have purpose, innovation and impact with their work. They influence, manage and guide the work lives of others and are responsible for critical organizational outcomes. After 20+ years of experience working with leaders globally, there are a few things Kathi has noticed. Few people use all the resources and intelligences available to them to get want they really desire. Kathi has identified the 4 major intelligences needed and developed a methodology to create individual, collective and cultural brilliance so they can create consciously and fully.</p>
          <p
            class="coach-para body-1"
          >Kathi holds a MA in Organizational Development from The California Institute of Integral Studies and a BA in Public Relations from the University of Michigan. She completed graduate-level work in Cross-Cultural Studies at the Universite de Lyon II while working in France for several years.</p>
          <p
            class="coach-para body-1"
          >Kathi has the pleasure of living in the San Francisco area with her two blooming daughters and a 50 pound ‘lap dog’ named Coco</p>
          <p class="coach-para body-1">
            <span style="color:#6E2000;">MASTER STATUS:</span> Executives in Transition, Executive Presence, Multi-Intelligence Approach to Development and Problem Solving, Subtle Body Assessment and Practice Plans
          </p>
        </div>
      </div>
      <!-- Saara -->
      <div class="coach" style="margin-top:30px;">
        <div class="coach-desc">
          <p class="display-1 coach-name">Saara Robles</p>
          <p class="title">Executive Coach and Leadership Consultant</p>
          <p
            class="font-weight-medium font-italic"
          >Specializing in Executive and Leadership Team Development and Equine-Guided Leadership</p>
          <p
            class="title"
          >"True leadership is knowing when to step forward and when to step back; when to lean in and when to give space for others to take center stage. It's about knowing how to leverage the very best from your team."</p>
          <p
            class="coach-para body-1"
          >Saara believes that you cannot serve the world or others at your highest level, until you know who you are and how you impact the world.Kathi is in the service of bringing out the inspired brilliance in leaders, teams, and organizations that wish to fulfill their wildest dreams.</p>
          <p
            class="coach-para body-1"
          >Saara’s executive leadership and teamwork spans over 25 years. Her direct, pragmatic approach creates the best environment for others to rise to their best levels of leadership, whether that’s for work, community, family or in service to making the world a better place. Saara has worked in every type of business and industry with leaders across the globe partnering to enable their greatest contributions to the organizations and teams they lead. Her view is that knowing oneself first is an underpinning that creates leaders who are their most satisfied, productive, real selves.</p>
          <p
            class="coach-para body-1"
          >She is committed to people finding joy in their work, no matter the level, environment or role. Her mantra remains ‘if people are to have passion for what they do, then going to work each day shouldn’t be a chore, it should be an opportunity’.</p>

          <p class="coach-para body-1">
            <span style="color:#6E2000;">MASTER STATUS:</span>
            Leading Large Scale Change, Transforming Culture, Inclusionary Engagement, Executive Presence, Guiding Teams to Their Top Performance, Developing Leaders Who Others Love to Follow
          </p>
        </div>
        <img
          class="bio-img"
          src="https://res.cloudinary.com/ducvha2fk/image/upload/v1559943938/lpage-bio/saara-opa.webp"
        >
      </div>
    </div>
    <v-footer dark height="auto">
      <v-card class="flex" flat tile>
        <v-spacer></v-spacer>

        <v-card-actions class="grey darken-3 justify-center">
          &copy;2019 —
          <strong>On Point Academy</strong>
        </v-card-actions>
      </v-card>
    </v-footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          src: "https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg",
          textOne: "Text for image 1"
        },
        {
          src: "https://cdn.vuetifyjs.com/images/carousel/sky.jpg",
          textOne: "Text for image 2"
        },
        {
          src: "https://cdn.vuetifyjs.com/images/carousel/bird.jpg",
          textOne: "Text for image 3"
        },
        {
          src: "https://cdn.vuetifyjs.com/images/carousel/planet.jpg",
          textOne: "Text for image 4"
        }
      ],
      custLogos: [
        {
          src:
            "https://res.cloudinary.com/ducvha2fk/image/upload/v1559760555/customers%20we%27ve%20work%20with/google_logo.png"
        },
        {
          src:
            "https://res.cloudinary.com/ducvha2fk/image/upload/v1559760545/customers%20we%27ve%20work%20with/apple_logo.png"
        },
        {
          src:
            "https://res.cloudinary.com/ducvha2fk/image/upload/v1559761643/customers%20we%27ve%20work%20with/peets_logo.png"
        },
        {
          src:
            "https://res.cloudinary.com/ducvha2fk/image/upload/v1559761632/customers%20we%27ve%20work%20with/js_logo.png"
        },
        {
          src:
            "https://res.cloudinary.com/ducvha2fk/image/upload/v1559761638/customers%20we%27ve%20work%20with/python_logo.png"
        },
        {
          src:
            "https://res.cloudinary.com/ducvha2fk/image/upload/v1559761844/customers%20we%27ve%20work%20with/mysql_logo.png"
        }
      ]
    };
  }
};
</script>

<style>
.container {
  margin: auto;
}
#c1 {
  width: 68%;
}
.customers {
  text-align: center;
  width: 100%;
  min-height: 100px;
  background-color: #e0e0e0;
  padding-top: 5px;
  box-shadow: 5px 1px 10px 1px #888888;
}
.cust-title {
  text-align: center;
}
.cust-logo {
  display: inline-block;
  vertical-align: top;
  width: 90px;
  padding-top: 10px;
  margin-left: 60px;
}
img {
  width: 100%;
}
.bio {
  width: 90%;
  margin: auto;
}
.objectives {
  text-align: center;
  padding: 10px;
  width: 48%;
  min-height: 400px;
  display: inline-block;
  vertical-align: top;
  margin-left: 10px;
}
.obj-icons {
  width: 75px;
}
.obj-header {
  margin-top: 25px;
}
hr {
  display: none;
}
.coach {
  min-height: 300px;
  width: 100%;
  margin-bottom: 30px;
  padding-left: 10%;
}
.coach .coach-desc {
  display: inline-block;
  vertical-align: top;
  margin-left: 30px;
  width: 40%;
}
.coach .coach-desc .coach-name {
  color: #6e2000;
}

.coach .coach-desc .coach-para {
  font-family: "Montserrat", sans-serif;
}
.bio-img {
  width: 550px;
}
@media only screen and (max-width: 1210px) {
  .coach {
    text-align: center;
    padding:0px;
  }
  .coach .coach-desc {
    width: 100%;
    margin-left: 0px;
    padding-left:23px;
    padding-right:23px;
  }
}
@media only screen and (max-width: 835px) {
  .objectives {
    width: 95%;
    min-height: 200px;
  }
  .container {
    text-align: center;
  }
  hr {
    display: block;
    background-color: greenyellow;
  }
}
</style>
