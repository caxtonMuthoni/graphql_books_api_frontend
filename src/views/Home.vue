<template>
  <div class="mt-0 pt-0">
    <custom-header />

    <section id="books">
      <div class="container mt-5">
        <div class="row mt-5">
          <div class="col-md-8"> </div>
          <div class="col-md-4">
            <div class="input-group mb-3">
              <input
                type="text"
                v-model="search"
                class="form-control"
                placeholder="Author, book title"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
              />
              <div class="input-group-append">
                <span class="input-group-text" id="basic-addon2">Search</span>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <Categories @selectCategory="changeCategory" />
          </div>
          <div class="col-md-9">
            <Books :selectedCategory="selectedCategory" :searched="searched" />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
import Categories from "@/components/Categories.vue";
import Books from "../components/Books.vue";
import CustomHeader from "../components/CustomHeader.vue";

export default {
  name: "Home",
  components: {
    Categories,
    Books,
    CustomHeader,
  },
  data() {
    return {
      selectedCategory: "all",
      search: null,
      searched: "",
    };
  },

  watch: {
    search(newSearch) {
      this.searched = newSearch;
    },
  },

  methods: {
    changeCategory(value) {
      this.selectedCategory = value;
      this.search = "";
    },
  },
};
</script>

<style scoped>
.search-form {
  display: flex;
}
#books {
  padding-top: 100px;
}
</style>
