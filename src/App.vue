<template>
  <div id="app">
    <nav
      class="navbar navbar-expand-lg navbar-dark bg-color fixed-top mb-0 justify-content-between"
    >
      <div class="container-fluid">
        <a class="navbar-brand mr-auto" href="/"
          ><i class="fas fa-book mr-3"></i>Books Home</a
        >
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarText"
          aria-controls="navbarText"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarText">
          <ul v-if="isLoggedIn" class="logged in navbar-nav ml-auto">
            <li class="nav-item">
              <a class="nav-link" href="#">
                <i class="fas fa-user"></i> <Strong>{{ user.name }}</Strong></a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="logout">
                <i class="fas fa-power-off text-danger"></i> Logout</a
              >
            </li>
          </ul>
          <ul v-else class="logged out navbar-nav ml-auto">
            <li class="nav-item">
              <a class="nav-link" href="/register">
                <i class="fas fa-registered"></i> Register</a
              >
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/login">
                <i class="fas fa-lock"></i> Login</a
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="content">
      <router-view @logout="getToken" />
    </div>
  </div>
</template>

<script>
import logoutMutation from "@/graphql/Mutations/logout.gql";
import { onLogout } from "./vue-apollo";
export default {
  data() {
    return {
      isLoggedIn: false,
      user: {},
    };
  },

  mounted() {
    this.getToken();
    this.$on("logout", () => {
      this.getToken();
    });
  },

  methods: {
    getToken() {
      const token = localStorage.getItem("apollo-token");
      if (token) {
        this.user = JSON.parse(localStorage.getItem("user"));
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    },

    logout() {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "You want to logout!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, logout!",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.$apollo
              .mutate({
                mutation: logoutMutation,
              })
              .then(() => {
                onLogout(this.$apolloProvider.defaultClient);
                this.$emit("logout");
                this.$router.push("/");
              });
          }
        });
    },
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400&display=swap");
#app {
  font-family: "Lato", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

p {
  line-height: 140%;
  font-family: "Lato", Helvetica, Arial, sans-serif;
  font-size: 18px;
}

.content {
  position: relative;
  top: 80px;
}

.bg-color {
  background: #3498dbbd;
  min-height: 80px;
  margin: 0;
}
</style>
