<template>
  <div>
    <h1>Register Users</h1>
    <form @submit.prevent="register">
      <div class="divError" v-for="error in errors" v-bind:key="error.message">
        <p v-if="error" class="error">{{ error.message }}</p>
      </div>
      <div class="divError">
        <p v-if="error" class="error">{{ error }}</p>
      </div>
      <div class="form-group">
        <p>
          Username:
          <input type="text" placeholder="Username" v-model="userName" autocomplete="username">
        </p>
      </div>
      <div class="form-group">
        <p>
          First Name:
          <input type="text" placeholder="First Name" v-model="firstName" autocomplete="firstName">
        </p>
      </div>
      <div class="form-group">
        <p>
          Last Name:
          <input type="text" placeholder="Last Name" v-model="lastName" autocomplete="lastName">
        </p>
      </div>
      <div class="form-group">
        <p>
          Email:
          <input type="text" placeholder="Email" v-model="email" autocomplete="email">
        </p>
      </div>
      <div class="form-group">
        <p>
          Password:
          <input type="password" placeholder="Password" v-model="password" autocomplete="password">
        </p>
      </div>
      <div class="form-group">
        <p>
          Confirm Password:
          <input
            type="password"
            placeholder="Confirm Password"
            v-model="confirmPassword"
            autocomplete="confirmPassword"
          >
        </p>
      </div>
      <input type="submit">
    </form>
  </div>
</template>
<script>
import Service from "../Service";
export default {
  name: "Register",
  data() {
    return {
      userName: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      error: "",
      errors: []
    };
  },
  methods: {
    async register() {
      if (
        this.userName == "" ||
        this.password == "" ||
        this.confirmPassword == ""
      ) {
        this.error = "Fields cannot be blank";
      } else if (this.password != this.confirmPassword) {
        this.error = "Passwords must match";
        this.password = "";
        this.confirmPassword = "";
      } else if (this.password.length < 8) {
        this.error = "Password must be 8 or more characters";
      } else {
        this.firstName =
          this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1);
        this.lastName =
          this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1);
        const newUser = {
          username: this.userName,
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
          confirmPassword: this.confirmPassword
        };
        (this.userName = ""),
          (this.firstName = ""),
          (this.lastName = ""),
          (this.email = ""),
          (this.password = ""),
          (this.confirmPassword = "");
        var data = await Service.register(newUser);

        if (data.data.error) {
          for (var i = 0; i < data.data.error.errors.length; i++) {
            this.errors = data.data.error.errors;
          }
        }
        if (data.data.status === false) {
          this.error = data.data.msg;
        }
      }
    }
  }
};
</script>
<style scoped>
</style>

