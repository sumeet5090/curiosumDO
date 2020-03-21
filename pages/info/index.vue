<template>
<div>
  <section class="section section-hero">
    <div class="row justify-content-center">
      <error-page :message="message" :heading="heading" :color="color" :icon="icon" />
    </div>
  </section>
</div>
</template>

<script>
export default {
  data() {
    return {
      message: null,
    }
  },
  async asyncData({
    query
  }) {
    return {
      message: query.message,
      success: query.success
    }
  },
  computed: {
    icon: function () {
      if (this.success == "true") {
        return "fas fa-check-circle"
      } 
      if (this.success == "false") {
        return "fas fa-exclamation-triangle"
      }
      return "fas fa-exclamation-circle"
    },
    // success | info | primary | warning | danger | secondary
    color: function () {
      if (this.success == "true") {
        return "success"
      }
      if (this.success == "false") {
        return "warning"
      }
      return "info"
    },
    heading: function () {
      if (this.success == "true") {
        return "Success"
      }
      if (this.success == "false") {
        return "Error"
      }
      return "Info"
    }
  },
  methods: {

  }
}
</script>

<style lang="scss">

</style>
