<template>
  <div>
    <div class="profile-page" v-if="userTeam">
      <section class="section my-0">
        <div class="container">
          <card class="card-profile mt-0" no-body shadow>
            <div class="px-4 text-dark">
              <div class="row justify-content-center">
                <div class="col-lg-3 order-lg-2">
                  <div class="card-profile-image">
                    <a class="profile-pic" href>
                      <img alt="Team Logo" class="rounded-circle" v-if="userTeam.logo" v-lazy="userTeam.logo" />
                      <img alt="Team Logo" src="@/assets/images/font-awesome/users-solid.svg" v-else />
                    </a>
                  </div>
                </div>
                <div class="col-lg-4 order-3 order-lg-1">
                  <div class="card-profile-stats d-flex justify-content-center">
                    <div>
                      <span class="heading" v-if="userTeam.events">{{userTeam.events.length}}</span>
                      <span class="heading" v-else>0</span>
                      <span class="description" v-if="!!userTeam.events">Event{{userTeam.events.length == 1? '' : 's'}}</span>
                      <span class="description" v-else>Events</span>
                    </div>
                    <div>
                      <span class="heading" v-if="userTeam.users">{{userTeam.users.length }}</span>
                      <span class="heading" v-else>0</span>
                      <span class="description" v-if="userTeam.users && userTeam.users.length === 1">Member</span>
                      <span class="description" v-else>Members</span>
                    </div>
                  </div>
                </div>
                <div class="col-lg-4 order-lg-3 text-lg-right align-self-lg-center">
                  <div class="card-profile-actions py-2 mt-lg-1">
                    <span class="mr-1 text-center">
                      <a :href="userTeam.website_url" rel="noreferrer" target="_blank" v-if="userTeam.website_url">
                        <icon color="dark" name="fa fa-link" size="md"></icon>
                      </a>
                      <a :href="userTeam.social.facebook" rel="noreferrer" target="_blank" v-if="userTeam.social.facebook">
                        <icon name="fab fa-facebook-f" size="md" style="color: #3B5999"></icon>
                      </a>
                    </span>
                    <span class="float-right text-center">
                      <a :href="userTeam.social.twitter" rel="noreferrer" target="_blank" v-if="userTeam.social.twitter">
                        <icon name="fab fa-twitter" size="md" style="color: #1DA1F2"></icon>
                      </a>
                      <a :href="userTeam.social.instagram" rel="noreferrer" target="_blank" v-if="userTeam.social.instagram">
                        <icon color="danger" name="fab fa-instagram" size="md"></icon>
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              <div class="mt-md-2 pt-lg-2 text-center">
                <div class="pt-0 pt-sm--100 pt-md-2 pt-lg-1">
                  <router-link :to="{name: 'team-id', params: {id: userTeam._id}}">
                    <span class="display-3">{{userTeam.team_name}}</span>
                  </router-link>
                  <router-link :to="{name: 'team-id-settings', params: {id: userTeam._id}}" class="btn btn-sm btn-link cursor-pointer mb-3" tag="a" v-if="accessControl('adminOrTeamCaptain')">
                    <i class="fas fa-pen fa-2x"></i>
                  </router-link>
                </div>
              </div>
              <div class="mt-0 mt-md-2 pt-lg-2">
                <div class="row mx-0 justify-content-center justify-content-md-between">
                  <div class="card col-md-4 mt-1">
                    <div class="text-primary">Institution</div>
                    <div>
                      <strong>{{userTeam.institution.name}}</strong>
                    </div>
                    <small class="text-muted">{{userTeam.institution.address}}</small>
                    <small>{{userTeam.location}}{{userTeam.country && userTeam.location ? ", ": ""}}{{userTeam.country}}</small>
                  </div>
                  <div class="card col-md-7 mt-1" v-if="userTeam.bio">
                    <div class="text-primary">Bio</div>
                    <div>
                      <p class="small">{{userTeam.bio}}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-md-2 pt-lg-2 text-center" v-if="accessControl('adminOrTeamCaptain')">
                <b-form-row class="b-form-group-curiosum mb-0">
                  <base-input :value="userTeam.invite_link" @click.native="click2copyLink" class="col-md-9" id="invite-link"></base-input>
                  <div class="col-md-3">
                    <base-button @click="genInviteLink" type="success">Generate Link</base-button>
                  </div>
                </b-form-row>
                <div class="text-danger">
                  <div v-if="expiresIn(userTeam.invite_link_expiry) !== 'a few seconds ago'">
                    <span>Invite link expires in</span>
                    <span>{{expiresIn(userTeam.invite_link_expiry)}}</span>
                  </div>
                  <div v-else>
                    <span>Generate a link which can be used to join this team</span>
                  </div>
                </div>
              </div>
              <div class="my-1 py-2 border-top px-3" v-if="userTeam.events && userTeam.events.length > 0">
                <div class="text-primary">Events</div>
                <b-row class="justify-content-start">
                  <b-col :key="event.event_short" sm="6" v-for="event in userTeam.events">
                    <div class="text-center text-primary">
                      <a :href="event.link" class="btn btn-link" tag="a">{{event.name}}</a>
                    </div>
                  </b-col>
                </b-row>
              </div>
              <div class="my-1 py-2 border-top px-3" v-if="!!(userTeam.users && userTeam.users.length > 0)">
                <div class="text-primary">Members</div>
                <b-row class>
                  <b-col :key="user.id" lg="2" md="3" sm="4" v-bind:class="{'team-captain order-first': !!isCaptain(userTeam.captain, user._id), 'order-2': !isCaptain(userTeam.captain, user._id)}" v-for="user in userTeam.users">
                    <card class="team-user-profiles my-1" no-body tag="article">
                      <div class="text-center">
                        <img alt="User profile" class="rounded-circle" style="height: 64px; width: 64px; object-fit: cover;" v-lazy="user.profile.picture" />
                        <div class="my-2">
                          <router-link :to="'/profile/'+user.username" class="text-primary font-weight-300">{{user.display_name}}</router-link>
                          <div v-if="isCaptain(userTeam.captain, user._id)">
                            <small class="text-muted">Captain</small>
                          </div>
                        </div>
                      </div>
                    </card>
                  </b-col>
                </b-row>
              </div>
              <div class="my-1 py-2 border-top px-3" v-if="!!(userTeam.alumnus && userTeam.alumnus.length > 0)">
                <div class="text-primary">Alumni</div>
                <b-row class="justify-content-start">
                  <b-col :key="user.id" lg="2" md="3" sm="4" v-bind:class="{'team-captain order-first': !!isCaptain(userTeam.captain, user._id), 'order-2': !isCaptain(userTeam.captain, user._id)}" v-for="user in userTeam.alumnus">
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
              </div>
            </div>
          </card>
        </div>
      </section>
    </div>
    <section class="section custom-gradient" v-else>
      <no-ssr>
        <div class="container">
          <div class="row justify-content-center">
            <card class="col-md-4 px-0 mx-1 curiosum-gradient">
              <b-form @reset.prevent @submit.prevent class="form-create-team">
                <b-form-row class="mb-3">
                  <div class="col-12 text-center">
                    <i class="fas fa-users text-dark" style="font-size: 85px;"></i>
                  </div>
                </b-form-row>
                <b-form-row class="mb-3" style="min-height: 64px;">
                  <div class="col-12 text-center">
                    <span>Create a new team and invite team members.</span>
                  </div>
                </b-form-row>
                <b-form-group class="mb-3 b-form-group-curiosum" id="form-create" label-for="form-create--input">
                  <base-button @click="$router.push('/team/create')" class="col-12" id="form-create--input" type="curiosum">Create new team</base-button>
                </b-form-group>
              </b-form>
            </card>
            <card class="col-md-4 px-0 mx-1 curiosum-gradient">
              <b-form @reset.prevent @submit.prevent class="form-join-team">
                <b-form-row class="mb-3">
                  <div class="col-12 text-center">
                    <i class="fas fa-user-plus text-dark" style="font-size: 85px;"></i>
                  </div>
                </b-form-row>
                <b-form-row class="mb-3" style="min-height: 64px;">
                  <div class="col-12 text-center">
                    <span>Enter an invite link and join a team.</span>
                  </div>
                </b-form-row>
                <b-form-group class="mb-3 b-form-group-curiosum" id="form-join" label-for="form-join--input">
                  <base-button @click="modalShow = true" class="col-12" id="form-join--input" type="curiosum-dark">Join a team</base-button>
                </b-form-group>
              </b-form>
            </card>
            <b-modal centered hide-footer title="Join a team" v-model="modalShow">
              <div class="container">
                <div class="row mx-0 justify-content-center">
                  <div class="col-md-12">
                    <div class="text-center text-danger">{{joinTeamModalError}}</div>
                    <b-form-group class="mb-3 b-form-group-curiosum" description="Paste an invite link here." id="form-invite" label-for="form-invite--input">
                      <base-input addon-left-icon id="form-invite--input" required type="text" v-model="inviteLink"></base-input>
                    </b-form-group>
                    <b-form-group class="mb-3 b-form-group-curiosum" id="form-join" label-for="form-join--input">
                      <base-button @click="joinTeam" class="col-12" id="form-join--input" type="curiosum">Join</base-button>
                    </b-form-group>
                  </div>
                </div>
              </div>
            </b-modal>
          </div>
        </div>
      </no-ssr>
    </section>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment, { months } from "moment";
