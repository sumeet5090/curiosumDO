<template>
<div>
  <no-ssr>
    <section class="section">
      <b-container v-if="!!isAdmin">
        <div class="row justify-content-center">
        <div class="col-md-8">
          <card no-body class="px-3 py-2">
            <div class="display-3 text-dark text-center mb-2">Update Event</div>
            <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
              <b-form-select id="form-event--input" required v-model="selectedEvent" class="mb-3 text-dark">
                <option :value="{}" class="text-dark">Select an event</option>
                <option :value="ev" v-for="ev in events" :key="ev._id" class="text-dark">{{ev.name}}</option>
              </b-form-select>
              <b-form-group id="form-eventname" label="Event name:" label-for="form-eventname--input" v-if="selectedEvent._id != null">
                <b-form-input id="form-eventname--input" type="text" v-model="form.event_name" class="text-dark" required placeholder="Enter event name."></b-form-input>
              </b-form-group>
              <b-form-group id="form-start-date" label="Start date:" label-for="form-start-date--input" v-if="selectedEvent._id != null">
                <base-input id="form-start-date--input" addon-left-icon="fa fa-calendar">
                  <flatpickr slot-scope="{focus, blur}" @on-open="focus" @on-close="blur" :config="{altInput: true, dateFormat: 'Z', altFormat: 'J F Y' }" class="form-control text-dark datepicker" v-model="form.event_start_date"></flatpickr>
                </base-input>
              </b-form-group>
              <b-form-group id="form-end-date" label="End date:" label-for="form-end-date--input" v-if="selectedEvent._id != null">
                <base-input id="form-end-date--input" addon-left-icon="fa fa-calendar">
                  <flatpickr slot-scope="{focus, blur}" @on-open="focus" @on-close="blur" :config="{altInput: true, dateFormat: 'Z', altFormat: 'J F Y' }" class="form-control text-dark datepicker" v-model="form.event_end_date"></flatpickr>
                </base-input>
              </b-form-group>
              <b-form-group id="form-eventshort" label="Event short name:" label-for="form-eventshort--input" description="Example: fb2019" v-if="selectedEvent._id != null">
                <b-form-input id="form-eventshort--input" type="text" v-model="form.event_short" class="text-dark" required placeholder="Enter short name"></b-form-input>
              </b-form-group>
              <b-form-group id="form-eventvenue" label="Event Venue:" label-for="form-eventvenue--input" description="Where will the event take place?" v-if="selectedEvent._id != null">
                <b-form-input id="form-eventvenue--input" type="text" v-model="form.event_venue" class="text-dark" required placeholder="Enter place"></b-form-input>
              </b-form-group>
              <b-form-group id="form-eventlink" label="Event link:" label-for="form-eventlink--input" description="Link to official webpage for event" v-if="selectedEvent._id != null">
                <b-form-input id="form-eventlink--input" type="text" v-model="form.event_link" class="text-dark" required placeholder="Enter link"></b-form-input>
              </b-form-group>
              <b-form-group id="form-past" label="Event past: " label-for="form-past--input" description="Remove event from frontpage." v-if="selectedEvent._id != null">
                <div class="container">

                <span class="row align-items-center">
                  <base-switch class="mb-1" v-model="form.event_past"></base-switch>
                </span>
              </div>
              </b-form-group>
              <b-form-row v-if="selectedEvent._id != null">
                <b-col md="6" class="d-flex align-content-center">
                  <base-switch class="mb-1" v-model="form.show_block.official_website"></base-switch>
                  <span class="ml-2">Show official website</span>
                </b-col>
                <b-col md="6" class="d-flex align-content-center">
                  <base-switch class="mb-1" v-model="form.show_block.rules"></base-switch>
                  <span class="ml-2">Rules</span>
                </b-col>
                <b-col md="6" class="d-flex align-content-center">
                  <base-switch class="mb-1" v-model="form.show_block.teams"></base-switch>
                  <span class="ml-2">Teams</span>
                </b-col>
                <b-col md="6" class="d-flex align-content-center">
                  <base-switch class="mb-1" v-model="form.show_block.live_announcements"></base-switch>
                  <span class="ml-2">Live announcements</span>
                </b-col>
                <b-col md="6" class="d-flex align-content-center">
                  <base-switch class="mb-1" v-model="form.show_block.schedule"></base-switch>
                  <span class="ml-2">Schedule</span>
                </b-col>
                <b-col md="6" class="d-flex align-content-center">
                  <base-switch class="mb-1" v-model="form.show_block.tech_inspection"></base-switch>
                  <span class="ml-2">Tech Inspection</span>
                </b-col>
                <b-col md="6" class="d-flex align-content-center">
                  <base-switch class="mb-1" v-model="form.show_block.live_timings"></base-switch>
                  <span class="ml-2">Live timings</span>
                </b-col>
              </b-form-row>
              <b-alert variant="danger" dismissible :show="errors.length > 0" @dismissed="showDismissibleAlert=false">
                <div v-for="error in errors" :key="error">{{error}}</div>
              </b-alert>
              <b-alert variant="success" :show="!!success_msg">
                <div>{{success_msg}}</div>
              </b-alert>
              <b-button type="submit" variant="primary" v-if="selectedEvent._id != null">Update</b-button>
              <b-button type="reset" variant="danger" v-if="selectedEvent._id != null">Reset</b-button>
            </b-form>
          </card>
        </div>
      </div>
      </b-container>
      <error-page v-else icon="fas fa-exclamation-triangle" message="You are not authorized to view this content."></error-page>
    </section>
  </no-ssr>
