<template>
  <div>
    <no-ssr>
      <section class="section">
        <b-container>
          <b-row class="justify-content-center">
            <card class="col-md-8">
              <static-schedule v-if="!!isAdmin"/>
              <error-page message="You are not authorized." v-else/>
            </card>
          </b-row>
        </b-container>
      </section>
    </no-ssr>
  </div>
</template>

<script>
import StaticSchedule from "@/components/delete/staticSchedule.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    "static-schedule": StaticSchedule
  },
  computed: {
    ...mapGetters(["isAdmin", "currentUser"])
  }
};
</script>

<style lang="scss"></style>