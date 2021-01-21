<template>
  <div class="container">
    <form @submit.prevent="isUpdate ? updateBook() : addBook()">
      <div class="modal-body">
        <div class="row">
          <div class="col-md-6">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1"
                  ><i class="fas fa-book"></i
                ></span>
              </div>
              <input
                type="text"
                class="form-control"
                placeholder="Book Title"
                v-model="title"
                aria-label="Bool title"
                aria-describedby="basic-addon1"
                required
                :class="{ 'is-invalid': validationErrors.title }"
              />
            </div>
            <div v-if="validationErrors.title" class="text-danger">
              {{ validationErrors.title[0] }}
            </div>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1"
                  ><i class="fas fa-user"></i
                ></span>
              </div>
              <input
                type="text"
                v-model="author"
                class="form-control"
                placeholder="Book author"
                aria-label="Book author"
                aria-describedby="basic-addon1"
                required
                :class="{ 'is-invalid': validationErrors.author }"
              />
            </div>
            <div v-if="validationErrors.author" class="text-danger">
              {{ validationErrors.author[0] }}
            </div>

            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1"
                  ><i class="fas fa-link"></i>
                </span>
              </div>
              <input
                type="text"
                v-model="link"
                class="form-control"
                placeholder="Book link"
                aria-label="Book link"
                aria-describedby="basic-addon1"
                required
                :class="{ 'is-invalid': validationErrors.link }"
              />
            </div>
            <div v-if="validationErrors.link" class="text-danger">
              {{ validationErrors.link[0] }}
            </div>
          </div>

          <div class="col-md-6">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1"
                  ><i class="fas fa-image"></i>
                </span>
              </div>
              <input
                type="text"
                v-model="image"
                class="form-control"
                placeholder="Book Cover"
                aria-label="Book Cover"
                aria-describedby="basic-addon1"
                :class="{ 'is-invalid': validationErrors.image }"
              />
            </div>
            <div v-if="validationErrors.image" class="text-danger">
              {{ validationErrors.image[0] }}
            </div>
            <ApolloQuery :query="require('@/graphql/Queries/categories.gql')">
              <template
                v-slot="{ result: { loading, error, data }, isLoading }"
              >
                <div v-if="loading | isLoading" class="loading apollo">
                  Loading...
                </div>
                <div v-else-if="error" class="error apollo">
                  An error occurred
                </div>
                <div v-else-if="data" class="result apollo categories">
                  <div class="input-group mb-3">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="basic-addon1">
                        <i class="fas fa-th-list"></i>
                      </span>
                    </div>
                    <select
                      class="form-control"
                      :class="{ 'is-invalid': validationErrors.category_id }"
                      v-model="category"
                      required
                    >
                      <option value="" selected disabled>
                        Select book category here
                      </option>
                      <option
                        v-for="categ in data.categories"
                        :key="categ.id"
                        :value="categ.id"
                      >
                        {{ categ.name }}
                      </option>
                    </select>
                  </div>
                  <div v-if="validationErrors.category_id" class="text-danger">
                    {{ validationErrors.category_id[0] }}
                  </div>
                </div>
                <div v-else class="no-result apollo">No result :(</div>
              </template>
            </ApolloQuery>
            <div class="featured-checkbox-container float-left my-2">
              <div class="rounded-checkbox">
                <input
                  v-model="featured"
                  class="featured-checkbox"
                  type="checkbox"
                  :value="featured"
                  id="featured-checkbox"
                  name="check"
                />
                <label for="featured-checkbox"></label>
              </div>
              <span class="mx-4">Featured</span>
            </div>
          </div>
          <div class="col-md-11">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1"
                  ><i class="fas fa-text-height"></i>
                </span>
              </div>
              <textarea
                v-model="description"
                class="form-control"
                cols="12"
                rows="5"
                required
                :class="{ 'is-invalid': validationErrors.description }"
              ></textarea>
            </div>
            <div v-if="validationErrors.description" class="text-danger">
              {{ validationErrors.description[0] }}
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-dismiss="modal">
          Close
        </button>
         <vue-loaders
            v-if="isSending"
            class="float-right"
            name="pacman"
            color="red"
            scale="1"
          ></vue-loaders>
           <div v-else>
             <button v-if="isUpdate" type="submit" class="btn btn-primary">
          Update BooK
        </button>
        <button v-else @click="addBook" type="submit" class="btn btn-primary">
          Add BooK
        </button>
           </div>
      </div>
    </form>
  </div>
</template>
<script>
import addBook from "@/graphql/Mutations/createBook.gql";
import updateBook from "@/graphql/Mutations/updateBook.gql";
import bookQuery from "@/graphql/Queries/book.gql";
import Toast from '../toast'
export default {
  props: {
    isUpdate: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      title: "",
      author: "",
      image: "",
      description: "",
      category: "",
      featured: false,
      link: "",
      validationErrors: [],
      isSending: false,
    };
  },

  mounted() {
    if (this.isUpdate) {
      this.getEditBook();
    }
  },

  methods: {
    updateBook() {
      this.isSending = true
      this.$apollo
        .mutate({
          mutation: updateBook,
          variables: {
            id: this.$route.params.id,
            title: this.title,
            link: this.link,
            image: this.image,
            author: this.author,
            description: this.description,
            category_id: parseInt(this.category),
            featured: this.featured,
          },
        })
        .then(() => {
          this.isSending = false
          this.$emit("close-add-modal");
           Toast.fire({
            icon: 'success',
            title: 'Book updated successfully'
          })
          setTimeout(()=>{
             this.$router.go();
          }, 2500)
        })
        .catch((error) => {
          this.isSending = false
          let { graphQLErrors } = error;
          if (graphQLErrors[0].extensions.category === "validation") {
            this.validationErrors = graphQLErrors[0].extensions.validation;
          }
        });
    },

    getEditBook() {
      this.$apollo
        .query({
          query: bookQuery,
          variables: {
            id: this.$route.params.id,
          },
        })
        .then((data) => {
          (this.title = data.data.book.title),
            (this.link = data.data.book.link),
            (this.image = data.data.book.image),
            (this.author = data.data.book.author),
            (this.description = data.data.book.description),
            (this.category = `${data.data.book.category.id}`),
            (this.featured = data.data.book.featured);
        });
    },
    addBook() {
      this.isSending = true
      this.$apollo
        .mutate({
          mutation: addBook,
          variables: {
            title: this.title,
            link: this.link,
            image: this.image,
            author: this.author,
            description: this.description,
            category_id: parseInt(this.category),
            featured: this.featured,
          },
        })
        .then(() => {
          this.isSending = false
          this.$emit("close-add-modal");
           Toast.fire({
            icon: 'success',
            title: 'Book added successfully'
          })
          setTimeout(()=>{
             this.$router.go();
          }, 2500)
        })
        .catch((error) => {
          this.isSending = false
          let { graphQLErrors } = error;
          if (graphQLErrors[0].extensions.category === "validation") {
            this.validationErrors = graphQLErrors[0].extensions.validation;
          }
        });
    },
  },
};
</script>

