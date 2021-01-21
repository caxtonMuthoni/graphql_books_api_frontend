<template>
  <div class="">
    <div class="container">
      <ApolloQuery :query="bookQuery" :variables="{ id: $route.params.id }">
        <template v-slot="{ result: { loading, error, data }, isLoading }">
          <!-- Loading -->
          <div v-if="loading | isLoading" class="loading apollo mt-5">
            <vue-loaders
              class="mt-5"
              name="ball-spin-fade-loader"
              color="red"
              scale="1"
            ></vue-loaders>
          </div>

          <!-- Error -->
          <div v-else-if="error" class="error apollo">An error occurred</div>

          <!-- Result -->
          <div v-else-if="data" class="result apollo categories py-3 my-3">
            <div class="row">
              <div class="col-md-4">
                <img class="book-image" :src="data.book.image" alt="" />
              </div>
              <div class="col-md-8 text-left">
                <div class="mt-5">
                  <strong class="mt-5 pt-5">{{ data.book.title }}</strong> <br>
                  <span> &nbsp;</span>
                  <span class="mr-5 text-primary"> <b class="text-dark"> Authoured by:</b> {{ data.book.author }}</span>
                  <span class="text-success"><b class="text-dark">Published at: </b><small>{{ data.book.created_at }}</small></span>
                  <p class="my-2">{{ data.book.description }}</p>
                  <span class="mr-5 text-primary"><b class="text-dark">Category:</b> {{ data.book.category.name }}</span>
                  <span class="mx-5 text-success"><b class="text-dark">Published by:</b> {{ data.book.user.name }}</span>
                </div>
                <div class="mt-5" v-if="authUserId">
                  <a
                    :href="data.book.link"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-success btn-sm"
                  >
                    <i class="fas fa-link"></i> view
                  </a>
                  <a
                    v-if="authUserId === data.book.user.id"
                    href="#"
                    @click.prevent="showEditModal"
                    class="btn btn-info btn-sm mx-3"
                    ><span><i class="fas fa-edit mr-2"></i></span> Edit</a
                  >

                  <a
                    v-if="authUserId === data.book.user.id"
                    href=""
                    @click.prevent="deleteBook"
                    class="btn btn-danger btn-sm"
                    ><i class="fas fa-trash mr-2"></i> delete</a
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- No result -->
          <div v-else class="no-result apollo">No result :(</div>

          <!-- Editing Modal -->
          <div
            class="modal fade"
            id="editing-modal"
            tabindex="-1"
            role="dialog"
            aria-labelledby="modelTitleId"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-lg" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 v-if="data" class="modal-title">
                    Editing {{ data.book.title }}
                  </h5>
                  <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <add-book @close-add-modal="closeModal" :isUpdate="true" />
              </div>
            </div>
          </div>
        </template>
      </ApolloQuery>
    </div>
  </div>
</template>

<script>
import bookQuery from "@/graphql/Queries/book.gql";
import deleteBook from "@/graphql/Mutations/deleteBook.gql";
import AddBook from "@/components/AddBook.vue";
import $ from "jquery";
export default {
  components: { AddBook },
  data() {
    return {
      bookQuery,
      id: 1,
      title: "",
      authUserId: null
    };
  },

  mounted() {
    this.getUserId()
  },

  methods: {
    getUserId(){
       const user = JSON.parse(localStorage.getItem('user'));

       this.authUserId = user.id
    },

    closeModal() {
      $("#editing-modal").modal("hide");
    },

    showEditModal() {
      $("#editing-modal").modal("show");
    },
    deleteBook() {
      this.$swal
        .fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.$apollo
              .mutate({
                mutation: deleteBook,
                variables: {
                  id: this.$route.params.id,
                },
              })
              .then((data) => {
                console.log(data);
                this.$swal.fire(
                  "Deleted!",
                  "Your file has been deleted.",
                  "success"
                );
                this.$router.push("/");
              })
              .catch((error) => {
                console.error(error);
              });
          }
        });
    },
  },
};
</script>

<style scoped>
.book-image {
  width: 80%;
  height: auto;
}
</style>
