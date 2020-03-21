<template>
  <section class="section section-hero">
    <no-ssr v-if="loaded">
      <div class="container" v-if="!!accessControl('adminOrTeamCaptain')">
        <div class="row justify-content-center">
          <card class="col-sm-10 col-md-8 col-lg-8">
            <b-form @reset.prevent @submit.prevent>
              <b-form-group id="form-teamname" label="User email:" label-for="form-teamname--input">
                <b-row>
                  <b-col md="10" sm="12">
                    <base-input addon-left-icon="fa fa-user" id="form-teamname--input" placeholder="Enter user email" required type="text" v-model="user_email"></base-input>
                  </b-col>
                  <b-col md="2" sm="12">
                    <b-button @click.prevent="searchUser" type="submit" variant="success">
                      <i class="fa fa-search"></i>
                    </b-button>
                  </b-col>
                </b-row>
              </b-form-group>
              <div v-if="!!(users.length > 0)">
                <b-form-group id="form-usernames" label="Users:" label-for="form-usernames--badge">
                  <span :key="key" class="h4" v-for="(user, key) in users">
                    <badge class="text-capitalize text-dark m-1 vertical-align-middle" type="primary">
                      {{user.display_name}}
                      <base-button @click.prevent="removeUser(key)" class="border-none" outline size="sm" type="warning">
                        <i class="fas fa-times"></i>
                      </base-button>
                    </badge>
                  </span>
                </b-form-group>
              </div>
              <b-alert :show="showDismissableAlert" @dismissed="showDismissableAlert=false" dismissible v-if="errors.length > 0" variant="danger">
                <div :key="error" v-for="error in errors">{{error}}</div>
              </b-alert>
              <b-alert :show="!!success_msg" variant="success">
                <div>{{success_msg}}</div>
                <div v-if="!!(sentEmails.length>0)">
                  <div>Invite sent to:</div>
                  <span :key="key" class="mx-1" v-for="(email, key) in sentEmails">{{email}}</span>
                </div>
              </b-alert>
              <b-button @click.prevent="onSubmit" type="submit" variant="success">Add</b-button>
              <b-button @click.prevent="onReset" type="reset" variant="danger">Reset</b-button>
            </b-form>
          </card>
        </div>
      </div>
      <error-page color="warning" icon="fas fa-exclamation-circle" message="You are not authorized to add members." v-else></error-page>
    </no-ssr>
  </section>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { isNullOrUndefined } from "util";
export default {
  data() {
    return {
      showDismissableAlert: false,
      success_msg: null,
      errors: [],
      users: [],
      emails: [],
      user_email: null,
      sentEmails: [],
      loaded: false
    };
  },
  methods: {
    ...mapActions(["getReq", "postReq"]),
    async onSubmit() {
      this.errors = [];
      this.success_msg = null;
      if (this.users.length > 0) {
        let res = await this.postReq({
          url: `/api/team/${this.params.id}/add/members`, // Add team members
          body: {
            users: this.users,
            emails: this.emails
          }
        });
        if (res.success) {
          if (res.successful_emails.length > 0) {
            this.sentEmails = res.successful_emails;
          }
          this.success_msg = "Invitations sent!";
          this.emails = [];
          this.users = [];
          this.sentEmails = [];
          this.user_email = null;
        } else {
          this.showError(res.message);
        }
      } else {
        this.showError("No users invited.");
      }
    },
    async searchUser() {
      this.errors = [];
      this.success_msg = null;
      let email = this.user_email.trim();
      if (email) {
        let url = `/api/user/email/${email}/`,
          res,
          unique = true;
        this.users.forEach(user => {
          if (user.email == email) {
            unique = false;
          }
        });
        if (unique) {
          res = await this.getReq({
            url
          });
          if (res.success == true) {
            if (isNullOrUndefined(res.user.team)) {
              this.emails.push(res.user.email);
              this.users.push({
                _id: res.user._id,
                display_name: res.user.display_name,
                email: res.user.email
              });
            } else {
              this.showError("User already in a team.");
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
      this.user_email = null;
    },
    showError(msg) {
      this.showDismissableAlert = true;
      this.errors.push(msg);
    },
    removeUser(id) {
      this.emails.splice(id, 1);
      this.users.splice(id, 1);
    },
    onReset() {
      this.users = [];
      this.showDismissableAlert = false;
      this.success_msg = null;
      this.errors = [];
      this.emails = [];
      this.user_email = null;
      this.sentEmails = [];
    },
    accessControl(perm) {
      switch (perm) {
        case "admin":
          return !!this.isAdmin;
          break;
        case "adminOrTeamCaptain":
          if (this.currentUser) {
            if (this.isAdmin || this.team.captain == this.currentUser._id) {
              return true;
            }
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
    }
  },
  computed: {
    ...mapGetters(["currentUser", "isAdmin"])
  },
  async asyncData({ params, $axios }) {
    return {
      params
    };
  },
  created() {
    this.$nextTick(async function() {
      let res = await this.getReq({
        url: `/api/team/${this.params.id}/mini`
      });
      if (res.success) {
        this.team = res.team;
        this.loaded = true;
      } else {
        this.loaded = false;
        this.team = {};
      }
    });
  },
  watch: {}
};
</script>

<style lang="scss">
.border-none {
  border: none;
}
</style>
