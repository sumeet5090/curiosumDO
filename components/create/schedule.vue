<template>
  <b-form @submit.prevent>
    <b-form-group description="Select an event" id="form-event" label="Event:" label-for="form-event--input">
      <b-form-select class="mb-3 text-dark" id="form-event--input" required v-model="selectedEvent">
        <option :value="null">Select an event</option>
        <option :key="ev._id" :value="ev._id" v-for="ev in events">{{ev.name}}</option>
      </b-form-select>
    </b-form-group>
    <b-form-group id="form-day-number" label="Day Number:" label-for="form-day-number--input" v-if="selectedEvent">
      <b-form-input class="text-dark" id="form-day-number--input" min="1" placeholder="Enter day number" required type="number" v-model="form.day_number"></b-form-input>
    </b-form-group>
    <b-form-group id="form-day-number" label="Day:" label-for="form-day--input" v-if="selectedEvent">
      <b-form-input class="text-dark" id="form-day--input" min="1" placeholder="Enter day" required type="text" v-model="form.day"></b-form-input>
    </b-form-group>
    <b-form-group id="form-date" label="Date:" label-for="form-date--input" v-if="selectedEvent">
      <base-input addon-left-icon="fa fa-calendar" id="form-date--input">
        <flatpickr :config="{altInput: true, dateFormat: 'Z', altFormat: 'J F Y' }" @on-close="blur" @on-open="focus" class="form-control text-dark datepicker" slot-scope="{focus, blur}" v-model="form.date"></flatpickr>
      </base-input>
    </b-form-group>
    <b-form-group id="form-activity-number" label="Activity:" label-for="form-activity--input" v-if="selectedEvent">
      <b-form-input class="text-dark" id="form-activity--input" min="1" placeholder="Enter activity" required type="text" v-model="form.activity"></b-form-input>
    </b-form-group>
    <b-form-group id="form-start_time" label="Start Time:" label-for="form-start_time--input" v-if="selectedEvent">
      <base-input addon-left-icon="far fa-clock" id="form-start_time--input">
        <flatpickr :config="{noCalendar: true, defaultDate: form.date, enableTime: true, altInput: true, dateFormat: 'h:i K', altFormat: 'h:i K' }" @on-close="blur" @on-open="focus" class="form-control text-dark datepicker" slot-scope="{focus, blur}" v-model="form.start_time"></flatpickr>
      </base-input>
    </b-form-group>
    <b-form-group id="form-end_time" label="End Time:" label-for="form-end_time--input" v-if="selectedEvent">
      <base-input addon-left-icon="far fa-clock" id="form-end_time--input">
        <flatpickr :config="{noCalendar: true, defaultDate: form.date, enableTime: true, altInput: true, dateFormat: 'h:i K', altFormat: 'h:i K' }" @on-close="blur" @on-open="focus" class="form-control text-dark datepicker" slot-scope="{focus, blur}" v-model="form.end_time"></flatpickr>
      </base-input>
    </b-form-group>
    <b-form-group id="form-comments-number" label="Comments:" label-for="form-comments--input" v-if="selectedEvent">
      <b-form-input class="text-dark" id="form-comments--input" min="1" placeholder="Enter comment" required type="text" v-model="form.comments"></b-form-input>
    </b-form-group>
    <b-form-group id="form-location-number" label="Location:" label-for="form-location--input" v-if="selectedEvent">
      <b-form-input class="text-dark" id="form-location--input" min="1" placeholder="Enter location" required type="text" v-model="form.location"></b-form-input>
    </b-form-group>
    <b-form-group v-if="selectedEvent">
      <div class="container">
        <span class="row align-items-center">
          <base-switch class v-model="form.view.visitor"></base-switch>
          <span class="ml-2">Visitor</span>
        </span>
      </div>
    </b-form-group>
    <b-form-group v-if="selectedEvent">
      <div class="container">
        <span class="row align-items-center">
          <base-switch class="mb-1" v-model="form.view.participant"></base-switch>
          <span class="ml-2">Participant</span>
        </span>
      </div>
    </b-form-group>
    <b-form-group v-if="selectedEvent">
      <div class="container">
        <span class="row align-items-center">
          <base-switch class="mb-1" v-model="form.view.volunteer"></base-switch>
          <span class="ml-2">Volunteer</span>
        </span>
      </div>
    </b-form-group>
    <b-alert :show="showDismissableAlert" @dismissed="showDismissableAlert=false" dismissible v-if="errors.length > 0" variant="danger">
      <div :key="error" v-for="error in errors">{{error}}</div>
    </b-alert>
    <b-alert :show="!!success_msg" variant="success">
      <div>{{success_msg}}</div>
    </b-alert>
    <b-button @click.prevent="onSubmit" type="submit" variant="success">Submit</b-button>
    <b-button @click.prevent="onReset" type="reset" variant="danger">Reset</b-button>
  </b-form>
</template>

<script>
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    flatpickr: flatPicker
  },
  data() {
    return {
      showDismissableAlert: false,
      selectedEvent: null,
      selectedTeam: null,
      form: {
        day_number: null,
        day: null,
        date: null,
        activity: null,
        start_time: "07:00 AM",
        end_time: "07:00 PM",
        location: null,
        comments: null,
        view: {
          volunteer: false,
          participant: false,
          visitor: true
        }
      },
      success_msg: "",
      errors: []
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAdmin", "events", "teams"])
  },
  methods: {
    ...mapActions(["postReq", "getEvents", "getTeamsForEvent"]),
    async onSubmit() {
      this.success_msg = null;
      this.errors = [];
      try {
        if (this.validatedInputs()) {
          let url = `/api/event/${this.selectedEvent}/schedules`;
          let res = await this.postReq({
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
              volunteer_view: this.form.view.volunteer,
              participant_view: this.form.view.participant,
              visitor_view: this.form.view.visitor
            }
          });
          if (res.success) {
            this.success_msg = res.message;
            this.onReset();
          } else {
            this.showError(res.message);
            this.onReset();
          }
        } else {
          this.showError("Enter all fields.");
        }
      } catch (error) {
        console.log(error);
        this.showError("Couldn't reach server. Try again later.");
      }
    },
    showError(msg) {
      this.showDismissableAlert = true;
      this.errors.push(msg);
    },
    onReset() {
      this.errors = [];
      this.selectedEvent = null;
      this.form.day_number = null;
      this.form.day = null;
      this.form.date = null;
      this.form.activity = null;
      this.form.start_time = "07:00 AM";
      this.form.end_time = "07:00 PM";
      this.form.location = null;
      this.form.comments = null;
      this.form.view.volunteer = false;
      this.form.view.participant = false;
      this.form.view.visitor = true;
    },
    validatedInputs() {
      if (
        this.selectedEvent &&
        this.form.day_number &&
        this.form.day &&
        this.form.date &&
        this.form.activity &&
        this.form.start_time &&
        this.form.end_time &&
        this.form.location &&
        this.form.comments
      ) {
        return true;
      }
      return false;
    }
  },
  watch: {
    errors: function(val) {
      this.showDismissableAlert = true;
      this.errors = val;
    }
  },
  beforeMount() {
    this.getEvents();
  }
};
</script>

<style lang="scss">
</style>
