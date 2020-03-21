<template>
  <b-form @reset.prevent="onReset" @submit.prevent>
    <b-form-group id="form-input-event" label="Event:" label-for="form-input-event--input">
      <b-form-select :options="events" class="mb-3 text-dark" id="form-input-event--input" required v-model="selectedEvent"></b-form-select>
    </b-form-group>
    <b-form-group id="form-team" label="Team:" label-for="form-team--input">
      <b-form-select class="mb-3 text-dark" id="form-team--input" required v-model="selectedTeam">
        <option :value="null" class="text-disabled">Select a team</option>
        <option :key="tm._id" :value="tm._id" v-for="tm in teams">{{tm.team_name}}</option>
      </b-form-select>
    </b-form-group>
    <b-form-group id="form-input-event_names" label="Event name:" label-for="form-input-event_names--input" v-if="selectedTeam">
      <b-form-select :options="event_names" class="mb-3 text-dark" id="form-input-event_names--input" required v-model="form.event_name"></b-form-select>
    </b-form-group>
    <b-form-group id="form-lap-num" label="Lap number:" label-for="form-lap-num--input" v-if="selectedTeam">
      <b-form-input class="mb-3 text-dark" id="form-lap-num--input" placeholder="Enter lap number." type="number" v-model="form.lap_number"></b-form-input>
    </b-form-group>
    <b-form-group id="form-lap-time" label="Lap time:" label-for="form-lap-time--input" v-if="selectedTeam">
      <b-form-input class="mb-3 text-dark" id="form-lap-time--input" placeholder="Enter lap time (seconds)" type="text" v-model="form.lap_time"></b-form-input>
    </b-form-group>
    <b-form-group id="form-driver-initial" label="Driver initial:" label-for="form-driver-initial--input" v-if="selectedTeam">
      <b-form-input class="mb-3 text-dark" id="form-driver-initial--input" placeholder="Enter driver initial" type="text" v-model="form.driver_initial"></b-form-input>
    </b-form-group>
    <b-alert :show="errors.length > 0" @dismissed="showDismissibleAlert=false" dismissible variant="danger">
      <div :key="error" v-for="error in errors">{{error}}</div>
    </b-alert>
    <b-alert :show="!!success_msg" variant="success">
      <div>{{success_msg}}</div>
    </b-alert>
    <b-button @click.prevent="onSubmit" variant="success">Submit</b-button>
    <b-button type="reset" variant="danger">Reset</b-button>
  </b-form>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      tag: null,
      selectedEvent: null,
      selectedTeam: null,
      form: {
        lap_number: null,
        lap_time: null,
        driver_initial: null,
        event_name: null
      },
      event_names: [
        {
          value: null,
          text: "Select event name"
        },
        {
          value: "Skid Pad",
          text: "Skid Pad"
        },
        {
          value: "Acceleration",
          text: "Acceleration"
        },
        {
          value: "Autocross",
          text: "Autocross"
        },
        {
          value: "Endurance",
          text: "Endurance"
        }
      ],
      events: [],
      success_msg: "",
      errors: []
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAdmin", "teams"])
  },
  methods: {
    ...mapActions(["getReq", "postReq", "getTeamsForEvent"]),
    async getEvents() {
      try {
        let url = "/api/event/";
        let data = await this.getReq({
          url
        });
        if (data.events) {
          if (data.events.length > 0) {
            this.events = [
              {
                value: null,
                text: "Select an event"
              }
            ];
            for (let i = 0; i < data.events.length; i++) {
              data.events[i].teams = null;
              data.events[i].value = data.events[i]._id;
              data.events[i].text = data.events[i].name;
              this.events.push(data.events[i]);
            }
          }
        }
      } catch (error) {
        console.log(error);
        this.errors.push("Couldn't get events.");

        this.events = [];
      }
    },
    async onSubmit() {
      try {
        this.success_msg = null;
        this.errors = [];
        let url = `/api/event/${this.selectedEvent}/review/${
          this.selectedTeam
        }`;
        let res = await this.postReq({
          url: url,
          body: {
            event_name: this.form.event_name,
            lap_number: this.form.lap_number,
            driver_initial: this.form.driver_initial,
            lap_time: this.form.lap_time
          }
        });
        if (res.success) {
          this.success_msg = res.message;
          this.onReset();
        } else {
          this.errors.push(res.message);
          this.onReset();
        }
      } catch (error) {
        console.log(error);
        this.errors.push("Couldn't reach server. Try again later.");
        this.onReset();
      }
    },
    onReset() {
      this.selectedEvent = null;
      this.selectedTeam = null;
      this.form.event_name = null;
      this.form.driver_initial = null;
      this.form.lap_time = null;
      this.form.lap_number = null;
      this.$store.commit("SET_TEAMS", []);
    }
  },
  watch: {
    selectedEvent: function() {
      if (this.selectedEvent == null) {
        this.selectedTeam = null;
      }
      return this.getTeamsForEvent(this.selectedEvent);
    },
    selectedTeam: function() {
      if (this.selectedTeam == null) {
        this.selectedTeam = null;
      }
    }
  },
  beforeMount() {
    this.getEvents();
  }
};
</script>

<style lang="scss">
</style>
