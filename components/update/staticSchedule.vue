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
    <b-form-group id="form-business-queue" label="Business:" label-for="form-business-queue--input" v-if="selectedTeam">
      <div class="container">
        <div class="row">
          <b-form-input class="mb-3 text-dark col-12" id="form-business-queue--input" placeholder="Queue" type="text" v-model="form.business.queue"></b-form-input>
          <base-input addon-left-icon="fa fa-calendar" class="col-12 col-lg-6 p-0 pr-1" id="form-business-start_time--input">
            <flatpickr :config="config" @on-close="blur" @on-open="focus" class="form-control text-dark datepicker" slot-scope="{focus, blur}" v-model="form.business.start_time"></flatpickr>
          </base-input>
          <base-input addon-left-icon="fa fa-calendar" class="col-12 col-lg-6 p-0 pl-1" id="form-business-end_time--input">
            <flatpickr :config="config" @on-close="blur" @on-open="focus" class="form-control text-dark datepicker" slot-scope="{focus, blur}" v-model="form.business.end_time"></flatpickr>
          </base-input>
        </div>
      </div>
    </b-form-group>
    <b-form-group id="form-cost-queue" label="Cost:" label-for="form-cost-queue--input" v-if="selectedTeam">
      <div class="container">
        <div class="row">
          <b-form-input class="mb-3 text-dark col-12" id="form-cost-queue--input" placeholder="Queue" type="text" v-model="form.cost.queue"></b-form-input>
          <base-input addon-left-icon="fa fa-calendar" class="col-12 col-lg-6 p-0 pr-1" id="form-cost-start_time--input">
            <flatpickr :config="config" @on-close="blur" @on-open="focus" class="form-control text-dark datepicker" slot-scope="{focus, blur}" v-model="form.cost.start_time"></flatpickr>
          </base-input>
          <base-input addon-left-icon="fa fa-calendar" class="col-12 col-lg-6 p-0 pl-1" id="form-cost-end_time--input">
            <flatpickr :config="config" @on-close="blur" @on-open="focus" class="form-control text-dark datepicker" slot-scope="{focus, blur}" v-model="form.cost.end_time"></flatpickr>
          </base-input>
        </div>
      </div>
    </b-form-group>
    <b-form-group id="form-design-queue" label="Design:" label-for="form-design-queue--input" v-if="selectedTeam">
      <div class="container">
        <div class="row">
          <b-form-input class="mb-3 text-dark col-12" id="form-design-queue--input" placeholder="Queue" type="text" v-model="form.design.queue"></b-form-input>
          <base-input addon-left-icon="fa fa-calendar" class="col-12 col-lg-6 p-0 pr-1" id="form-design-start_time--input">
            <flatpickr :config="config" @on-close="blur" @on-open="focus" class="form-control text-dark datepicker" slot-scope="{focus, blur}" v-model="form.design.start_time"></flatpickr>
          </base-input>
          <base-input addon-left-icon="fa fa-calendar" class="col-12 col-lg-6 p-0 pl-1" id="form-design-end_time--input">
            <flatpickr :config="config" @on-close="blur" @on-open="focus" class="form-control text-dark datepicker" slot-scope="{focus, blur}" v-model="form.design.end_time"></flatpickr>
          </base-input>
        </div>
      </div>
    </b-form-group>
    <b-alert :show="errors.length > 0" @dismissed="showDismissibleAlert=false" dismissible variant="danger">
      <div :key="error" v-for="error in errors">{{error}}</div>
    </b-alert>
    <b-alert :show="!!success_msg" variant="success">
      <div>{{success_msg}}</div>
    </b-alert>
    <b-button @click.prevent="onSubmit" variant="success">Update</b-button>
    <b-button type="reset" variant="danger">Reset</b-button>
  </b-form>
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
      config: {
        altInput: true,
        enableTime: true,
        noCalendar: true,
        dateFormat: "Z",
        altFormat: "h:i K"
      },
      tag: null,
      selectedEvent: null,
      selectedTeam: null,
      form: {
        business: {
          queue: null,
          start_time: "2018-12-25T04:30:00.000Z",
          end_time: "2018-12-25T05:30:00.000Z"
        },
        cost: {
          queue: null,
          start_time: "2018-12-25T04:30:00.000Z",
          end_time: "2018-12-25T05:30:00.000Z"
        },
        design: {
          queue: null,
          start_time: "2018-12-25T04:30:00.000Z",
          end_time: "2018-12-25T05:30:00.000Z"
        }
      },
      events: [
        {
          value: null,
          text: "Select an event"
        }
      ],
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
        if (this.selectedEvent && this.selectedTeam) {
          let url = `/api/event/${this.selectedEvent}/create/${
            this.selectedTeam
          }/static-schedule`;
          let res = await this.postReq({
            url: url,
            body: {
              business_queue: this.form.business.queue,
              business_start_time: this.form.business.start_time,
              business_end_time: this.form.business.end_time,
              cost_queue: this.form.cost.queue,
              cost_start_time: this.form.cost.start_time,
              cost_end_time: this.form.cost.end_time,
              design_queue: this.form.design.queue,
              design_start_time: this.form.design.start_time,
              design_end_time: this.form.design.end_time
            }
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
    },
    onReset() {
      this.selectedEvent = null;
      this.selectedTeam = null;
      this.form = {
        business: {
          queue: null,
          start_time: "2018-12-25T04:30:00.000Z",
          end_time: "2018-12-25T05:30:00.000Z"
        },
        cost: {
          queue: null,
          start_time: "2018-12-25T04:30:00.000Z",
          end_time: "2018-12-25T05:30:00.000Z"
        },
        design: {
          queue: null,
          start_time: "2018-12-25T04:30:00.000Z",
          end_time: "2018-12-25T05:30:00.000Z"
        }
      };
    },
    async getStaticSchedule(event_id, team_id) {
      try {
        if (event_id && team_id) {
          let url = `/api/event/${event_id}/${team_id}/static-schedule`
          console.log(url);
          let res = await this.getReq({
            url: url
          })
          if(res.success){
            console.log(res.static_schedule);
            this.form = res.static_schedule
          } else {
            this.form = {
              business: {
                queue: null,
                start_time: "2018-12-25T04:30:00.000Z",
                end_time: "2018-12-25T05:30:00.000Z"
              },
              cost: {
                queue: null,
                start_time: "2018-12-25T04:30:00.000Z",
                end_time: "2018-12-25T05:30:00.000Z"
              },
              design: {
                queue: null,
                start_time: "2018-12-25T04:30:00.000Z",
                end_time: "2018-12-25T05:30:00.000Z"
              }
            };
          }
        }
      } catch (error) {
        this.errors.push("Internal server error.");
      }
    }
  },
  watch: {
    selectedEvent: function() {
      if (this.selectedEvent != null) {
        return this.getTeamsForEvent(this.selectedEvent);
      }
      this.selectedTeam = null;
    },
    selectedTeam: function() {
      if (this.selectedEvent == null) {
        this.selectedTeam = null;
        this.unsetTeams();
      } else {
        console.log(this.selectedEvent, this.selectedTeam);
        this.getStaticSchedule(this.selectedEvent, this.selectedTeam);
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
