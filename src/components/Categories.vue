<template>
  <div class="container">
    <ApolloQuery
      class="mt-5 pb-0"
      :query="require('@/graphql/Queries/featured.gql')"
      :variables="{
        featured: true,
        page: 1,
      }"
    >
      <template
        class="mb-0 pb-0"
        v-slot="{ result: { loading, error, data }, isLoading }"
      >
        <!-- Loading -->
        <div v-if="loading | isLoading" class="loading apollo">
          <vue-loaders
            class="mt-5"
            name="ball-beat"
            color="red"
            scale="1"
          ></vue-loaders>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="error apollo">An error occurred</div>

        <!-- Result -->
        <div v-else-if="data" class="result apollo categories">
          <a
            class="category-item"
            href="#"
            id="category-featured"
            @click.prevent="selectCategory('featured')"
          >
            Featured books ({{ data.featuredBooks.paginatorInfo.total }})
          </a>
        </div>

        <!-- No result -->
        <div v-else class="no-result apollo">No result :(</div>
      </template>
    </ApolloQuery>

    <ApolloQuery
      :query="require('@/graphql/Queries/books.gql')"
      :variables="{ page: 1 }"
    >
      <template
        class="mb-0 pb-0"
        v-slot="{ result: { loading, error, data }, isLoading }"
      >
        <!-- Loading -->
        <div v-if="loading | isLoading" class="loading apollo">
          <vue-loaders
            class="mt-5"
            name="ball-beat"
            color="red"
            scale="1"
          ></vue-loaders>
        </div>
        <!-- Error -->
        <div v-else-if="error" class="error apollo">An error occurred</div>

        <!-- Result -->
        <div v-else-if="data" class="result apollo categories">
          <a
            href="#"
            class="active-link category-item"
            id="category-all"
            @click.prevent="selectCategory('all')"
          >
            All books ({{ data.books.paginatorInfo.total }})
          </a>
        </div>

        <!-- No result -->
        <div v-else class="no-result apollo">No result :(</div>
      </template>
    </ApolloQuery>

    <ApolloQuery :query="require('@/graphql/Queries/categories.gql')">
      <template v-slot="{ result: { loading, error, data }, isLoading }">
        <!-- Loading -->
        <div v-if="loading | isLoading" class="loading apollo">
          <vue-loaders
            class="mt-5"
            name="ball-beat"
            color="red"
            scale="1"
          ></vue-loaders>
        </div>
        <!-- Error -->
        <div v-else-if="error" class="error apollo">An error occurred</div>

        <!-- Result -->
        <div v-else-if="data" class="result apollo categories">
          <a
            class="category-item"
            href="#"
            v-for="category in data.categories"
            :key="category.id"
            :id="`category-${category.id}`"
            @click.prevent="selectCategory(category.id)"
          >
            {{ category.name }} ({{ category.books.length }})
          </a>
          <a
            href="#"
            class="btn btn-outline-success btn-sm"
            id="category-add"
            data-toggle="modal"
            data-target="#add-book-modal"
            ><i class="fas fa-plus mr-2"></i> Add a book</a
          >
        </div>

        <!-- No result -->
        <div v-else class="no-result apollo">No result :(</div>
      </template>
    </ApolloQuery>

    <!-- Modal -->
    <div
      class="modal fade"
      id="add-book-modal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="modelTitleId"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Create new Book</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <AddBook @close-add-modal="closeModal" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import gql from "graphql-tag";
import AddBook from "@/components/AddBook.vue";
import $ from "jquery";
export default {
  components: {
    AddBook,
  },
  data() {
    return {};
  },
  apollo: {
    categories: gql`
      query {
        categories {
          id
          name
          books {
            id
          }
        }
      }
    `,
  },

  methods: {
    closeModal() {
      $("#add-book-modal").modal("hide");
    },
    selectCategory(categoryId) {
      this.setActiveCategory(categoryId);
      this.$emit("selectCategory", categoryId);
    },

    setActiveCategory(id) {
      let linkElements = document.querySelectorAll(".active-link");
      linkElements.forEach((element) => {
        element.classList.remove("active-link");
      });

      const activeLink = document.querySelector(`#category-${id}`);
      activeLink.classList.add("active-link");
    },
  },
};
</script>

<style scoped>
.categories a {
  display: block;
  text-align: start;
  text-decoration: none;
  margin: 8px 0;
}

.categories .category-item {
  color: rgb(102, 102, 102);
  font-weight: bolder;
  transition: color 0.2s;
}

.categories .category-item:hover {
  color: rgb(44, 164, 219);
}

.categories .active-link {
  color: blue;
}
</style>