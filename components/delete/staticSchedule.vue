<template>
  <div>
    <modal :show.sync="confirmation.modal" gradient="success" modal-classes="modal-success modal-dialog-centered modal-sm" v-if="confirmation.modal">
      <h6 class="modal-title" id="modal-title-notification" slot="header">Are you sure?</h6>
      <div class="py-0 text-center">
        <i class="fas fa-bell fa-2x"></i>
        <h4 class="heading mt-2"></h4>
        <p>By confirming you are removing static schedule for
          <br>
          <strong style="color: #FFF600;">{{confirmation.selectedStaticSchedule.team.team_name}}</strong> from
          <br>
          <strong style="color: #FFF600;">{{confirmation.selectedEvent.name}}</strong>
        </p>
      </div>
      <template slot="footer">
        <base-button @click.prevent="cancelledConf" class="mr-auto" text-color="white" type="link">Cancel</base-button>
        <base-button @click.prevent="confirmedConf" type="secondary">Confirm</base-button>
      </template>
    </modal>
    <b-form @reset.prevent="onReset" @submit.prevent>
      <b-form-group id="form-input-event" label="Event:" label-for="form-input-event--input">
        <b-form-select class="mb-3 text-dark" id="form-input-event--input" required v-model="selectedEvent">
          <option :value="null" class="text-muted">Select an event.</option>
          <option :key="event._id" :value="event" v-for="event in events">{{event.name}}</option>
        </b-form-select>
      </b-form-group>
      <b-form-group id="form-team" label="Team:" label-for="form-team--input">
        <b-form-select class="mb-3 text-dark" id="form-team--input" required v-model="selectedStaticSchedule">
          <option :value="null" class="text-muted">Select a static schedule.</option>
          <option :key="stsc._id" :value="stsc" v-for="stsc in staticSchedules">{{stsc.team.team_name}}</option>
        </b-form-select>
      </b-form-group>
      <b-alert :show="errors.length > 0" @dismissed="showDismissibleAlert=false" dismissible v-if="showDismissibleAlert" variant="danger">
        <div :key="error" v-for="error in errors">{{error}}</div>
      </b-alert>
      <b-alert :show="!!success_msg" variant="success">
        <div>{{success_msg}}</div>
      </b-alert>
      <b-button @click.prevent="onSubmit" variant="danger">Remove</b-button>
      <b-button type="reset" variant="warning">Reset</b-button>
    </b-form>
  </div>
</template>

<script>
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "static-schedule",
  components: {
    flatpickr: flatPicker
  },
  data() {
    return {
      selectedEvent: null,
      selectedStaticSchedule: null,
      showDismissibleAlert: false,
      events: [],
      staticSchedules: [],
      confirmation: {
        modal: false,
        selectedEvent: {},
        selectedStaticSchedule: {}
      },
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
      "delReq",
      "getTeamsForEvent",
      "unsetTeams",
      "putReq"
    ]),
    async getStaticSchedules(id) {
      try {
        let url = `/api/event/${id}/static-schedule`;
        let res = await this.getReq({
          url
        });
        if (res.success) {
          this.staticSchedules = res.static_schedules;
        } else {
          this.staticSchedules = [];
        }
      } catch (error) {
        console.log(error);
        this.staticSchedules = [];
      }
    },
    async getEvents() {
      try {
        let url = "/api/event/";
        let data = await this.getReq({
          url
        });
        if (data.events) {
          if (data.events.length > 0) {
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
        this.showErr("Couldn't get events.");
        this.events = [];
      }
    },
    onSubmit() {
      if (this.selectedEvent && this.selectedStaticSchedule) {
        this.confirmation.selectedEvent = this.selectedEvent;
        this.confirmation.selectedStaticSchedule = this.selectedStaticSchedule;
        this.confirmation.modal = true;
      } else {
        this.showErr("Please select an event and a static schedule.");
        this.confirmation.modal = false;
      }
    },
    onReset() {
      this.selectedEvent = null;
      this.selectedStaticSchedule = null;
    },
    cancelledConf() {
      this.confirmation.selectedStaticSchedule = {};
      this.confirmation.selectedEvent = {};
      this.confirmation.modal = false;
    },
    showErr(msg) {
      this.showDismissibleAlert = true;
      this.errors.push(msg);
    },
    async confirmedConf() {
      this.success_msg = null;
      this.errors = [];
      if (
        this.confirmation.selectedEvent &&
        this.confirmation.selectedStaticSchedule
      ) {
        let url = `/api/event/${
          this.confirmation.selectedEvent._id
        }/static-schedule/${this.confirmation.selectedStaticSchedule._id}/`;
        try {
          let res = await this.delReq({
            url: url
          });
          if (res.success) {
            this.success_msg = res.message;
          } else {
            this.showErr(res.message);
          }
          this.onReset();
        } catch (error) {
          console.log(error);
          this.showErr("Couldn't reach server. Try again later.");
          this.onReset();
        }
      } else {
        this.showErr("Select an event and a static schedule.");
      }
    }
  },
  watch: {
    selectedEvent: function() {
      if (this.selectedEvent != null) {
        this.getStaticSchedules(this.selectedEvent._id);
      }
      this.selectedStaticSchedule = null;
    },
    // selectedStaticSchedule: function() {
    // }
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
