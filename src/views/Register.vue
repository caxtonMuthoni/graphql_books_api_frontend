<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card mt-5">
          <div class="card-header"><strong>User Register</strong></div>
          <div class="card-body">
            <form>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon1"
                    ><i class="fas fa-user"></i
                  ></span>
                </div>
                <input
                  v-model="name"
                  type="text"
                  class="form-control"
                  placeholder="Username"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                  :class="{'is-invalid': validationErrors['input.name']}"
                />
              </div>
              <div v-if="validationErrors['input.name']" class="text-danger">
                {{validationErrors['input.name'][0]}}
              </div>
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
                 :class="{'is-invalid': validationErrors['input.email']}"
                />
              </div>
              <div v-if="validationErrors['input.email']" class="text-danger">
                {{validationErrors['input.email'][0]}}
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
                :class="{'is-invalid': validationErrors['input.password']}"
                />
              </div>
              <div v-if="validationErrors['input.password']" class="text-danger">
                {{validationErrors['input.password'][0]}}
              </div>
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon1"
                    ><i class="fas fa-lock-open"></i
                  ></span>
                </div>
                <input
                  v-model="c_password"
                  type="password"
                  class="form-control"
                  placeholder="Confrim Password"
                  aria-label="Confrim Password"
                  aria-describedby="basic-addon1"
                />
              </div>

              <a
                href="#"
                @click.prevent="register"
                class="btn btn-primary float-right"
                >Register</a
              >
            </form>
          </div>
          <div class="card-footer">
            <a href="/login">Already have an account? Login here</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import registerQuery from "@/graphql/Mutations/createUser.gql";
import { onLogin } from "../vue-apollo";
import Toast from '../toast'
export default {
  data() {
    return {
      name: "",
      email: "",
      password: "",
      c_password: "",
      validationErrors: {}
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
    register() {
      this.$apollo
        .mutate({
          mutation: registerQuery,
          variables: {
            input: {
              name: this.name,
              email: this.email,
              password: this.password,
              password_confirmation: this.c_password,
            },
          },
        })
        .then((data) => {
          const detail = data.data.register.tokens;
          onLogin(
            this.$apolloProvider.defaultClient,
            detail.access_token,
            detail.user
          );
          this.$emit("logout");
          
          Toast.fire({
            icon: 'info',
            title: 'Account created successfully !'
          })
          
          setTimeout(() => {
            this.$router.push("/");
          }, 2500);

        })
        .catch((error) => {
          let {graphQLErrors} = error
          if(graphQLErrors[0].extensions.validation){
             this.validationErrors = graphQLErrors[0].extensions.validation
          }
          console.log(graphQLErrors)
        });
    },
  },
};
</script>