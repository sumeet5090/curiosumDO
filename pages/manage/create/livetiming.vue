<template>
  <div>
    <no-ssr>
      <section class="section section-xl">
        <b-container>
          <b-row class="justify-content-center">
            <card class="col-md-8">
              <live-timing v-if="!!isAdmin"/>
              <error-page message="You are not authorized." v-else/>
            </card>
          </b-row>
        </b-container>
      </section>
    </no-ssr>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import liveTiming from "@/components/create/liveTiming.vue";
export default {
  components: {
    "live-timing": liveTiming
  },
  computed: {
    ...mapGetters(["currentUser", "isAdmin"])
  }
};
</script>

<style lang="scss">
</style>