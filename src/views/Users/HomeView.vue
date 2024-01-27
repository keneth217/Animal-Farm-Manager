<template>
  <div class="container-fluid mt-5 text-center">
    <div class="row align-items-center bg-image back">
      <div class="col  mx-auto text-center">
        <div class="text-center">
          <div class="mask" style="background-color: rgba(0, 0, 0, 0.6);">
            <div class="d-flex justify-content-center align-items-center h-100">
              <div class="">
                <h1 class="mb-3 text-danger">Farm Management</h1>
                <h6 class="mb-3 text-light">Livestock farming plays a crucial role in the global food supply chain, providing
                  essential products such as meat, milk, and other by-products. In addition to meeting nutritional needs,
                  livestock farming contributes significantly to the economy, rural development, and environmental
                  sustainability. One often overlooked but vital aspect of successful livestock farming is the meticulous
                  keeping of records and statistics.</h6>
                <router-link class="btn btn-outline-primary btn-lg mb-3" to="/auth/login" role="button">Login</router-link>
              </div>
            </div>
            <div class="text-light"><span class="me-2">Are you in need of any website</span><span class="me-2"><router-link class="mb-3" to="/contacts" role="button">Contact Us</router-link></span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-image {
  height: 100%;
  /* Ensure the height covers the entire container */
}
.back{

          background: url(../../assets/animals/IMG_20220104_133028_2.jpg);
          background-size: cover; /* Make the background image cover the entire container */
          background-position: center center; /* Center the background image */
          height: 600px;
      
}
</style>
