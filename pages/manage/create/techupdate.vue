<template>
  <div>
    <no-ssr>
      <section class="section">
        <b-container>
          <b-row class="justify-content-center">
            <card class="col-md-8">
              <tech-update v-if="!!isAdmin"/>
              <error-page message="You aren't authorized to view this." v-else/>
            </card>
          </b-row>
        </b-container>
      </section>
    </no-ssr>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import techUpdate from "@/components/create/techupdate.vue";
export default {
  components: {
    "tech-update": techUpdate
  },
  computed: {
    ...mapGetters(["currentUser", "isAdmin"])
  }
};
</script>

<style lang="scss">
</style>
