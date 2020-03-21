<template>
<section class="section">
  <no-ssr>
    <b-container v-if="accessControl('user') && accessControl('adminOrTeamCaptain')">
      <b-row class="justify-content-center">
        <div class="col-sm-12 col-md-10">
          <card>
            <b-form @reset="onReset" @submit.prevent>
              <b-form-group id="form-teamname" label="Team Name:" label-for="form-teamname--input">
                <base-input id="form-teamname--input" placeholder="Enter team name" required type="text" v-model="form.team_name"></base-input>
              </b-form-group>
              <b-form-group id="form-website-url" label="Social:">
                <base-input addon-left-icon="fa fa-link text-dark" placeholder="Enter Website URL" required type="text" v-model="form.website_url"></base-input>
                <base-input addon-left-icon="fab fa-facebook facebook-icon" placeholder="Enter Facebook URL" required type="text" v-model="form.social.facebook"></base-input>
                <base-input addon-left-icon="fab fa-instagram text-danger" placeholder="Enter Instagram URL" required type="text" v-model="form.social.instagram"></base-input>
                <base-input addon-left-icon="fab fa-twitter twitter-icon" placeholder="Enter Twitter URL" required type="text" v-model="form.social.twitter"></base-input>
              </b-form-group>
              <b-form-group id="form-bio" label="Bio: " label-for="form-bio--input">
                <b-form-textarea :max-rows="4" :rows="2" id="form-bio--input" no-resize placeholder="Enter bio" required type="text" v-model="form.bio"></b-form-textarea>
              </b-form-group>
              <b-form-group id="form-logo-url" label="Logo URL:" label-for="form-logo-url--input">
                <base-input addon-left-icon="fas fa-image text-dark" id="form-logo-url--input" placeholder="Enter URL for logo" required type="link" v-model="form.logo"></base-input>
              </b-form-group>
              <b-form-group id="form-drive_folder-url" label="Drive folder URL:" label-for="form-drive_folder-url--input" v-if="accessControl('admin')">
                <base-input addon-left-icon="fab fa-google-drive text-dark" id="form-logo-url--input" placeholder="Enter URL for drive folder" required type="link" v-model="form.drive_folder"></base-input>
              </b-form-group>
              <b-alert :show="showDismissableAlert" @dismissed="showDismissableAlert=false" dismissible v-if="errors.length > 0" variant="danger">
                <div :key="error" v-for="error in errors">{{error}}</div>
              </b-alert>
              <b-alert :show="!!success_msg" variant="success">
                <div>{{success_msg}}</div>
              </b-alert>
              <b-button @click.prevent="onSubmit" type="submit" variant="primary">Update</b-button>
              <b-button type="reset" variant="danger">Reset</b-button>
            </b-form>
          </card>
        </div>
      </b-row>
    </b-container>
    <error-page message="You are not authorized to view this content." v-else v-show="loaded" />
  </no-ssr>
</section>
</template>

<script>
import {
  mapGetters,
  mapActions
} from "vuex";
export default {
  data() {
    return {
      showDismissableAlert: false,
      success_msg: null,
      errors: [],
      team: {},
      form: {
        team_name: null,
        social: {},
        logo: null,
        bio: null
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
          social: this.form.social,
          logo: this.form.logo,
          bio: this.form.bio,
          driver_folder: this.form.drive_folder,
          team_name: this.form.team_name
        }
      });
      if (res.success) {
        this.$router.go(this.$router.currentRoute);
        return (this.success_msg = res.message ? res.message : "Team updated.");
      } else {}
    },
    async onReset() {
      this.success_msg = null;
      this.showDismissableAlert = false;
      this.errors = [];
      await this.loadFormData();
    },
    async loadFormData() {
      try {
        let res = await this.getReq({
          url: `/api/team/${this.params.id}/mini`
        });
        if (res.success) {
          this.team = res.team;
          this.form = {
            ...res.team
          };
        } else {
          this.showError(res.message);
        }
        this.loaded = true;
      } catch (error) {
        console.log(error);
        this.showError("Internal server error.");
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
  async asyncData({
    params
  }) {
    try {
      return {
        params
      };
    } catch (error) {}
  },
  created() {
    this.$nextTick(function () {
      this.loadFormData();
    });
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
