<template>
<div>
  <modal :show.sync="confirmation.modal" gradient="success" modal-classes="modal-success modal-dialog-centered modal-sm" v-if="confirmation.modal">
    <h6 class="modal-title" id="modal-title-notification" slot="header">Are you sure?</h6>
    <div class="py-0 text-center">
      <i class="fas fa-bell fa-2x"></i>
      <h4 class="heading mt-2"></h4>
      <p>By confirming you are removing
        <br>
        <strong style="color: #FFF600;">{{confirmation.selectedTeam.team_name}}</strong> from
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
        <option :value="null" class="text-muted">Select an event</option>
        <option :value="event" :key="event._id" v-for="event in events">{{event.name}}</option>
      </b-form-select>
    </b-form-group>
    <b-form-group id="form-team" label="Team:" label-for="form-team--input">
      <b-form-select class="mb-3 text-dark" id="form-team--input" required v-model="selectedTeam">
        <option :value="null" class="text-muted">Select a team</option>
        <option :key="tm._id" :value="tm" v-for="tm in teams">{{tm.team_name}}</option>
      </b-form-select>
    </b-form-group>
    <b-alert :show="errors.length > 0" @dismissed="showDismissibleAlert=false" dismissible variant="danger">
      <div :key="error" v-for="error in errors">{{error}}</div>
    </b-alert>
    <b-alert :show="!!success_msg" variant="success">
      <div>{{success_msg}}</div>
    </b-alert>
    <b-button @click.prevent="onSubmit" variant="success">Unlink</b-button>
    <b-button type="reset" variant="danger">Reset</b-button>
  </b-form>
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
  name: "static-schedule",
  components: {
    flatpickr: flatPicker
  },
  data() {
    return {
      selectedEvent: null,
      selectedTeam: null,
      events: [],
      confirmation: {
        modal: false,
        selectedEvent: {},
        selectedTeam: {}
      },
      success_msg: "",
      errors: []
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAdmin", "teams"])
  },
  methods: {
    ...mapActions(["getReq", "postReq", "getTeamsForEvent", "unsetTeams", "putReq"]),
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
        this.errors.push("Couldn't get events.");
        this.events = [];
      }
    },
    onSubmit() {
      this.confirmation.selectedEvent = this.selectedEvent
      this.confirmation.selectedTeam = this.selectedTeam
      this.confirmation.modal = true
    },
    onReset() {
      this.selectedEvent = null;
      this.selectedTeam = null;
    },
    cancelledConf() {
      this.confirmation.selectedTeam = {};
      this.confirmation.selectedEvent = {};
      this.confirmation.modal = false
    },
    async confirmedConf() {
      try {
        this.success_msg = null;
        this.errors = [];
        if (this.selectedEvent && this.selectedTeam) {
          let url = `/api/team/${this.selectedTeam._id}/unlink/event/${this.selectedEvent._id}/`;
          let res = await this.postReq({
            url: url,
            body: {}
          });
          if (res.success) {
            this.success_msg = res.message;
          } else {
            this.errors.push(res.message);
          }
          this.onReset();
        } else {
          this.errors.push("Select an event and a team.");
        }
      } catch (error) {
        console.log(error);
        this.errors.push("Couldn't reach server. Try again later.");
        this.onReset();
      }
      this.confirmation.modal = false
    },

  },
  watch: {
    selectedEvent: function () {
      if (this.selectedEvent != null) {
        return this.getTeamsForEvent(this.selectedEvent._id);
      }
      this.selectedTeam = null;
    },
    selectedTeam: function () {
      if (this.selectedEvent == null) {
        this.selectedTeam = null;
        this.unsetTeams();
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