export default {
  data() {
    return {
      inviteLink: "",
      modalShow: false,
      userTeam: null,
      joinTeamModalError: "",
      alertMsg: "",
      showAlert: false
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"]),
    isJoin() {
      return this.inviteLink !== "";
    }
  },
  methods: {
    getTeam() {
      let user = this.currentUser;
      if (user.team) {
        let res = this.$axios
          .get(`/api/team/${user.team}`)
          .then(res => {
            if (res.data && res.data.success) {
              this.userTeam = res.data.team;
            }
          })
          .catch(err => console.log);
      }
    },
    genInviteLink() {
      if (this.userTeam) {
        this.$axios
          .get(`/api/team/${this.userTeam._id}/generate`)
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
      return moment.duration(diff).humanize({ precision: 3 });
    },
    joinTeam() {
      this.joinTeamModalError = "";
      let url = this.inviteLink;
      let splUrl = url.split("/");
      let nnid = splUrl[splUrl.length - 1];
      this.$axios
        .get(`/api/team/verify/${nnid}`)
        .then(res => {
          if (res.data && res.data.success) {
            console.log("Successfully joined team");
            this.joinTeamModalError = "";
            this.$router.go(this.$route.name);
          } else {
            this.joinTeamModalError = res.data.message
              ? res.data.message
              : "Unable to join the team. Try again with a different link.";
          }
        })
        .catch(err => console.log);
    },
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
    isCaptain: (cap, user) => (cap == user ? true : false),
    accessControl(perm) {
      switch (perm) {
        case "admin":
          return !!this.isAdmin;
          break;
        case "adminOrTeamCaptain":
          if (this.currentUser) {
            return !!(
              this.isAdmin || this.userTeam.captain == this.currentUser._id
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
  },
  mounted() {
    this.$nextTick(() => {
      if (!this.isAuthenticated) {
        window.location.href = "/login";
      } else {
        this.getTeam();
      }
      console.log;
    });
  }
};
</script>

<style lang="scss">
</style>