</div>
</template>

<script>
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import {
  mapActions,
  mapGetters
} from "vuex";
export default {
  components: {
    flatpickr: flatPicker
  },
  data() {
    return {
      selectedEventId: null,
      selectedEvent: {},
      form: {
        event_name: null,
        event_start_date: null,
        event_end_date: null,
        event_venue: null,
        event_link: null,
        event_short: null,
        event_past: false,
        show_block: {
          official_website: true,
          teams: true,
          rules: true,
          schedule: false,
          tech_inspection: false,
          live_timings: false,
          live_announcements: false,
        }
      },
      success_msg: "",
      errors: []
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAdmin", "events"])
  },
  methods: {
    ...mapActions(["getEvents", "putReq"]),
    async onSubmit() {
      try {
        this.success_msg = null
        this.errors = []
        let url = `/api/event/${this.selectedEventId}`
        let res = await this.putReq({
          url: url,
          body: {
            start_date: this.form.event_start_date,
            end_date: this.form.event_end_date,
            venue: this.form.event_venue,
            link: this.form.event_link,
            event_short: this.form.event_short,
            past: this.form.event_past,
            show_block: this.form.show_block
          }
        });
        if (res.success) {
          this.onReset()
          this.success_msg = res.message
          this.getEvents()
        } else {
          this.errors.push(res.message)
        }
      } catch (error) {
        console.log(error)
        this.errors.push("Couldn't reach server. Try again later.")
      }
    },
    onReset() {
      this.selectedEvent = {}
      this.selectedEventId = null
      this.form.event_name = null
      this.form.event_link = null
      this.form.event_venue = null
      this.form.event_short = null
      this.form.event_start_date = null
      this.form.event_end_date = null
      this.form.event_past = false
      this.errors = []
      this.success_msg = ""
    },
    dropOrganizer(org) {
      let el = this.form.event_organizers.indexOf(org);
      if (el > -1) {
        this.form.event_organizers.splice(el, 1);
      }
    },
  },
  created() {
    this.$nextTick(function () {
      this.getEvents();
    });
  },
  watch: {
    selectedEvent: function () {
      if (this.selectedEvent != undefined) {
        this.selectedEventId = this.selectedEvent._id
        this.form.event_name = this.selectedEvent.name
        this.form.event_start_date = this.selectedEvent.start_date
        this.form.event_end_date = this.selectedEvent.end_date
        this.form.event_link = this.selectedEvent.link
        this.form.event_venue = this.selectedEvent.venue
        this.form.event_short = this.selectedEvent.event_short
        this.form.event_past = this.selectedEvent.past
      } else {
        this.onReset()
      }
    }
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
