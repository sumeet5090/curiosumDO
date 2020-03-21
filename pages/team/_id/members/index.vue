<template>
  <section class="section">
    <no-ssr>
      <b-container v-if="!!accessControl('adminOrTeamCaptain')">
        <modal :show.sync="confirmation.modal" gradient="danger" modal-classes="modal-danger modal-dialog-centered" v-if="confirmation.modal">
          <h6 class="modal-title" id="modal-title-notification" slot="header">Are you sure?</h6>
          <div class="py-3 text-center">
            <i class="fas fa-bell fa-2x"></i>
            <h4 class="heading mt-4"></h4>
            <p>
              By confirming this you are promoting
              <strong style="color: #FFF600;">{{confirmation.selectedUser.display_name}}</strong> to team captain.
            </p>
          </div>
          <template slot="footer">
            <base-button @click.prevent="cancelled" class="mr-auto" text-color="white" type="link">Cancel</base-button>
            <base-button @click.prevent="confirmed" type="success">Confirm</base-button>
          </template>
        </modal>
        <b-row class="justify-content-center">
          <b-col lg="10" md="10" sm="12">
            <b-alert :show="showDismissableAlert" @dismissed="showDismissableAlert=false" dismissible v-if="errors.length > 0" variant="danger">
              <div :key="error" v-for="error in errors">{{error}}</div>
            </b-alert>
            <b-alert :show="!!success_msg" @dismissed="success_msg=null" dismissible variant="success">
              <div>{{success_msg}}</div>
            </b-alert>
            <card class="card-profile" no-body shadow>
              <div class="container" v-if="team._id">
                <div class="row justify-content-center">
                  <router-link :to="{name: 'team-id', params: {id: team._id}}" class="h3 font-weight-bold cursor-pointer" tag="a">{{team.team_name}}</router-link>
                </div>
              </div>
              <div class="container">
                <h4 class="text-center text-capitalize text-dark font-weight-bold mt-3 py-2">Team Members</h4>
                <b-row class="justify-content-center">
                  <b-col :key="user.id" sm="4" v-bind:class="{'team-captain order-first': !!isCaptain(team.captain, user._id), 'order-2': !isCaptain(team.captain, user._id)}" v-for="user in team.users">
                    <card class="team-user-profiles mt-3" no-body tag="article">
                      <div class="text-center">
                        <img class="rounded-circle" v-lazy="user.profile.picture">
                        <div class="my-2">
                          <router-link :to="'/profile/'+user.username" class="text-primary font-weight-300">{{user.display_name}}</router-link>
                          <div v-if="isCaptain(team.captain, user._id)">
                            <small class="text-muted">Captain</small>
                          </div>
                          <div v-else>
                            <small @click.prevent="confirmationNotification(user)" class="btn btn-sm btn-danger btn-outline-danger">Make Captain</small>
                          </div>
                        </div>
                      </div>
                    </card>
                  </b-col>
                  <router-link :to="{name: 'team-id-members-add', params: {id: team._id}}" class="col-sm-4 col-md-3 col-lg-2 order-last" tag="div" v-if="accessControl('adminOrTeamCaptain')">
                    <card class="team-user-profiles text-center cursor-pointer" no-body tag="article">
                      <div class="card-body"></div>
                      <small>Add members</small>
                      <i class="far fa-plus-square fa-2x"></i>
                      <div class="card-body"></div>
                    </card>
                  </router-link>
                </b-row>
              </div>
            </card>
          </b-col>
        </b-row>
      </b-container>
    </no-ssr>
  </section>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      showDismissableAlert: false,
      confirmation: {
        modal: false,
        selectedUser: {}
      },
      team: {},
      success_msg: null,
      errors: []
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAdmin", "getTeam"])
  },
  methods: {
    ...mapActions(["getReq", "putReq", "setTeam"]),
    confirmationNotification(user) {
      this.confirmation.selectedUser = user;
      this.confirmation.modal = true;
    },
    async refreshTeam(id = null) {
      try {
        if (!id) {
          id = req.params.id;
        }
        let res = await this.getReq({
          url: `/api/team/${id}`
        });
        if (res.success) {
          this.team = res.team;
        } else {
          this.team = {};
        }
      } catch (error) {
        console.log(error);
      }
    },
    confirmed() {
      this.makeCaptain(this.confirmation.selectedUser._id);
    },
    cancelled() {
      this.confirmation.selectedUser = {};
      this.confirmation.modal = false;
    },
    showError(msg) {
      this.showDismissableAlert = true;
      this.errors.push(msg);
    },
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
    isCaptain: (cap, user) => (cap == user ? true : false),
    accessControl(perm) {
      switch (perm) {
        case "admin":
          if (this.isAdmin) {
            return true;
          }
          return false;
          break;
        case "adminOrTeamCaptain":
          if (!!this.currentUser) {
            if (this.isAdmin || this.team.captain == this.currentUser._id)
              return true;
          }
          return false;
          break;
        default:
          return false;
          break;
      }
    }
  },
  async asyncData({ params }) {
    return {
      params
    };
  },
  beforeMount() {
    this.$nextTick(function() {
      this.refreshTeam(this.params.id);
    });
  }
};
</script>

<style lang="scss">
</style>