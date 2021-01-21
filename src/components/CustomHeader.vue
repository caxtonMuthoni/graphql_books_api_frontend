<template>
  <header>
    <div class="home-content">
      <div class="row justify-content-center">
        <div class="col-md-6 content-container">
          <div class="text-content">
            <h1>
              &ldquo; A room without a book is a body without a soul &rdquo;
            </h1>
            <p>
              Books are the quietest and most constant of friends; they are the
              most accessible and wisest of counselors, and the most patient of
              teachers.
            </p>
            <div class="btn-book">
              <a href="#books" v-smooth-scroll class="btn btn-outline-primary">
                Get your best book today.
              </a>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="img"></div>
        </div>
      </div>
    </div>
  </header>
</template>
<style scoped>
header {
  background: linear-gradient(#3498db2d, #3498db77, #3498dba9);
  height: 100vh;
  position: relative;
  top: 0;
  left: 0;
  right: 0;
}

.home-content {
  width: 80vw;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.content-container {
  display: flex;
  align-items: center;
  height: 45vh;
}

.text-content {
  text-align: start;
}

h1 {
  font-weight: 400;
  color: #0f517c;
  margin-bottom: 18px;
}

.btn-book{
    display: flex;
    justify-content: center;
}

.img {
  background-image: url("../assets/booklover.svg");
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 45vh;
}
</style>