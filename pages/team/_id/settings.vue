<template>
  <section class="section">
    <no-ssr>
      <b-container v-if="accessControl('user') && accessControl('adminOrTeamCaptain')">
        <modal :show.sync="captain_conf.modal" gradient="success" modal-classes="modal-success modal-dialog-centered modal-sm" v-if="captain_conf.modal">
          <h6 class="modal-title" id="modal-title-notification" slot="header">Are you sure?</h6>
          <div class="py-0 text-center">
            <i class="fas fa-bell fa-2x"></i>
            <h4 class="heading mt-2"></h4>
            <p>By confirming this you are promoting
              <br>
              <br>
              <strong style="color: #FFF600;">{{captain_conf.selectedUser.display_name}}</strong> to team captain.
            </p>
          </div>
          <template slot="footer">
            <base-button @click.prevent="cancelledCaptain" class="mr-auto" text-color="white" type="link">Cancel</base-button>
            <base-button @click.prevent="confirmedCaptain" type="secondary">Confirm</base-button>
          </template>
        </modal>
        <modal :show.sync="add_member.modal" gradient="secondary" modal-classes="modal-sm modal-secondary modal-dialog-centered" v-if="add_member.modal">
          <h6 class="modal-title" id="modal-title-notification" slot="header">Add team members</h6>
          <div class="container">
            <div class="row">
              <div class="col-12">
                <b-alert :show="showDismissableAlert" @dismissed="showDismissableAlert=false" dismissible v-if="errors.length > 0" variant="danger">
                  <div :key="error" v-for="error in errors">{{error}}</div>
                </b-alert>
                <b-alert :show="!!success_msg" variant="success">
                  <div>{{success_msg}}</div>
                  <div v-if="!!(add_member.sentEmails.length>0)">
                    <div>Invite sent to:</div>
                    <span :key="key" class="mx-1" v-for="(email, key) in add_member.sentEmails">{{email}}</span>
                  </div>
                </b-alert>
              </div>
            </div>
            <div class="row">
              <div class="col-12 text-center">
                <i class="fas fa-users fa-2x"></i>
              </div>
              <div class="col-12 text-center">Search for team members by email.</div>
            </div>
            <div class="row justify-content-center">
              <div class="col-9">
                <base-input id="form-teamname--input" placeholder="Enter user email" required type="text" v-model="add_member.currentEmail"></base-input>
              </div>
              <div class="col-3">
                <b-button @click.prevent="searchUser('add_member')" type="submit" variant="success">
                  <i class="fa fa-search"></i>
                </b-button>
              </div>
            </div>
            <div class="row" v-if="!!(add_member.user_list.length > 0)">
              <span :key="key" class="h4" v-for="(user, key) in add_member.user_list">
                <badge class="text-capitalize m-1 vertical-align-middle" type="secondary">
                  {{user.display_name}}
                  <base-button @click.prevent="removeUser('add_member', key)" class="border-none" outline size="sm" type="warning">
                    <i class="fas fa-times"></i>
                  </base-button>
                </badge>
              </span>
            </div>
          </div>
          <template slot="footer">
            <base-button @click.prevent="cancelledAddMember" class="mr-auto" outline type="warning">Cancel</base-button>
            <base-button @click.prevent="confirmedAddMember" type="success">Confirm</base-button>
          </template>
        </modal>
        <modal :show.sync="add_alumni.modal" gradient="secondary" modal-classes="modal-secondary modal-dialog-centered modal-sm" v-if="add_alumni.modal">
          <h6 class="modal-title" id="modal-title-notification" slot="header">Add Alumni</h6>
          <div class="container">
            <div class="row">
              <div class="col-12">
                <b-alert :show="showDismissableAlert" @dismissed="showDismissableAlert=false" dismissible v-if="errors.length > 0" variant="danger">
                  <div :key="error" v-for="error in errors">{{error}}</div>
                </b-alert>
                <b-alert :show="!!success_msg" variant="success">
                  <div>{{success_msg}}</div>
                  <div v-if="!!(add_alumni.sentEmails.length>0)">
                    <div>Invite sent to:</div>
                    <span :key="key" class="mx-1" v-for="(email, key) in add_alumni.sentEmails">{{email}}</span>
                  </div>
                </b-alert>
              </div>
            </div>
            <div class="row">
              <div class="col-12 text-center">
                <i class="fas fa-user-graduate fa-2x"></i>
              </div>
              <div class="col-12 text-center">Search for alumni by email.</div>
            </div>
            <div class="row justify-content-center p-0 m-0">
              <div class="col-10">
                <base-input id="form-teamname--input" placeholder="Enter user email" required type="email" v-model="add_alumni.currentEmail"></base-input>
              </div>
              <div class="col-2">
                <b-button @click.prevent="searchUser('add_alumni')" type="submit" variant="success">
                  <i class="fa fa-search"></i>
                </b-button>
              </div>
            </div>
            <div class="row" v-if="!!(add_alumni.user_list.length > 0)">
              <span :key="key" class="h4" v-for="(user, key) in add_alumni.user_list">
                <badge class="text-capitalize m-1 vertical-align-middle" type="secondary">
                  {{user.display_name}}
                  <base-button @click.prevent="removeUser('add_alumni', key)" class="border-none" outline size="sm" type="warning">
                    <i class="fas fa-times"></i>
                  </base-button>
                </badge>
              </span>
            </div>
          </div>
          <template slot="footer">
            <base-button @click.prevent="cancelledAddAlumni" class="mr-auto" outline type="warning">Cancel</base-button>
            <base-button @click.prevent="confirmedAddAlumni" type="success">Confirm</base-button>
          </template>
        </modal>
        <modal :show.sync="remove_member.modal" gradient="danger" modal-classes="modal-danger modal-dialog-centered modal-sm" v-if="remove_member.modal">
          <h6 class="modal-title" id="modal-title-notification" slot="header">Are you sure?</h6>
          <div class="py-3 text-center">
            <i class="fas fa-bell fa-2x"></i>
            <h4 class="heading mt-4"></h4>
            <p v-if="currentUser._id == remove_member.selectedUser._id">By confirming you will leave the team.</p>
            <p v-else>By confirming this you are removing
              <br>
              <strong style="color: #FFF600;">{{remove_member.selectedUser.display_name}}</strong> from the team.
            </p>
          </div>
          <template slot="footer">
            <base-button @click.prevent="cancelledRemoveMember" class="mr-auto" text-color="white" type="link">Cancel</base-button>
            <base-button @click.prevent="confirmedRemoveMember" type="success">Confirm</base-button>
          </template>
        </modal>
        <modal :show.sync="remove_alumni.modal" gradient="danger" modal-classes="modal-danger modal-dialog-centered modal-sm" v-if="remove_alumni.modal">
          <h6 class="modal-title" id="modal-title-notification" slot="header">Are you sure?</h6>
          <div class="py-3 text-center">
            <i class="fas fa-bell fa-2x"></i>
            <h4 class="heading mt-4"></h4>
            <p v-if="currentUser._id == remove_alumni.selectedUser._id">By confirming you will leave the team.</p>
            <p v-else>By confirming this you are removing
              <br>
              <strong style="color: #FFF600;">{{remove_alumni.selectedUser.display_name}}</strong> from the team.
            </p>
          </div>
          <template slot="footer">
            <base-button @click.prevent="cancelledRemoveAlumni" class="mr-auto" text-color="white" type="link">Cancel</base-button>
            <base-button @click.prevent="confirmedRemoveAlumni" type="success">Confirm</base-button>
          </template>
        </modal>
        <b-row class="justify-content-center">
          <div class="col-sm-12 col-md-10">
            <b-alert :show="showDismissableAlert" @dismissed="showDismissableAlert=false" dismissible v-if="errors" variant="danger">
              <div :key="error" v-for="error in errors">{{error}}</div>
            </b-alert>
            <b-alert :show="!!success_msg" variant="success">
              <div>{{success_msg}}</div>
            </b-alert>
            <card>
              <div class="container" v-if="team._id">
                <div class="row justify-content-center">
                  <router-link :to="{name: 'team-id', params: {id: team._id}}" class="h3 font-weight-bold cursor-pointer text-primary" tag="a">{{team.team_name}}</router-link>
                </div>
              </div>
              <b-form @reset="onReset" @submit.prevent>
                <b-form-group id="form-teamname" label="Team Name:" label-for="form-teamname--input" description="<span class='text-danger'>To change the team name, captain should send an email at <strong class='text-primary'>info@curiosumtech.in</strong> containing the previous name and the current name. We'll get back to you as soon as possible.</span>">
                  <base-input disabled id="form-teamname--input" placeholder="Enter team name" required type="text" :value="team.team_name"></base-input>
                </b-form-group>
                <b-form-group id="form-website-url" label="Social:">
                  <div class="row">
                    <base-input addon-left-icon="fa fa-link text-dark" class="col-sm-12 col-lg-6" placeholder="Enter Website URL" required type="text" v-model="team.website_url"></base-input>
                    <base-input addon-left-icon="fab fa-facebook facebook-icon" class="col-sm-12 col-lg-6" placeholder="Enter Facebook URL" required type="text" v-model="team.social.facebook"></base-input>
                    <base-input addon-left-icon="fab fa-instagram text-danger" class="col-sm-12 col-lg-6" placeholder="Enter Instagram URL" required type="text" v-model="team.social.instagram"></base-input>
                    <base-input addon-left-icon="fab fa-twitter twitter-icon" class="col-sm-12 col-lg-6" placeholder="Enter Twitter URL" required type="text" v-model="team.social.twitter"></base-input>
                  </div>
                </b-form-group>
                <b-form-group id="form-bio" label="Bio: " label-for="form-bio--input">
                  <b-form-textarea max-rows="4" rows="3" id="form-bio--input" no-resize placeholder="Enter bio" required type="text" v-model="team.bio"></b-form-textarea>
                </b-form-group>
                <div class="row">
                  <div class="col-sm-12 col-lg-6">
                    <b-form-group id="form-logo-url" label="Logo URL:" label-for="form-logo-url--input">
                      <base-input addon-left-icon="fas fa-image text-dark" id="form-logo-url--input" placeholder="Enter URL for logo" required type="link" v-model="team.logo"></base-input>
                    </b-form-group>
                  </div>
                  <div class="col-sm-12 col-lg-6">
                    <b-form-group id="form-drive_folder-url" label="Drive folder URL:" label-for="form-drive_folder-url--input" v-if="accessControl('admin')">
                      <base-input addon-left-icon="fab fa-google-drive text-dark" id="form-logo-url--input" placeholder="Enter URL for drive folder" required type="link" v-model="team.drive_folder"></base-input>
                    </b-form-group>
                  </div>
                </div>
                <div class="text-center">
                  <b-button @click.prevent="onSubmit" type="submit" variant="success">Update</b-button>
                  <b-button @click.prevent="onReset" type="reset" variant="danger">Reset</b-button>
                </div>
                <b-row class="justify-content-center border-top mt-3">
                  <h4 class="text-capitalize text-primary font-weight-bold">Members</h4>
                </b-row>
                <b-row class="justify-content-center">
                  <b-col :key="user.id" lg="3" md="4" v-bind:class="{'team-captain order-first': !!isCaptain(team.captain, user._id), 'order-2': !isCaptain(team.captain, user._id)}" v-for="user in team.users">
                    <card class="team-user-profiles mt-3" no-body tag="article">
                      <div class="text-center">
                        <img class="rounded-circle" style="height: 64px; width: 64px; object-fit: cover;" v-lazy="user.profile.picture">
                        <div class="my-2">
                          <router-link :to="'/profile/'+user.username" class="text-primary font-weight-300">{{user.display_name}}</router-link>
                          <div v-if="isCaptain(team.captain, user._id)">
                            <small class="text-muted">Captain</small>
                          </div>
                          <div v-else>
                            <small @click.prevent="captainConfirmNotification(user)" class="btn btn-sm btn-danger btn-outline-danger">Make Captain</small>
                          </div>
                          <div v-if="!!(currentUser._id == user._id)">
                            <small @click.prevent="removeMemberNotification(user)" class="btn btn-sm btn-danger btn-outline-danger">Leave team</small>
                          </div>
                          <div v-else>
                            <small @click.prevent="removeMemberNotification(user)" class="btn btn-sm btn-danger btn-outline-danger mt-1">Remove</small>
                          </div>
                        </div>
                      </div>
                    </card>
                  </b-col>
                  <div @click.prevent="addMemberNotification" class="col-md-4 col-lg-3 order-last" v-if="accessControl('adminOrTeamCaptain')">
                    <card class="team-user-profiles text-center cursor-pointer" no-body tag="article">
                      <div class="card-body"></div>
                      <small>Add member</small>
                      <i class="far fa-plus-square fa-2x"></i>
                      <div class="card-body"></div>
                    </card>
                  </div>
                </b-row>
                <b-row class="justify-content-center border-top mt-3">
                  <h4 class="text-capitalize text-primary font-weight-bold">Alumni</h4>
                </b-row>
                <b-row class="justify-content-center">
                  <b-col :key="alumni.id" lg="3" md="4" v-for="alumni in team.alumnus">
                    <card class="team-user-profiles mt-3" no-body tag="article">
                      <div class="text-center">
                        <img class="rounded-circle" v-lazy="alumni.profile.picture">
                        <div class="my-2">
                          <router-link :to="'/profile/'+alumni.username" class="text-primary font-weight-300">{{alumni.display_name}}</router-link>
                          <div v-if="!!(currentUser._id == alumni._id)">
                            <small @click.prevent="removeAlumniNotification(alumni)" class="btn btn-sm btn-danger btn-outline-danger">Leave team</small>
                          </div>
                          <div v-else>
                            <small @click.prevent="removeAlumniNotification(alumni)" class="btn btn-sm btn-danger btn-outline-danger mt-1">Remove</small>
                          </div>
                        </div>
                      </div>
                    </card>
                  </b-col>
                  <div @click.prevent="addAlumniNotification" class="col-md-4 col-lg-3 order-last" v-if="accessControl('adminOrTeamCaptain')">
                    <card class="team-user-profiles text-center cursor-pointer" no-body tag="article">
                      <div class="card-body"></div>
                      <small>Add alumni</small>
                      <i class="far fa-plus-square fa-2x"></i>
                      <div class="card-body"></div>
                    </card>
                  </div>
                </b-row>
              </b-form>
            </card>
          </div>
        </b-row>
      </b-container>
      <b-container v-else>
        <error-page message="You are not authorized to view this content."/>
      </b-container>
    </no-ssr>
  </section>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { isNullOrUndefined } from "util";
