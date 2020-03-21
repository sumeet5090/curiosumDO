<template>
  <div class="position-relative">
    <section class="section pt-0">
      <b-container>
        <b-row class="justify-content-center">
          <clazy-load :src="imageHeader.src">
            <img :src="imageHeader.src" alt="CURIOSUM TECH TEAMS PORTAL" class="img-thumbnail border-0 shadow-none px-4">
          </clazy-load>
        </b-row>
        <b-row class="mt-2 px-4 mx-1">
          <b-col sm="12">
            <div class="text-dark font-md-small">
              <div class="text-center">

                <span>
                  Welcome to the
                  <strong>curiosumportal.in</strong>
                </span>
                This site is meant for team and user registration to events organized by the company. You can also view additional data such as event live schedules, inspection updates, lap times etc.
              </div>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </section>
    <section class="section has-cards pt-0">
      <div class="container">
        <div class="row justify-content-center">
          <div :key="event._id" class="col-11 mb-2 p-2" v-for="event in events">
            <div v-if="!event.past" v-show="!event.past">
              <div class="container">
                <div class="row justify-content-center">
                  <card class="col-12 border-0" no-body>
                    <div class="container">
                      <div class="row header-font">
                        <div class="col-lg-8">
                          <router-link :to="{name: 'event-id', params: {id: event.event_short}}" class="display-3 text-uppercase text-dark">{{event.name}}</router-link>
                        </div>
                        <div class="col-lg-4">
                          <div class="py-auto text-dark">{{formatDate(event.start_date, event.end_date)}}</div>
                          <div class="py-auto text-dark">{{event.venue}}</div>
                        </div>
                      </div>
                    </div>
                  </card>
                </div>
              </div>
              <div class="row mt-4">
                <div class="col-md-6 col-lg-4 mt-1 mt-lg-3" v-if="event.show_block.official_website">
                  <card body-classes="py-3" class="border-0" shadow>
                    <icon class="mb-3 i-curiosum" name="fas fa-link" rounded type="info"></icon>
                    <h6 class="text-curiosum text-uppercase font-weight-bold">Official Website</h6>
                    <p class="description mt-3 text-curiosum">Visit {{event.name}} official website!</p>
                    <a :href="event.link" class="btn btn-curiosum mt-2" rel="noreferrer" target="_blank">Website</a>
                  </card>
                </div>
                <div class="col-md-6 col-lg-4 mt-1 mt-lg-3" v-if="event.show_block.rules">
                  <card body-classes="py-3" class="border-0" shadow>
                    <icon class="mb-3 i-curiosum" name="fas fa-book" rounded type="default"></icon>
                    <h6 class="text-curiosum text-uppercase font-weight-bold">Rules</h6>
                    <p class="description mt-3 text-curiosum">Rule forum for {{event.name}}!</p>

                    <div>
                    <b-alert
                  :show="dismissCountDown"
                   dismissible
                   fade
                  variant="light"
                  @dismissed="dismissCountDown=0"
                  @dismiss-count-down="countDownChanged">
                 <h6>Please Login to view Forum</h6>
                 <b-progress
                  variant="light"
                 :max="dismissSecs"
                 :value="dismissCountDown"
                  height="1px">
                 </b-progress>
              </b-alert>
          </div>

          <div v-if="currentUser == null">
          <b-button @click="showAlert" variant="info" class="btn btn-curiosum mt-2">  Forum</b-button> </div>

                    <div v-else>
                    <router-link :to="{name: 'event-id-forum', params: {id: event.event_short}}" class="btn btn-curiosum mt-2" tag="a">Forum</router-link>
                     </div>
                  </card>
                </div>
                <div class="col-md-6 col-lg-4 mt-1 mt-lg-3" v-if="event.show_block.teams">
                  <card body-classes="py-3" class="border-0" shadow>
                    <icon class="mb-3 i-curiosum" name="fas fa-trophy" rounded type="primary"></icon>
                    <h6 class="text-curiosum text-uppercase font-weight-bold">Teams</h6>
                    <p class="description mt-3 text-curiosum">Check out all team for {{event.name}}!</p>
                    <router-link :to="{name: 'event-id-teams', params: {id: event.event_short}}" class="btn btn-curiosum mt-2" tag="a">{{event.event_short}} Teams</router-link>
                    <router-link :to="{name: 'teams-all'}" class="btn btn-curiosum-dark mt-2" tag="a">All</router-link>
                  </card>
                </div>
                <div class="col-md-6 col-lg-4 mt-1 mt-lg-3" v-if="event.show_block.schedule">
                  <card body-classes="py-3" class="border-0" shadow>
                    <icon class="mb-3 i-curiosum" name="fas fa-calendar" rounded type="success"></icon>
                    <h6 class="text-curiosum text-uppercase font-weight-bold">Schedule</h6>
                    <p class="description mt-3 text-curiosum">Day-to-day schedule for {{event.name}}!</p>
                    <router-link :to="{name: 'event-id-schedule', params: {id: event.event_short}}" class="btn btn-curiosum mt-2" tag="a">Schedule</router-link>
                  </card>
                </div>
                <div class="col-md-6 col-lg-4 mt-1 mt-lg-3" v-if="event.show_block.live_announcements">
                  <card body-classes="py-3" class="border-0" shadow>
                    <icon class="mb-3 i-curiosum" name="fas fa-bell" rounded type="warning"></icon>
                    <h6 class="text-curiosum text-uppercase font-weight-bold">Live Announcements</h6>
                    <p class="description mt-3 text-curiosum">Live announcement feed during {{event.name}}!</p>
                    <router-link :to="{name: 'event-id-announcements', params: {id: event.event_short}}" class="btn btn-curiosum mt-2" tag="a">Live Feed</router-link>
                  </card>
                </div>
                <div class="col-md-6 col-lg-4 mt-1 mt-lg-3" v-if="event.show_block.tech_inspection">
                  <card body-classes="py-3" class="border-0" shadow>
                    <icon class="mb-3 i-curiosum" name="fas fa-user-clock" rounded type="dark"></icon>
                    <h6 class="text-curiosum text-uppercase font-weight-bold">Tech Inspection Updates</h6>
                    <p class="description mt-3 text-curiosum">Live updates of tech inspections for {{event.name}}!</p>
                    <router-link :to="{name: 'event-id-tech-updates', params: {id: event.event_short}}" class="btn btn-curiosum mt-2" tag="a">Tech Updates</router-link>
                  </card>
                </div>
                <div class="col-md-6 col-lg-4 mt-1 mt-lg-3" v-if="event.show_block.live_timings">
                  <card body-classes="py-3" class="border-0" shadow>
                    <icon class="mb-3 i-curiosum" name="fas fa-clock" rounded type="default"></icon>
                    <h6 class="text-curiosum text-uppercase font-weight-bold">Live Timing</h6>
                    <p class="description mt-3 text-curiosum">Un-official time display of {{event.name}}!</p>
                    <router-link :to="{name: 'event-id-live-timings', params: {id: event.event_short}}" class="btn btn-curiosum mt-2" tag="a">Live Timings</router-link>
                  </card>
                </div>
              
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import api from "@/services/Event.service.js";
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  components: {},
  data() {
    return {
    dismissSecs: 1,
      dismissCountDown: 0,
      showMoreCards: false,
      imageHeader: {
        src: require("@/assets/images/brand/header.png"),
        loading: ""
      },
      imageHeader2: {
        src: require("@/assets/images/brand/CT-Portal-site-header.png"),
        loading: ""
      }
    };
  },
  async asyncData({ $axios, error }) {
    try {
      const { data } = await $axios.get(`/api/event`, {
        validateStatus: status => {
          return status < 400;
        }
      });
      return {
        isLoaded: data.success,
        events: data.events
      };
    } catch (err) {
      console.log(err);
      error({
        message: "Event not found",
        statusCode: 404
      });
    }
  },
  methods: {
  countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
      },
      showAlert() {
        this.dismissCountDown = this.dismissSecs
      },
    formatDate(start_date, end_date) {
      let d1 = moment(start_date).format(`DD MMM`);
      let d2 = moment(end_date).format(`DD MMM`);
      let y = moment(end_date).format(`YYYY`);
      return d1 + " - " + d2 + " " + y;
    },
    async fetchEvents() {
      // let response = await api.getMany();
      // if (!response) {
      //   return;
      // }
      // this.events = response.data.events;
    },
    handleCards() {
      this.showMoreCards = !this.showMoreCards;
    },
    sortEvents() {
      this.events.sort(function(a, b) {
        return a.start_date > b.start_date;
      });
    }
  },
  computed: {
    ...mapGetters(["currentUser", "isAdmin"])
  },

  beforeMount() {},
  mounted() {
    this.$nextTick(function() {});
  }
};
</script>

<style lang="scss">
@media screen and (max-width: 767px) {
  .font-md-small {
    font-size: 0.8rem;
  }
}
</style>
