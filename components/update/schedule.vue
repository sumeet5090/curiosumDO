<template>
<b-form @reset.prevent="onReset" @submit.prevent>
  <b-form-group id="form-input-event" label="Event:" label-for="form-input-event--input">
    <b-form-select :options="events" class="mb-3 text-dark" id="form-input-event--input" required v-model="selectedEvent"></b-form-select>
  </b-form-group>
  <b-form-group id="form-input-schedule" label="Schedule:" label-for="form-input-schedule--input" v-if="selectedEvent">
    <b-form-select id="form-input-schedule--input" v-model="selectedSchedule">
      <option :value="null">Select a schedule</option>
      <option :key="schedule._id" :value="schedule" v-for="schedule in schedules">{{schedule.day + ' ' + schedule.activity}}</option>
    </b-form-select>
  </b-form-group>
  <b-form-group id="form-day-number" label="Day Number:" label-for="form-day-number--input" v-if="selectedSchedule">
    <b-form-input class="text-dark" id="form-day-number--input" min="0" max="100" placeholder="Enter day number" required type="number" v-model="form.day_number"></b-form-input>
  </b-form-group>
  <b-form-group id="form-day-number" label="Day:" label-for="form-day--input" v-if="selectedSchedule">
    <b-form-input class="text-dark" id="form-day--input" min="1" placeholder="Enter day" required type="text" v-model="form.day"></b-form-input>
  </b-form-group>
  <b-form-group id="form-date" label="Date:" label-for="form-date--input" v-if="selectedSchedule">
    <base-input addon-left-icon="fa fa-calendar" id="form-date--input">
      <flatpickr :config="{altInput: true, dateFormat: 'Z', altFormat: 'J F Y' }" @on-close="blur" @on-open="focus" class="form-control text-dark datepicker" slot-scope="{focus, blur}" v-model="form.date"></flatpickr>
    </base-input>
  </b-form-group>
  <b-form-group id="form-activity-number" label="Activity:" label-for="form-activity--input" v-if="selectedSchedule">
    <b-form-input class="text-dark" id="form-activity--input" min="1" placeholder="Enter activity" required type="text" v-model="form.activity"></b-form-input>
  </b-form-group>
  <b-form-group id="form-start_time" label="Start Time:" label-for="form-start_time--input" v-if="selectedSchedule">
    <base-input addon-left-icon="far fa-clock" id="form-start_time--input">
      <flatpickr :config="{noCalendar: true, defaultDate: form.date, enableTime: true, altInput: true, dateFormat: 'h:i K', altFormat: 'h:i K' }" @on-close="blur" @on-open="focus" class="form-control text-dark datepicker" slot-scope="{focus, blur}" v-model="form.start_time"></flatpickr>
    </base-input>
  </b-form-group>
  <b-form-group id="form-end_time" label="End Time:" label-for="form-end_time--input" v-if="selectedSchedule">
    <base-input addon-left-icon="far fa-clock" id="form-end_time--input">
      <flatpickr :config="{noCalendar: true, defaultDate: form.date, enableTime: true, altInput: true, dateFormat: 'h:i K', altFormat: 'h:i K' }" @on-close="blur" @on-open="focus" class="form-control text-dark datepicker" slot-scope="{focus, blur}" v-model="form.end_time"></flatpickr>
    </base-input>
  </b-form-group>
  <b-form-group id="form-comments-number" label="Comments:" label-for="form-comments--input" v-if="selectedSchedule">
    <b-form-input class="text-dark" id="form-comments--input" min="1" placeholder="Enter comment" required type="text" v-model="form.comments"></b-form-input>
  </b-form-group>
  <b-form-group id="form-location-number" label="Location:" label-for="form-location--input" v-if="selectedSchedule">
    <b-form-input class="text-dark" id="form-location--input" min="1" placeholder="Enter location" required type="text" v-model="form.location"></b-form-input>
  </b-form-group>
  <b-form-group v-if="selectedSchedule">
    <div class="container">
      <span class="row align-items-center">
          <base-switch class v-model="form.visitor_view"></base-switch>
          <span class="ml-2">Visitor</span>
      </span>
    </div>
  </b-form-group>
  <b-form-group v-if="selectedSchedule">
    <div class="container">
      <span class="row align-items-center">
          <base-switch class="mb-1" v-model="form.participant_view"></base-switch>
          <span class="ml-2">Participant</span>
      </span>
    </div>
  </b-form-group>
  <b-form-group v-if="selectedSchedule">
    <div class="container">
      <span class="row align-items-center">
          <base-switch class="mb-1" v-model="form.volunteer_view"></base-switch>
          <span class="ml-2">Volunteer</span>
      </span>
    </div>
  </b-form-group>
  <b-alert :show="errors.length > 0" @dismissed="showDismissibleAlert=false" v-if="showDismissibleAlert" dismissible variant="danger">
    <div :key="error" v-for="error in errors">{{error}}</div>
  </b-alert>
  <b-alert :show="!!success_msg" variant="success">
    <div>{{success_msg}}</div>
  </b-alert>
  <b-button @click.prevent="onSubmit" variant="info">Update</b-button>
  <b-button type="reset" variant="danger">Reset</b-button>
