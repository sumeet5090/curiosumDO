<template>
<section class="section">
  <div class="container">
    <div class="row justify-content-center">
      <card class="col-sm-10 col-md-8 col-lg-8">
        <b-form @submit.prevent @reset.prevent>
          <b-form-group id="form-user_email" label="User email:" label-for="form-user_email--input" description="Enter user email">
            <b-row>
              <b-col sm="12" md="10">
                <base-input addon-left-icon="fa fa-user" id="form-user_email--input" type="text" required placeholder="Enter user email" v-model="search_email"></base-input>
              </b-col>
              <b-col sm="12" md="2">
                <b-button type="submit" variant="success" @click.prevent="searchUser"><i class="fa fa-search"></i></b-button>
              </b-col>
            </b-row>
          </b-form-group>
          <div v-if="!!(found_user)">
            <b-form-group id="form-users" label="Users:" label-for="form-users--badge">
              <span class="h4" v-if="found_user">
                <badge class="text-capitalize text-dark m-1 vertical-align-middle" type="primary" >
                  {{found_user.display_name}}
                  <base-button size="sm" type="warning" class="border-none" outline @click.prevent="removeUser()"><i class="fas fa-times"></i></base-button>
                </badge>
              </span>
            </b-form-group>
          </div>
          <b-alert variant="danger" dismissible v-if="errors.length > 0" :show="showDismissableAlert" @dismissed="showDismissableAlert=false">
            <div v-for="error in errors" :key="error">{{error}}</div>
          </b-alert>
          <b-alert variant="success" :show="!!success_msg">
            <div>{{success_msg}}</div>
          </b-alert>
          <b-button type="submit" variant="success" @click.prevent="onSubmit">Add</b-button>
          <b-button type="reset" variant="danger" @click.prevent="onReset">Reset</b-button>
        </b-form>
      </card>
    </div>
  </div>
</section>
</template>

<script>
import {
  mapGetters,
  mapActions
} from 'vuex'
export default {
  data() {
    return {
      showDismissableAlert: false,
      search_email: null,
      found_user: null,
      new_captain_email: null,
      errors: [],
      success_msg: null
    }
  },
  computed: {
    ...mapGetters(['currentUser', 'isAdmin'])
  },
  methods: {
    validator() {

    },
    async searchUser() {
      this.errors = [];
      this.success_msg = null;
      let email = this.search_email.trim();
      if (email) {
        let url = `/api/user/email/${email}/`,
          res_email,
          res_team,
          not_captain = true,
          team_url = `/api/team/`
        if (not_captain) {
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
          this.showError("You entered your email, this ain't it cheif.");
        }
      } else {
        this.showError("Email field is empty, slide it in that email.");
      }
      this.search_email = null;
    },
    onSubmit: function () {
      return;
    },
    onReset: function () {
      return;
    }
  },
  async asyncData({params}){

  }
}
</script>

<style lang="scss">

</style>
