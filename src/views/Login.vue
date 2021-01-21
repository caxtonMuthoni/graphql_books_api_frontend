<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card mt-5">
          <div class="card-header"><strong>User Login</strong></div>
          <div class="card-body">
            <form>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon1"
                    ><i class="fas fa-envelope"></i
                  ></span>
                </div>
                <input
                  v-model="email"
                  type="email"
                  class="form-control"
                  placeholder="Email address"
                  aria-label="Email address"
                  aria-describedby="basic-addon1"
                />
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon1"
                    ><i class="fas fa-lock"></i
                  ></span>
                </div>
                <input
                  v-model="password"
                  type="password"
                  class="form-control"
                  placeholder="Password"
                  aria-label="Password"
                  aria-describedby="basic-addon1"
                />
              </div>

          <vue-loaders
            v-if="isLoging"
            class="float-right"
            name="pacman"
            color="red"
            scale="1"
          ></vue-loaders>

              <a
                v-else
                href="#"
                @click.prevent="login"
                class="btn btn-primary float-right"
                >Login</a
              >
            </form>
          </div>
          <div class="card-footer">
            <a href="/register">Don't have an account? create one here</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import loginMutation from "@/graphql/Mutations/login.gql";
import { onLogin } from "../vue-apollo";
export default {
  data() {
    return {
      email: "",
      password: "",
      isLoging: false
    };
  },
  beforeRouteEnter(to, from, next) {
    var isAuthenticated = false;
    if (localStorage.getItem("apollo-token")) isAuthenticated = true;
    else isAuthenticated = false;
    if (isAuthenticated) {
      next("/"); // allow to enter route
    } else {
      next(); // go to '/login';
    }
  },
  methods: {
    login() {
      this.isLoging = true
      this.$apollo
        .mutate({
          mutation: loginMutation,
          variables: {
            input: {
              username: this.email,
              password: this.password,
            },
          },
        })
        .then((data) => {
          onLogin(
            this.$apolloProvider.defaultClient,
            data.data.login.access_token,
            data.data.login.user
          );
          this.isLoging = false
          this.$emit("logout");
          this.$router.push("/");
        })
        .catch((error) => {
          this.isLoging = false
          let {graphQLErrors} = error
          this.$swal.fire({
            icon: 'error',
            title: 'Authentication Error',
            text: graphQLErrors[0].extensions.reason
          })
        });
    },
  },
};
</script>