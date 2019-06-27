<template>
  <div class="home">
    <div class="login">
      <header class="header">
        <span class="display-1 font-weight-thin black--text"><b>OnPoint</b> Academy</span>
      </header>
      <form @submit.prevent="login">
        <span class="headline font-weight-thin black--text"><b>Login</b></span>
        <div class="divError">
          <p v-if="error" class="error">{{ error }}</p>
        </div>
        <div class="form-group">
          <input type="text" placeholder="Username" v-model="userName" autocomplete="userName">
        </div>
        <div class="form-group">
          <input type="password" placeholder="Password" v-model="password" autocomplete="password">
        </div>
        <input type="submit">
      </form>

      <p class="reg-page black--text">
        Don't have an account?
        <router-link class="black--text" to="/register">Sign Up</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import Service from "../Service";
export default {
  name: "Login",
  data() {
    return {
      userName: "",
      password: "",
      error: ""
    };
  },
  watch: {
    async $route(to, from) {
      this.$$router.push('/login')
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
  methods: {
    async login() {
      if (this.userName === "" || this.password === "") {
        this.error = "Fields cannot be blank";
      } else {
        const user = {
          username: this.userName,
          password: this.password
        };
        var loginData = await Service.login(user);
        console.log(loginData);
        if (loginData.data.status === false) {
          this.error = loginData.data.msg;
        }  else {
            this.$router.push(`/dashboard/${loginData.data.user.id}`);
        }
      }
    }
  }
};
</script>

<style scoped>
.home {
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-image: url(../assets/groupbg.jpg);
  padding-top: 95px;
}
.header {
  color: #fefefe;
  text-align: center;
  padding: 10px;
  margin-bottom: 0px;
}
.header img {
  width: 35px;
  margin-left: -30px;
}
h1 {
  display: inline-block;
}
h1,
h2 {
  font-family: Arial, Helvetica, sans-serif;
  color: white;
}
.login {
  background-color: rgb(192, 192, 192, 0.7);
  text-align: center;
  margin: auto;
  width: 375px;
  min-height: 360px;
  border-radius: 11px;
  padding-top: 40px;
  padding-bottom: 50px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.divError {
  min-height: 1px;
}
.error {
  border: 1px solid #ff5b5f;
  background-color: #ffc5c1;
  color:white;
  padding: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
  margin-left: 20%;
  border-radius: 5px;
  width: 60%;
}

input[type="text"] {
  background-color: rgb(192, 192, 192, 0.05);
  padding: 5px;
  width: 54%;
  margin-top: 20px;
  border: 1px solid black;
  color: black;
}

input[type="password"] {
  background-color: rgb(192, 192, 192, 0.05);
  padding: 5px;
  width: 54%;
  margin-top: 20px;
  border: 1px solid black;
  color: black;
}
::-webkit-input-placeholder {
  /* Chrome/Opera/Safari */
  color: black;
}
input[type="submit"] {
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  width: 54%;
  color: white;
  padding: 8px;
  margin: 10px;
}
.reg-page {
  margin-top: 20px;
  color: #fefefe;
}
a {
  color: #fefefe;
}
@media only screen and (max-width: 450px) {
  .login {
    background-color: rgb(192, 192, 192, 0.3);
    text-align: center;
    width: 100%;
    height: 100vh;
    padding-top: 40px;
    background-size: cover;
    background-image: url(../assets/groupbg.jpg);
  }
  .home {
    padding: 0px;
  }
  .header {
    margin-top: 8%;
  }
}
</style>
