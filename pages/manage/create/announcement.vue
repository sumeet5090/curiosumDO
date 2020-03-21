<template>
<div>
  <no-ssr>
    <section class="section">
      <div class="row justify-content-center">
        <card class="col-md-8">
          <announcement v-if="!!isAdmin"/>
          <error-page message="You are not authorized." v-else/>
        </card>
      </div>
    </section>
  </no-ssr>
</div>
</template>

<script>
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { mapActions, mapGetters } from "vuex";
import announcement from '@/components/create/announcement.vue';
export default {
  components: {
    'announcement': announcement
  },
  computed: {
    ...mapGetters(['isAdmin', 'currentUser'])
  }
}
</script>

<style lang="scss">
</style>
