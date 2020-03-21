<template>
  <div>
    <no-ssr>
      <section class="section">
        <b-container>
          <b-row class="justify-content-center">
            <card class="col-md-8">
              <schedule v-if="!!isAdmin"/>
              <error-page v-else/>
            </card>
          </b-row>
        </b-container>
      </section>
    </no-ssr>
  </div>
</template>

<script>
import schedule from "@/components/create/schedule.vue";
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["isAdmin"])
  },
  components: {
    schedule: schedule
  }
};
</script>

<style lang="scss">
</style>
