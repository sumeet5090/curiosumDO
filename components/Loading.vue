<template>
<transition name="fade">
  <div class="dot-container">
    <div class="new-loader">
      <div class="new-loader__ring1">
        <div class="new-loader__ring2">
          <div class="new-loader__ring3"></div>
        </div>
      </div>
    </div>
  </div>
</transition>
</template>

<script>
export default {
  name: "loading-page"
};
</script>

<style lang="scss">
$ringColor1: #33CCCC;
$ringColor2: #FE9900;
$ringColor3: #33CCCC;
$loaderSize: 90px;
$loaderThickness: 0.25rem;

.new-loader {
  height: $loaderSize;
  width: $loaderSize;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
  border-radius: 50%;

  .new-loader__ring1 {
    height: calc(#{$loaderSize} * 0.9);
    width: calc(#{$loaderSize} * 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    border-left: $loaderThickness $ringColor1 solid;
    border-radius: 50%;
    animation: rotate-ring1 1500ms infinite linear;

    .new-loader__ring2 {
      height: calc(#{$loaderSize} * 0.8);
      width: calc(#{$loaderSize} * 0.8);
      z-index: 499;
      display: flex;
      justify-content: center;
      align-items: center;
      border-left: $loaderThickness $ringColor2 solid;
      border-radius: 50%;
      animation: rotate-ring2 1500ms infinite linear;

      .new-loader__ring3 {
        height: calc(#{$loaderSize} * 0.7);
        width: calc(#{$loaderSize} * 0.7);
        z-index: 500;
        border-bottom: $loaderThickness $ringColor3 solid;
        border-radius: 50%;
        animation: rotate-ring3 1500ms infinite linear;
      }
    }
  }
}

@keyframes rotate-ring1 {
  from {
    transform: rotate(-60deg)
  }

  to {
    transform: rotate(300deg)
  }
}

@keyframes rotate-ring2 {
  from {
    transform: rotate(0deg)
  }

  to {
    transform: rotate(360deg)
  }
}

@keyframes rotate-ring3 {
  from {
    transform: rotate(60deg)
  }

  to {
    transform: rotate(420deg)
  }
}
</style>