</b-form>
</template>

<script>
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import {
  mapActions,
  mapGetters
} from "vuex";
export default {
  name: "schedule",
  components: {
    flatpickr: flatPicker
  },
  data() {
    return {

      config: {
        altInput: true,
        enableTime: true,
        noCalendar: true,
        dateFormat: "Z",
        altFormat: "h:i K"
      },
      events: [],
      schedules: [],
      selectedEvent: null,
      selectedSchedule: null,
      form: {
        day_number: null,
        day: null,
        date: null,
        activity: null,
        start_time: "07:00 AM",
        end_time: "07:00 PM",
        location: null,
        comments: null,
        volunteer_view: false,
        participant_view: false,
        visitor_view: false
      },
      showDismissibleAlert: false,
      success_msg: "",
      errors: []
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAdmin", "teams"])
  },
  methods: {
    ...mapActions([
      "getReq",
      "postReq",
      "getTeamsForEvent",
      "unsetTeams",
      "putReq"
    ]),
    async getSchedulesForEvent(id) {
      try {
        this.errors = []
        if (id) {
          let url = `/api/event/${id}/schedules`;
          let data = await this.getReq({
            url
          });
          this.schedules = data.event.schedules;
        }
      } catch (err) {
        console.log(err);
        this.showError("Couldn't get schedules.");
        this.schedules = [];
      }
    },
    async getEvents() {
      try {
        this.errors = []
        let url = "/api/event/";
        let data = await this.getReq({
          url
        });
        if (data.events) {
          if (data.events.length > 0) {
            this.events = [{
              value: null,
              text: "Select an event."
            }];
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
        this.showError("Couldn't get events.");
        this.events = [];
      }
    },
    async onSubmit() {
      try {
        this.success_msg = null;
        this.errors = [];
        if (this.selectedEvent && this.selectedSchedule) {
          let url = `/api/event/${this.selectedEvent}/schedule/${
            this.selectedSchedule._id
          }`;
          let res = await this.putReq({
            url: url,
            body: {
              day_number: this.form.day_number,
              day: this.form.day,
              date: this.form.date,
              activity: this.form.activity,
              start_time: this.form.start_time,
              end_time: this.form.end_time,
              location: this.form.location,
              comments: this.form.comments,
              volunteer_view: this.form.volunteer_view,
              participant_view: this.form.participant_view,
              visitor_view: this.form.visitor_view
            }
          });
          if (res.success) {
            this.success_msg = res.message;
          } else {
            this.showError(res.message);
          }
          this.onReset();
        } else {
          this.showError("Select an event and a schedule.");
        }
      } catch (error) {
        console.log(error);
        this.showError("Couldn't reach server. Try again later.");
        this.onReset();
      }
    },
    showError(msg) {
      this.showDismissibleAlert = true
      this.errors.push(msg)
    },
    onReset() {
      this.errors = []
      this.selectedEvent = null;
      this.selectedSchedule = null;
      this.form = {
        day_number: null,
        day: null,
        date: null,
        activity: null,
        start_time: "07:00 AM",
        end_time: "07:00 PM",
        location: null,
        comments: null,
        volunteer_view: false,
        participant_view: false,
        visitor_view: false
      };
    }
  },
  watch: {
    selectedEvent: function () {
      if (this.selectedEvent != null) {
        return this.getSchedulesForEvent(this.selectedEvent);
      }
      this.selectedTeam = null;
    },
    selectedSchedule: function () {
      if (this.selectedSchedule != null) {
        this.form = this.selectedSchedule;
      } else {
        this.form = {
          day_number: null,
          day: null,
          date: null,
          activity: null,
          start_time: "07:00 AM",
          end_time: "07:00 PM",
          location: null,
          comments: null,
          volunteer_view: false,
          participant_view: false,
          visitor_view: false
        };
      }
    }
  },
  beforeMount() {
    this.events = [];
    this.getEvents();
  }
};
</script>

<style lang="scss">
.form-control[readonly] {
  background-color: initial;
  padding-left: 0.5rem !important;
  padding-right: 0.5rem !important;
}
</style>