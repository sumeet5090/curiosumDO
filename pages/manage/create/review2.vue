<template>
  <div>
    <no-ssr>
      <section class="section section-xl">
        <b-container>
          <b-row class="justify-content-center">
            <card class="col-md-8">
              <review v-if="!!isAdmin"/>
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
import review3 from "@/components/create/review3.vue";
export default {
  components: {
    "review3": Review3
  },
  computed: {
    ...mapGetters(["currentUser", "isAdmin"])
  }
};
</script>

<style lang="scss">
</style>
