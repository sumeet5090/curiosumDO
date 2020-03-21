<template>
<section class="section section-hero custom-gradient">
  <b-container>
    <b-row class="justify-content-center">
      <card class="col-sm-10 col-md-8 col-lg-5">
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
          <b-alert variant="danger" dismissible :show="errors.length > 0" @dismissed="showDismissibleAlert=false">
            <div v-for="error in errors" :key="error">{{error}}</div>
          </b-alert>
          <b-alert variant="success" :show="!!success_msg">
            <div>{{success_msg}}</div>
          </b-alert>
          <b-row class="justify-content-center">
            <b-button type="info" variant="success">Update</b-button>
            <b-button type="reset" variant="danger">Reset</b-button>
          </b-row>
        </b-form>
      </card>
    </b-row>
  </b-container>
</section>
</template>

<script>
import {
  mapActions,
  mapGetters
} from "vuex";
export default {
  data() {
    return {
      car_number: "",
      selectedTeam: null,
      selectedEvent: null,
      success_msg: "",
      errors: []
    };
  },
  methods: {
    ...mapActions(["getEvents", "getTeamsForEvent", "getReq", "putReq"]),
    async onSubmit() {
      this.success_msg = ""
      this.errors = []
      if(this.selectedTeam && this.selectedEvent && this.car_number){
        try {
          let res = await this.putReq({
            url: `/api/event/${this.selectedEvent}/${this.selectedTeam}/car`,
            body: {
              car_number: this.car_number
            }
          })
          if(res.success){
            this.success_msg = res.message
          }
        } catch (error) {
          console.log(error)
        }
      }
    },
    onReset() {
      this.selectedEvent = null;
      this.selectedTeam = null;
      this.car_number = "";
      this.success_msg = "";
      this.errors =  [];
    },
    async getCarForTeam(team){
      try {
        this.success_msg = ""
        this.errors = []
        let res = await this.getReq({
          url: `/api/event/${this.selectedEvent}/${this.selectedTeam}/car`
        })
        if(res.success){
          this.car_number = res.car.car_number
          this.success_msg = res.message;
        } else {
          this.car_number = ""
          this.showError(res.message)
        }
      } catch (error) {
        this.car_number = ""
        this.showError("Internal server error")
      }
    },
    showError(msg) {
      this.showDismissableAlert = true;
      this.errors.push(msg);
    },
  },
  computed: {
    ...mapGetters(["events", "teams"])
  },
  created() {
    this.$nextTick(function () {
      this.getEvents();
    });
  },
  watch: {
    selectedEvent: function () {
      if (this.selectedEvent != undefined) {
        this.getTeamsForEvent(this.selectedEvent);
      }
    },
    selectedTeam: function() {
      if(this.selectedTeam != undefined){
        this.getCarForTeam(this.selectedTeam)
      }
    }
  }
};
</script>

<style lang="scss">
</style>
