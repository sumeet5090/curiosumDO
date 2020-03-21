<template>
  <section class="section hero">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-sm-12 col-md-10">
          <remove-team-from-event/>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import RemoveTeamFromEvent from "@/components/remove/team-from-event.vue";
export default {
  components: {
    "remove-team-from-event": RemoveTeamFromEvent
  },
  data() {
    return {};
  }
};
</script>