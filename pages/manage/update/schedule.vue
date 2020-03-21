<template>
<section class="section">
  <b-container>
    <b-row class="justify-content-center">
      <schedule class="col-md-10" v-if="isAdmin" />
      <error-page v-else message="You are not authorized to view this content." icon="fas fa-exclamation-circle" />
    </b-row>
  </b-container>
</section>
</template>

<script>
import updateSchedule from "@/components/update/schedule.vue"
import {
  mapActions,
  mapGetters
} from "vuex";
export default {
  components: {
    schedule: updateSchedule
  },
  data() {
    return {
      errors: [],
      success_msg: null
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAdmin"])
  },
  methods: {}
};
</script>

<style lang="scss">
</style>
