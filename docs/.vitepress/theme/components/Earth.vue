<script setup lang="ts">
</script>

<template>
  <div class="flex justify-center items-center mb-20">
    <div class="section-banner">
      <div id="star-1">
        <div class="curved-corner-star">
          <div id="curved-corner-bottomright"></div>
          <div id="curved-corner-bottomleft"></div>
        </div>
        <div class="curved-corner-star">
          <div id="curved-corner-topright"></div>
          <div id="curved-corner-topleft"></div>
        </div>
      </div>

      <div id="star-2">
        <div class="curved-corner-star">
          <div id="curved-corner-bottomright"></div>
          <div id="curved-corner-bottomleft"></div>
        </div>
        <div class="curved-corner-star">
          <div id="curved-corner-topright"></div>
          <div id="curved-corner-topleft"></div>
        </div>
      </div>

      <div id="star-3">
        <div class="curved-corner-star">
          <div id="curved-corner-bottomright"></div>
          <div id="curved-corner-bottomleft"></div>
        </div>
        <div class="curved-corner-star">
          <div id="curved-corner-topright"></div>
          <div id="curved-corner-topleft"></div>
        </div>
      </div>

      <div id="star-4">
        <div class="curved-corner-star">
          <div id="curved-corner-bottomright"></div>
          <div id="curved-corner-bottomleft"></div>
        </div>
        <div class="curved-corner-star">
          <div id="curved-corner-topright"></div>
          <div id="curved-corner-topleft"></div>
        </div>
      </div>

      <div id="star-5">
        <div class="curved-corner-star">
          <div id="curved-corner-bottomright"></div>
          <div id="curved-corner-bottomleft"></div>
        </div>
        <div class="curved-corner-star">
          <div id="curved-corner-topright"></div>
          <div id="curved-corner-topleft"></div>
        </div>
      </div>

      <div id="star-6">
        <div class="curved-corner-star">
          <div id="curved-corner-bottomright"></div>
          <div id="curved-corner-bottomleft"></div>
        </div>
        <div class="curved-corner-star">
          <div id="curved-corner-topright"></div>
          <div id="curved-corner-topleft"></div>
        </div>
      </div>

      <div id="star-7">
        <div class="curved-corner-star">
          <div id="curved-corner-bottomright"></div>
          <div id="curved-corner-bottomleft"></div>
        </div>
        <div class="curved-corner-star">
          <div id="curved-corner-topright"></div>
          <div id="curved-corner-topleft"></div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.section-banner {
  height: 250px;
  width: 250px;
  position: relative;
  transition: left 0.3s linear;
  background: url(/earth.jpeg);
  background-size: cover;
  background-position: left;
  bottom: 0px;
  border-radius: 50%;
  animation: earthRotate 30s linear 0s infinite;
  box-shadow: 0px 0 20px RGBA(255, 255, 255, 0.2), -5px 0px 8px #c3f4ff inset,
    15px 2px 25px #000 inset, -24px -2px 34px #c3f4ff99 inset,
    250px 0px 44px #00000066 inset, 150px 0px 38px #000000aa inset;
}
@keyframes earthRotate {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 400px 0;
  }
}

.curved-corner-star {
  display: flex;
  position: relative;
}

#curved-corner-bottomleft,
#curved-corner-bottomright,
#curved-corner-topleft,
#curved-corner-topright {
  width: 4px;
  height: 5px;
  overflow: hidden;
  position: relative;
}

#curved-corner-bottomleft:before,
#curved-corner-bottomright:before,
#curved-corner-topleft:before,
#curved-corner-topright:before {
  content: "";
  display: block;
  width: 200%;
  height: 200%;
  position: absolute;
  border-radius: 50%;
}

#curved-corner-bottomleft:before {
  bottom: 0;
  left: 0;
  box-shadow: -5px 5px 0 0 white;
}

#curved-corner-bottomright:before {
  bottom: 0;
  right: 0;
  box-shadow: 5px 5px 0 0 white;
}

#curved-corner-topleft:before {
  top: 0;
  left: 0;
  box-shadow: -5px -5px 0 0 white;
}

#curved-corner-topright:before {
  top: 0;
  right: 0;
  box-shadow: 5px -5px 0 0 white;
}

@keyframes twinkling {
  0%,
  100% {
    opacity: 0.1;
  }
  50% {
    opacity: 1;
  }
}

#star-1 {
  position: absolute;
  left: -20px;
  animation: twinkling 3s infinite;
}

#star-2 {
  position: absolute;
  left: -40px;
  top: 30px;
  animation: twinkling 2s infinite;
}
#star-3 {
  position: absolute;
  left: 350px;
  top: 90px;
  animation: twinkling 4s infinite;
}
#star-4 {
  position: absolute;
  left: 200px;
  top: 290px;
  animation: twinkling 3s infinite;
}
#star-5 {
  position: absolute;
  left: 50px;
  top: 270px;
  animation: twinkling 1.5s infinite;
}

#star-6 {
  position: absolute;
  left: 250px;
  top: -50px;
  animation: twinkling 4s infinite;
}
#star-7 {
  position: absolute;
  left: 290px;
  top: 60px;
  animation: twinkling 2s infinite;
}

</style>