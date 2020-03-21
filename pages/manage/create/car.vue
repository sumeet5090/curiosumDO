<template>
<section class="section section-hero custom-gradient">
  <b-container>
    <b-row class="justify-content-center">
      <card class="col-sm-10 col-md-8 col-lg-5" v-if="isAdmin">
        <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
          <b-form-group id="form-event" label="Event:" label-for="form-event--input" description="Select an event">
            <b-form-select id="form-event--input" required v-model="selectedEvent" class="mb-3">
              <option :value="null">Select an option</option>
              <option :value="ev._id" v-for="ev in events" :key="ev._id">{{ev.name}}</option>
            </b-form-select>
          </b-form-group>
          <b-form-group id="form-team" label="Team:" label-for="form-team--input" description="Select a team">
            <b-form-select id="form-team--input" required v-model="selectedTeam" class="mb-3">
              <option :value="null">Select an option</option>
              <option :value="tm._id" v-for="tm in teams" :key="tm._id">{{tm.team_name}}</option>
            </b-form-select>
          </b-form-group>
          <b-form-group id="form-carnumber" label="Car number:" label-for="form-carnumber--input" description="Choose an unique name which describes your team.">
            <base-input :required="true" addon-left-icon="" id="form-carnumber--input" type="text" v-model="car_number" placeholder="Enter car number">
            </base-input>
          </b-form-group>
          <b-row class="justify-content-center">
            <b-button type="submit" variant="success">Submit</b-button>
            <b-button type="reset" variant="danger">Reset</b-button>
          </b-row>
        </b-form>
      </card>
      <error-page message="You are not authorized." v-else/>
    </b-row>
  </b-container>
</section>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      car_number: "",
      selectedTeam: null,
      selectedEvent: null
    };
  },
  methods: {
    ...mapActions(["getEvents", "getTeamsForEvent", "postReq"]),
    async onSubmit() {
      let res = await this.postReq({
        url: `/api/event/${this.selectedEvent}/create/${this.selectedTeam}/car`,
        body: {
          car_number: this.car_number
        }
      })
    },
    onReset() {
      this.car_number = "";
      this.selectedEvent = null;
      this.selectedTeam = null;
    }
  },
  computed: {
    ...mapGetters(["events", "teams", "isAdmin", "currentUser"])
  },
  created() {
    this.$nextTick(function() {
      this.getEvents();
    });
  },
  watch: {
    selectedEvent: function() {
      if (this.selectedEvent != undefined) {
        this.getTeamsForEvent(this.selectedEvent);
      }
    }
  }
};
</script>

<style lang="scss">
</style>
