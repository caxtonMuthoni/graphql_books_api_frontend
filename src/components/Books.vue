<template>
  <div class="container">
    <div v-if="searched.length > 2">
      <ApolloQuery :query="searchQuery" :variables="{ search: searched }">
        <template v-slot="{ result: { loading, error, data }, isLoading }">
          <!-- Loading -->
         <div v-if="loading | isLoading" class="loading apollo mt-5">
            <vue-loaders class="mt-5" name="ball-spin-fade-loader" color="red" scale="1"></vue-loaders>
         </div>

          <!-- Error -->
          <div v-else-if="error" class="error apollo">An error occurred</div>

          <!-- Result -->
          <div v-else-if="data" class="result apollo categories py-3 my-3">
            <div class="row">
              <a
                class="col-md-3 book-link"
                href="#"
                v-for="book in data.searchBook"
                :key="book.id"
                @click.prevent="navigate(book.id)"
              >
                <img :src="book.image" alt="" />
                <p>
                  {{ book.title }} <br />
                  <i>{{ book.author }}</i>
                </p>
              </a>
            </div>
          </div>

          <!-- No result -->
          <div v-else class="no-result apollo">No result :(</div>
        </template>
      </ApolloQuery>
    </div>
    <div v-else>
      <ApolloQuery
        v-if="category_select === 'all'"
        :query="booksQuery"
        :variables="{ page: page }"
      >
        <template v-slot="{ result: { loading, error, data }, isLoading }">
          <!-- Loading -->
         <div v-if="loading | isLoading" class="loading apollo mt-5">
            <vue-loaders class="mt-5" name="ball-spin-fade-loader" color="red" scale="1"></vue-loaders>
          </div>

          <!-- Error -->
          <div v-else-if="error" class="error apollo">An error occurred</div>

          <!-- Result -->
          <div v-else-if="data" class="result apollo categories py-3 my-3">
            <div class="row">
              <a
                class="col-md-3 book-link"
                href="#"
                v-for="book in data.books.data"
                :key="book.id"
                @click.prevent="navigate(book.id)"
              >
                <img :src="book.image" alt="" />
                <p>
                  {{ book.title }} <br />
                  <i>{{ book.author }}</i>
                </p>
              </a>
              <div class="col-md-12">
                <paginate
                  class="float-right"
                  v-model="page"
                  :page-count="Math.round(data.books. paginatorInfo.total/data.books. paginatorInfo.perPage)"
                  :click-handler="pageCallback"
                  :prev-text="'Prev'"
                  :next-text="'Next'"
                  :container-class="'pagination'"
                  :page-class="'page-item'"
                  :page-link-class="'page-link'"
                  :prev-class="'page-item'"
                  :next-class="'page-item'"
                  :prev-link-class="'page-link'"
                  :next-link-class="'page-link'"
                  :active-class="'active'"
                >
                </paginate>
              </div>
            </div>
          </div>

          <!-- No result -->
          <div v-else class="no-result apollo">No result :(</div>
        </template>
      </ApolloQuery>

      <ApolloQuery
        v-if="category_select === 'featured'"
        :query="featuredQuery"
        :variables="{ 
        featured: true,
        page: featuredPage
       }"
      >
        <template v-slot="{ result: { loading, error, data }, isLoading }">
         <div v-if="loading | isLoading" class="loading apollo mt-5">
            <vue-loaders class="mt-5" name="ball-spin-fade-loader" color="red" scale="1"></vue-loaders>
          </div>

          <!-- Error -->
          <div v-else-if="error" class="error apollo">An error occurred</div>

          <!-- Result -->
          <div v-else-if="data" class="result apollo categories py-3 my-3">
            <div v-if="data.featuredBooks < 1" class="alert alert-warning">
              <strong>No Featured Books For Now</strong>
            </div>
            <div v-else class="row">
              <a
                class="col-md-3 book-link"
                href="#"
                v-for="book in data.featuredBooks.data"
                :key="book.id"
                @click.prevent="navigate(book.id)"
              >
                <img :src="book.image" alt="" />
                <p>
                  {{ book.title }} <br />
                  <i>{{ book.author }}</i>
                </p>
              </a>
              <div class="col-md-12">
                <paginate
                  class="float-right"
                  v-model="featuredPage"
                  :page-count="Math.round(data.featuredBooks.paginatorInfo.total/data.featuredBooks.paginatorInfo.perPage)"
                  :click-handler="pageCallback"
                  :prev-text="'Prev'"
                  :next-text="'Next'"
                  :container-class="'pagination'"
                  :page-class="'page-item'"
                  :page-link-class="'page-link'"
                  :prev-class="'page-item'"
                  :next-class="'page-item'"
                  :prev-link-class="'page-link'"
                  :next-link-class="'page-link'"
                  :active-class="'active'"
                >
                </paginate>
              </div>
            </div>
          </div>

          <!-- No result -->
          <div v-else class="no-result apollo">No result :(</div>
        </template>
      </ApolloQuery>

      <ApolloQuery
        v-if="
          category_select !== 'featured' &&
          category_select !== 'all' &&
          category_select !== null
        "
        :query="categoryQuery"
        :variables="{ id: selectedCategory }"
      >
        <template v-slot="{ result: { loading, error, data }, isLoading }">
          <!-- Loading -->
          <div v-if="loading | isLoading" class="loading apollo mt-5">
            <vue-loaders class="mt-5" name="ball-spin-fade-loader" color="red" scale="1"></vue-loaders>
          </div>

          <!-- Error -->
          <div v-else-if="error" class="error apollo">An error occurred</div>

          <!-- Result -->
          <div v-else-if="data" class="result apollo categories py-3 my-3">
            <div class="row" v-if="data.category">
              <a
                class="col-md-3 book-link"
                href="#"
                v-for="book in data.category.books"
                :key="book.id"
                @click.prevent="navigate(book.id)"
              >
                <img :src="book.image" alt="" />
                <p>
                  {{ book.title }} <br />
                  <i>{{ book.author }}</i>
                </p>
              </a>
            </div>
          </div>

          <!-- No result -->
          <div v-else class="no-result apollo">No result :(</div>
        </template>
      </ApolloQuery>
    </div>
  </div>
</template>
<script>
import booksQuery from "@/graphql/Queries/books.gql";
import categoryQuery from "@/graphql/Queries/category.gql";
import featuredQuery from "@/graphql/Queries/featured.gql";
import searchQuery from "@/graphql/Queries/search.gql";
export default {
  data() {
    return {
      booksQuery,
      categoryQuery,
      featuredQuery,
      searchQuery,
      category_select: "all",
      page: 1,
      featuredPage: 1,
      categoryPage: 1
    };
  },

  watch: {
    selectedCategory(newVal) {
      this.category_select = newVal;
    },
  },

  props: {
    selectedCategory: {
      type: String,
    },
    searched: {
      type: String,
      default: "",
    },
  },

  methods: {
    pageCallback() {
      
    },
    navigate(id) {
      this.$router.push({ name: "book-detail", params: { id: id } });
    },
  },
};
</script>

<style scoped>
img {
  width: 100px;
  height: auto;
}
.book-link {
  color: #555;
  text-decoration: none;
}

.page-item {
}
</style>