export default {
  data() {
    return {
      showDismissableAlert: false,
      success_msg: null,
      errors: [],
      team: {},
      captain_conf: {
        modal: false,
        selectedUser: {}
      },
      add_member: {
        modal: false,
        selectedUser: {},
        user_list: [],
        user_emails: [],
        sentEmails: [],
        currentEmail: null
      },
      add_alumni: {
        modal: false,
        selectedUser: {},
        user_list: [],
        user_emails: [],
        sentEmails: [],
        currentEmail: null
      },
      remove_member: {
        modal: false,
        selectedUser: {}
      },
      remove_alumni: {
        modal: false,
        selectedUser: {}
      },
      loaded: false
    };
  },
  computed: {
    ...mapGetters(["isAdmin", "currentUser"])
  },
  methods: {
    ...mapActions(["getReq", "postReq", "putReq"]),
    async onSubmit() {
      this.success_msg = null;
      this.errors = [];
      let res = await this.putReq({
        url: `/api/team/${this.params.id}`,
        body: {
          website_url: this.team.website_url,
          social: this.team.social,
          logo: this.team.logo,
          bio: this.team.bio,
          drive_folder: this.team.drive_folder,
          team_name: this.team.team_name
        }
      });
      if (res.success) {
        this.$router.go(this.$router.currentRoute);
        return (this.success_msg = res.message ? res.message : "Team updated.");
      } else {
        this.showError(res.message ? res.message : "Couldn't update team.");
      }
    },
    async onReset() {
      this.success_msg = null;
      this.showDismissableAlert = false;
      this.errors = [];
      await this.loadFormData();
    },
    async loadTeam() {
      try {
        let res = await this.getReq({
          url: `/api/team/${this.params.id}`
        });
        if (res.success) {
          this.team = res.team;
        } else {
          this.showError(res.message);
        }
      } catch (error) {
        console.log(error);
        this.showError("Internal server error.");
      }
    },
    async searchUser(For = "add_member") {
      this.errors = [];
      this.success_msg = null;
      let email = this[For].currentEmail.trim();
      if (email) {
        let url = `/api/user/email/${email}/`,
          res,
          unique = true;
        this[For].user_list.forEach(user => {
          if (user.email == email) {
            unique = false;
          }
        });
        if (unique) {
          res = await this.getReq({
            url
          });
          let res_team = await this.getReq({
            url: `/api/team/${this.params.id}/mini`
          });
          if (res.success == true) {
            if (For == "add_member") {
              if (isNullOrUndefined(res.user.team)) {
                this[For].user_emails.push(res.user.email);
                this[For].user_list.push({
                  _id: res.user._id,
                  display_name: res.user.display_name,
                  email: res.user.email
                });
              } else {
                this.showError("User already in a team.");
              }
            } else if(For == "add_alumni") {
              if (res_team.success == true) {
                if (res_team.team.alumnus) {
                  let alumnus = res_team.team.alumnus;
                  if (alumnus.indexOf(res.user._id) < 0) {
                    this[For].user_emails.push(res.user.email);
                    this[For].user_list.push({
                      _id: res.user._id,
                      display_name: res.user.display_name,
                      email: res.user.email
                    });
                  } else {
                    this.showError("User already an alumni.");
                  }
                }
              } else {
                this.showError("Try again later.");
              }
            }
          } else {
            this.showError("User not found.");
          }
        } else {
          this.showError("Already in queue.");
        }
      } else {
        this.showError("Enter a email.");
      }
      this[For].currentEmail = null;
    },
    removeUser(For = "add_member", id) {
      this[For].user_emails.splice(id, 1);
      this[For].user_list.splice(id, 1);
    },
    captainConfirmNotification(user) {
      this.captain_conf.selectedUser = user;
      this.captain_conf.modal = true;
    },
    confirmedCaptain() {
      this.makeCaptain(this.captain_conf.selectedUser._id);
      this.captain_conf.modal = false;
    },
    cancelledCaptain() {
      this.captain_conf.selectedUser = {};
      this.captain_conf.modal = false;
    },
    addMemberNotification(user) {
      this.add_member.selectedUser = user;
      this.add_member.modal = true;
    },
    async confirmedAddMember() {
      this.errors = [];
      this.success_msg = null;
      if (this.add_member.user_list.length > 0) {
        let res = await this.postReq({
          url: `/api/team/${this.params.id}/add/members`,
          body: {
            users: this.add_member.user_list,
            emails: this.add_member.user_emails
          }
        });
        if (res.success) {
          if (res.successful_emails.length > 0) {
            this.sentEmails = res.successful_emails;
          }
          this.success_msg = "Invitations sent!";
          this.add_member.user_list = [];
          this.add_member.user_emails = [];
          this.add_member.sentEmails = [];
          this.$router.go(this.$router.currentRoute);
          this.add_member.currentEmail = null;
        } else {
          this.showError(res.message);
        }
      } else {
        this.showError("No users invited.");
      }
    },
    cancelledAddMember() {
      this.add_member = {
        modal: false,
        selectedUser: {},
        user_list: [],
        user_emails: [],
        sentEmails: [],
        currentEmail: null
      };
    },
    addAlumniNotification(user) {
      this.add_alumni.modal = true;
      this.add_alumni.selectedUser = user;
    },
    async confirmedAddAlumni() {
      this.errors = [];
      this.success_msg = null;
      if (this.add_alumni.user_list.length > 0) {
        let res = await this.postReq({
          url: `/api/team/${this.params.id}/add/alumnus`,
          body: {
            users: this.add_alumni.user_list,
            emails: this.add_alumni.user_emails
          }
        });
        if (res.success) {
          if (res.successful_emails.length > 0) {
            this.sentEmails = res.successful_emails;
          }
          this.success_msg = "Invitations sent!";
          this.add_alumni.user_list = [];
          this.add_alumni.user_emails = [];
          this.add_alumni.sentEmails = [];
          this.add_alumni.currentEmail = null;
          this.$router.go(this.$router.currentRoute);
        } else {
          this.showError(res.message);
        }
      } else {
        this.showError("No users invited.");
      }
    },
    cancelledAddAlumni() {
      this.add_alumni.selectedUser = {};
      this.add_alumni.modal = false;
    },
    removeMemberNotification(user) {
      this.remove_member.selectedUser = user;
      this.remove_member.modal = true;
    },
    async confirmedRemoveMember() {
      try {
        this.success_msg = null;
        this.errors = [];
        let url = `/api/team/${this.params.id}/remove/member/${
          this.remove_member.selectedUser._id
        }`;
        let res = await this.postReq({
          url
        });
        if (res) {
          if (res.success) {
            this.success_msg = res.message ? res.message : "Removed member.";
            this.$router.go(this.$router.currentRoute);
          } else {
            this.showError(
              res.message ? res.message : "Couldn't remove member."
            );
          }
        }
      } catch (error) {
        this.showError("Couldn't remove member.");
      }
    },
    cancelledRemoveMember() {
      this.remove_member.selectedUser = {};
      this.remove_member.modal = false;
    },
    removeAlumniNotification(user) {
      this.remove_alumni.selectedUser = user;
      this.remove_alumni.modal = true;
    },
    async confirmedRemoveAlumni() {
      try {
        this.success_msg = null;
        this.errors = [];
        let url = `/api/team/${this.params.id}/remove/alumni/${
          this.remove_alumni.selectedUser._id
        }`;
        let res = await this.postReq({
          url
        });
        if (res) {
          if (res.success) {
            this.success_msg = res.message ? res.message : "Removed alumni.";
            this.$router.go(this.$router.currentRoute);
          } else {
            this.showError(
              res.message ? res.message : "Couldn't remove alumni."
            );
          }
        }
      } catch (error) {
        this.showError("Couldn't remove member.");
      }
    },
    cancelledRemoveAlumni() {
      this.remove_alumni.selectedUser = {};
      this.remove_alumni.modal = false;
    },
    isCaptain: (cap, user) => (cap == user ? true : false),
    async makeCaptain(user_id) {
      try {
        let team_id = this.params.id;
        let res = await this.putReq({
          url: `/api/team/${team_id}/captain`,
          body: {
            new_captain: user_id
          }
        });
        if (res.success) {
          this.success_msg = res.message;
          this.$router.go(this.$router.currentRoute);
        } else {
          this.showError(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    },
    showError(msg) {
      this.showDismissableAlert = true;
      this.errors.push(msg);
    },
    validatedInputs() {
      if (1) {
        return true;
      }
      return false;
    },
    accessControl(perm) {
      switch (perm) {
        case "admin":
          return !!this.isAdmin;
          break;
        case "adminOrTeamCaptain":
          return !!(this.isAdmin || this.team.captain == this.currentUser._id);
          break;
        case "user":
          return !!this.currentUser;
          break;
        default:
          return false;
          break;
      }
    }
  },
  async asyncData({ $axios, params, error }) {
    try {
      let { data } = await $axios.get(`/api/team/${params.id}`, {
        validateStatus: status => {
          return status < 400;
        }
      });
      if (data.success) {
        return {
          team: data.team,
          params
        };
      }
      return {
        params
      };
    } catch (err) {
      return error({
        message: "Team not found. Refresh or try again later."
      });
    }
  }
};
</script>

<style lang="scss">
.facebook-icon {
  color: rgb(59, 89, 153);
}

.twitter-icon {
  color: rgb(29, 161, 242);
}

.form-control {
  padding-left: 0.5rem !important;
  &:focus {
    color: black;
  }
}
</style>