<style scoped>
.featured-checkbox-container {
  display: flex;
  align-items: center;
}
.featured-checkbox {
  visibility: hidden;
}

.rounded-checkbox {
  width: 28px;
  height: 28px;
  background: linear-gradient(top, #fcfff4 0%, #dfe5d7 40%, #b3bead 100%);
  box-shadow: inset 0px 1px 1px white, 0px 1px 3px rgba(0, 0, 0, 0.5);
  position: relative;
  border-radius: 50%;
}

.rounded-checkbox label {
  cursor: pointer;
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  top: 4px;
  left: 4px;
  box-shadow: inset 0px 1px 1px white, 0px 1px 3px rgba(0, 0, 0, 0.2);

  background: -webkit-linear-gradient(top, #222 0%, #45484d 100%);
  background: -moz-linear-gradient(top, #222 0%, #45484d 100%);
  background: -o-linear-gradient(top, #222 0%, #45484d 100%);
  background: -ms-linear-gradient(top, #222 0%, #45484d 100%);
  background: linear-gradient(top, #222 0%, #45484d 100%);
}

.rounded-checkbox label:after {
  opacity: 0;
  content: "";
  width: 16px;
  height: 16px;
  position: absolute;
  background: #00bf00;
  border-radius: 50%;
  left: 2px;
  top: 2px;
}

.rounded-checkbox label:hover::after {
  opacity: 0.3;
}

.rounded-checkbox input[type="checkbox"]:checked + label:after {
  opacity: 1;
}
</style>