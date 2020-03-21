<template>
<div class="custom-gradient">
  <no-ssr>
    <section class="section">
      <b-container  v-if="!!isAdmin">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <card>
              <div class="display-3 text-dark text-center mb-2">Create Event</div>
              <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
                <b-form-group id="form-eventname" label="Event Name:" label-for="form-eventname--input" description="What's the event called?">
                  <b-form-input id="form-eventname--input" type="text" v-model="form.event_name" required placeholder="Enter event name" class="text-dark"></b-form-input>
                </b-form-group>
                <b-form-group id="form-start-date" label="Start date:" label-for="form-start-date--input">
                  <base-input id="form-start-date--input" addon-left-icon="fa fa-calendar">
                    <flatpickr slot-scope="{focus, blur}" @on-open="focus" @on-close="blur" :config="{altInput: true, dateFormat: 'Z', altFormat: 'J F Y' }" class="form-control text-dark datepicker" v-model="form.event_start_date"></flatpickr>
                  </base-input>
                </b-form-group>
                <b-form-group id="form-end-date" label="End date:" label-for="form-end-date--input">
                  <base-input id="form-end-date--input" addon-left-icon="fa fa-calendar">
                    <flatpickr slot-scope="{focus, blur}" @on-open="focus" @on-close="blur" :config="{altInput: true, dateFormat: 'Z', altFormat: 'J F Y' }" class="form-control text-dark datepicker" v-model="form.event_end_date"></flatpickr>
                  </base-input>
                </b-form-group>
                <b-form-group id="form-eventshort" label="Event short name:" label-for="form-eventshort--input" description="Example: fb2019">
                  <b-form-input id="form-eventshort--input" type="text" v-model="form.event_short" required placeholder="Enter place" class="text-dark"></b-form-input>
                </b-form-group>
                <b-form-group id="form-eventvenue" label="Event Venue:" label-for="form-eventvenue--input" description="Where will the event take place?">
                  <b-form-input id="form-eventvenue--input" type="text" v-model="form.event_venue" required placeholder="Enter place" class="text-dark"></b-form-input>
                </b-form-group>
                <b-form-group id="form-eventlink" label="Event link:" label-for="form-eventlink--input" description="Link to official webpage for event">
                  <b-form-input id="form-eventlink--input" type="text" v-model="form.event_link" required placeholder="Enter link" class="text-dark"></b-form-input>
                </b-form-group>
                <b-form-group id="form-eventorganizers-list">
                </b-form-group>
                <b-form-group id="form-event-past">
                  <div class="container">
                    <span class="row align-items-center">
                      <base-switch class="mb-1" v-model="form.past"></base-switch>
                      <span class="ml-2">Past event?</span>
                    </span>
                  </div>
                </b-form-group>
                <b-alert variant="danger" dismissible :show="errors.length > 0" @dismissed="showDismissibleAlert=false">
                  <div v-for="error in errors" :key="error">{{error}}</div>
                </b-alert>
                <b-alert variant="success" :show="!!success_msg">
                  <div>{{success_msg}}</div>
                </b-alert>
                <b-button type="submit" variant="success">Create</b-button>
                <b-button type="reset" variant="warning">Reset</b-button>
              </b-form>
            </card>
          </div>
        </div>
      </b-container>
      <error-page v-else message="You are not authorized to view this content" icon="fas fa-exclamation-circle"></error-page>
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
      form: {
        event_name: null,
        event_start_date: null,
        event_end_date: null,
        event_venue: null,
        event_link: null,
        event_short: null,
        past: false,
      },
      success_msg: "",
      errors: []
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAdmin"])
  },
  methods: {
    ...mapActions(["postReq"]),
    async onSubmit() {
      try {
        this.success_msg = null
        this.errors = []
        let url = "/api/event/create"
        let res = await this.postReq({
          url: url,
          body: {
            event_name: this.form.event_name,
            start_date: this.form.event_start_date,
            end_date: this.form.event_end_date,
            event_venue: this.form.event_venue,
            event_link: this.form.event_link,
            event_short: this.form.event_short,
            past: this.form.past
          }
        });
        if (res.success) {
          this.success_msg = res.message
        } else {
          this.errors.push(res.message)
        }
      } catch (error) {
        console.log(error)
        this.errors.push("Couldn't reach server. Try again later.")
      }
    },
    onReset() {
      this.form.event_name = null
      this.form.event_start_date = null
      this.form.event_end_date = null
      this.form.event_venue = null
      this.form.event_link = null
      this.form.event_short = null
      this.form.past = false
      this.success_msg = ""
      this.errors = []
    },
    dropOrganizer(org) {
      let el = this.form.event_organizers.indexOf(org);
      if (el > -1) {
        this.form.event_organizers.splice(el, 1);
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
