<template>
  <div class="profile-page">
    <section class="section my-0">
      <div class="container">
        <card class="card-profile mt-0" no-body shadow>
          <div class="px-4 text-dark">
            <div class="row justify-content-center">
              <div class="col-lg-3 order-lg-2">
                <div class="card-profile-image">
                  <a class="profile-pic" href>
                    <img alt="Team Logo" class="rounded-circle" v-if="team.logo" v-lazy="team.logo" />
                    <img alt="Team Logo" src="@/assets/images/font-awesome/users-solid.svg" v-else />
                  </a>
                </div>
              </div>
              <div class="col-lg-4 order-3 order-lg-1">
                <div class="card-profile-stats d-flex justify-content-center">
                  <div>
                    <span class="heading" v-if="team.events">{{team.events.length}}</span>
                    <span class="heading" v-else>0</span>
                    <span class="description" v-if="!!team.events">Event{{team.events.length == 1? '' : 's'}}</span>
                    <span class="description" v-else>Events</span>
                  </div>
                  <div>
                    <span class="heading" v-if="team.users">{{team.users.length }}</span>
                    <span class="heading" v-else>0</span>
                    <span class="description" v-if="team.users && team.users.length === 1">Member</span>
                    <span class="description" v-else>Members</span>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 order-lg-3 text-lg-right align-self-lg-center">
                <div class="card-profile-actions py-2 mt-lg-1">
                  <span class="mr-1 text-center">
                    <a :href="team.website_url" rel="noreferrer" target="_blank" v-if="team.website_url">
                      <icon color="dark" name="fa fa-link" size="md"></icon>
                    </a>
                    <a :href="team.social.facebook" rel="noreferrer" target="_blank" v-if="team.social.facebook">
                      <icon name="fab fa-facebook-f" size="md" style="color: #3B5999"></icon>
                    </a>
                  </span>
                  <span class="float-right text-center">
                    <a :href="team.social.twitter" rel="noreferrer" target="_blank" v-if="team.social.twitter">
                      <icon name="fab fa-twitter" size="md" style="color: #1DA1F2"></icon>
                    </a>
                    <a :href="team.social.instagram" rel="noreferrer" target="_blank" v-if="team.social.instagram">
                      <icon color="danger" name="fab fa-instagram" size="md"></icon>
                    </a>
                  </span>
                </div>
              </div>
            </div>
            <div class="text-center mt-0 mt-md-2 pt-lg-2">
              <div class="pt-0 pt-sm--100 pt-md-2 pt-lg-1">
                <span class="display-3">{{team.team_name}}</span>
                <router-link :to="{name: 'team-id-settings', params: {id: team._id}}" class="btn btn-sm btn-link cursor-pointer mb-3" tag="a" v-if="showSettings">
                  <i class="fas fa-pen fa-2x"></i>
                </router-link>
              </div>
            </div>
            <div class="mt-0 mt-md-2 pt-lg-2">
              <div class="row mx-0 justify-content-center justify-content-md-between">
                <div class="card col-md-4 mt-1">
                  <div class="text-primary">Institution</div>
                  <div>
                    <strong>{{team.institution.name}}</strong>
                  </div>
                  <small class="text-muted">{{team.institution.address}}</small>
                  <small>{{team.location}}{{team.country && team.location ? ", ": ""}}{{team.country}}</small>
                </div>
                <div class="card col-md-7 mt-1" v-if="team.bio">
                  <div class="text-primary">Bio</div>
                  <div>
                    <p class="small">{{team.bio}}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-md-2 pt-lg-2 text-center" v-if="accessControl('adminOrTeamCaptain')">
              <b-form-row class="b-form-group-curiosum mb-0">
                <base-input :value="team.invite_link" @click.native="click2copyLink" class="col-md-9" id="invite-link"></base-input>
                <div class="col-md-3">
                  <base-button @click="genInviteLink" type="success">Generate Link</base-button>
                </div>
              </b-form-row>
              <div class="text-danger">
                <div v-if="expiresIn(team.invite_link_expiry) !== 'a few seconds'">
                  <span>Invite link expires in</span>
                  <span>{{expiresIn(team.invite_link_expiry)}}</span>
                </div>
              </div>
            </div>
            <div class="my-1 py-2 border-top" v-if="team.events && team.events.length > 0">
              <b-row class="justify-content-center">
                <h4 class="font-weight-bold text-dark">Events</h4>
              </b-row>
              <b-row class="justify-content-start">
                <b-col :key="event.event_short" sm="6" v-for="event in team.events">
                  <div class="text-center text-primary">
                    <a :href="event.link" class="btn btn-link" tag="a">{{event.name}}</a>
                  </div>
                </b-col>
              </b-row>
            </div>
            <div class="my-1 px-3 py-2 border-top" v-if="!!(team.users && team.users.length > 0)">
              <div class>
                <router-link :to="{name: 'team-id-members', params: team._id}" class="font-weight-bold text-dark cursor-pointer" tag="div">Members</router-link>
              </div>
              <b-row class="justify-content-start">
                <b-col :key="user.id" lg="2" md="3" sm="4" v-bind:class="{'team-captain order-first': !!isCaptain(team.captain, user._id), 'order-2': !isCaptain(team.captain, user._id)}" v-for="user in team.users">
                  <card class="team-user-profiles my-1" no-body tag="article">
                    <div class="text-center">
                      <img alt="User profile" class="rounded-circle" style="height: 64px; width: 64px; object-fit: cover;" v-lazy="user.profile.picture" />
                      <div class="my-2">
                        <router-link :to="'/profile/'+user.username" class="text-primary font-weight-300">{{user.display_name}}</router-link>
                        <div v-if="isCaptain(team.captain, user._id)">
                          <small class="text-muted">Captain</small>
                        </div>
                      </div>
                    </div>
                  </card>
                </b-col>
              </b-row>
            </div>
            <div class="my-1 py-2 border-top" v-if="!!(team.alumnus && team.alumnus.length > 0)">
              <div class="text-center">
                <router-link :to="{name: 'team-id-members', params: team._id}" class="h4 font-weight-bold text-dark cursor-pointer" tag="div">Alumni</router-link>
              </div>
              <b-row class="justify-content-center">
                <b-col :key="user.id" lg="2" md="3" sm="4" v-bind:class="{'team-captain order-first': !!isCaptain(team.captain, user._id), 'order-2': !isCaptain(team.captain, user._id)}" v-for="user in team.alumnus">
                  <card class="team-user-profiles my-1" no-body tag="article">
                    <div class="text-center">
                      <img alt="User profile" class="rounded-circle" v-lazy="user.profile.picture" />
                      <div class="my-2">
                        <router-link :to="'/profile/'+user.username" class="text-primary font-weight-300">{{user.display_name}}</router-link>
                      </div>
                    </div>
                  </card>
                </b-col>
              </b-row>
              <b-row class="justify-content-center">
                <div class="col-12 text-center">
                  <table class="table table-responsive-md table-sm table-hover table-bordered">
                    <thead>
                      <tr>
                        <th scope="col"></th>
                        <th scope="col">Queue</th>
                        <th scope="col">Date</th>
                        <th scope="col">Start time</th>
                        <th scope="col">End time</th>
                      </tr>
                    </thead>
                    <tbody :key="st_sc._id" v-for="st_sc in team.static_schedules">
                      <tr>
                        <th scope="row">Business</th>
                        <td>{{st_sc.business.queue}}</td>
                        <td>{{formatDate(st_sc.business.start_time)}}</td>
                        <td>{{getTime(st_sc.business.start_time)}}</td>
                        <td>{{getTime(st_sc.business.end_time)}}</td>
                      </tr>
                      <tr>
                        <th scope="row">Cost</th>
                        <td>{{st_sc.cost.queue}}</td>
                        <td>{{formatDate(st_sc.cost.start_time)}}</td>
                        <td>{{getTime(st_sc.cost.start_time)}}</td>
                        <td>{{getTime(st_sc.cost.end_time)}}</td>
                      </tr>
                      <tr>
                        <th scope="row">Design</th>
                        <td>{{st_sc.design.queue}}</td>
                        <td>{{formatDate(st_sc.design.start_time)}}</td>
                        <td>{{getTime(st_sc.design.start_time)}}</td>
                        <td>{{getTime(st_sc.design.end_time)}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </b-row>
            </div>
            <div class="my-1 py-2 border-top" v-if="team.drive_folder" v-show="!!(team.drive_folder)">
              <div class="text-center">
                <i class="fab fa-google-drive"></i>
                <h4 class="font-weight-bold text-dark">Team Drive folder</h4>
              </div>
              <b-row class="justify-content-center">
                <b-col lg="2" md="3" sm="3">
                  <card class="my-1" no-body tag="article">
                    <div class="text-center">
                      <a :href="team.drive_folder" class="btn btn-link" rel="noreferrer" target="_blank">Link</a>
                    </div>
                  </card>
                </b-col>
              </b-row>
            </div>
          </div>
        </card>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
const moment = require("moment");
import _ from "lodash";
export default {
  async asyncData({ $axios, params, error }) {
    try {
      const { data } = await $axios.get(`/api/team/${params.id}`, {
        validateStatus: status => {
          return status < 400;
        }
      });
      data.team.events.sort(
        (d1, d2) =>
          new Date(d2.start_date).getTime() - new Date(d1.start_date).getTime()
      );
      return {
        team: data.team
      };
    } catch (err) {
      console.log(err);
      return error({
        message: "Couldn't get team."
      });
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["currentUser", "isAdmin"]),
    showSettings: function() {
      if (this.currentUser) {
        return (
          this.isCaptain(this.currentUser._id, this.team.captain) ||
          this.isAdmin
        );
      }
    }
  },
  methods: {
    isCaptain: (cap, user) => (cap == user ? true : false),
    click2copyLink() {
      let temp = document.querySelector("#invite-link");
      if (temp) {
        temp.setAttribute("type", "text");
        temp.select();
        try {
          let copied = document.execCommand("copy");
          let msg = copied
            ? "URL copied to clipboard"
            : "Couldn't copy, try doing it manually.";
          this.alertMsg = msg;
          this.showAlert = true;
        } catch (e) {
          console.log(e);
        }
      }
    },

    genInviteLink() {
      if (this.team) {
        this.$axios
          .get(`/api/team/${this.team._id}/generate`)
          .then(res => {
            if (res.data && res.data.success) {
              console.log("Success");
              this.$router.go(this.$route.name);
            } else {
              this.$router.go(this.$route.name);
            }
          })
          .catch(err => console.log);
      }
    },
    expiresIn(time) {
      let nowD = moment();
      let timeD = moment(time);
      let diff = timeD.diff(nowD, "D");
      return moment.duration(diff).humanize();
    },
    accessControl(perm) {
      switch (perm) {
        case "admin":
          return !!this.isAdmin;
          break;
        case "adminOrTeamCaptain":
          if (this.currentUser) {
            return !!(
              this.isAdmin || this.team.captain == this.currentUser._id
            );
          }
          return false;
          break;
        case "user":
          return !!this.currentUser;
          break;
        default:
          return false;
          break;
      }
    },
    formatDate(date) {
      return moment(date).format("LL");
    },
    getTime(date) {
      return moment(date).format("hh:mm A");
    },
    sortByDate(events) {
      var a = events;
      return events;
    }
  }
};
</script>

<style lang="scss">
.b-form-group-curiosum {
  input {
    &,
    &:focus {
      &::placeholder {
        color: #4b2722aa;
      }
      text-align: center;
      background: none;
      border: 2px solid #4b2722;
      color: #4b2722;
    }
  }
  .form-group.input-group {
    margin-bottom: 0;
  }
  .form-text {
    color: #4b2722 !important;
  }
  margin-bottom: 1rem;
}
.profile-page .card-profile .card-profile-image img {
  box-shadow: none;
}
</style>
