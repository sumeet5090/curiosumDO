<template>
  <div>
    <no-ssr>
      <section class="section">
        <b-container>
          <b-row class="justify-content-center" v-if="isAdmin">
            <card class="col-md-8">
              <static-schedule />
            </card>
          </b-row>
        </b-container>
      </section>
    </no-ssr>
  </div>
</template>

<script>
import StaticSchedule from './../../../components/update/staticSchedule.vue';
import { mapGetters } from 'vuex';
export default {
  components: {
    'static-schedule': StaticSchedule
  },
  computed: {
    ...mapGetters(['isAdmin'])
  }
}
</script>

<style lang="scss">
.form-control[readonly] {
  background-color: initial;
  padding-left: 0.5rem !important;
  padding-right: 0.5rem !important;
}
</style>
