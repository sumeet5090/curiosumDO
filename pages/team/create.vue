<template>
  <section class="section custom-gradient">
    <no-ssr>
      <!-- <div v-if="showPage"> --><div v-if="this.isAdmin">
        <!-- <error-page :size="5" color="danger" heading="Error" icon="fas fa-exclamation-triangle" message="Already in team" v-if="!!currentUser.team" /> -->
        <!-- <div class="container" v-else> --><div class="container">
          <div class="row justify-content-center">
            <!-- <card class="col-sm-10 col-md-8 col-lg-6" v-if="!currentUser.team"> --><card class="col-sm-10 col-md-8 col-lg-6">
              <b-form @reset.prevent="onReset" @submit.prevent="onSubmit">
                <b-form-group description="Choose an unique team name." id="form-teamname" label="Team name:" label-for="form-teamname--input">
                  <base-input :addon-left-icon="availabilityStatus" id="form-teamname--input" placeholder="Enter team name" @keydown="_clearTimeout" @keyup="_setTimeout" required type="text" v-model="teamForm.team_name"></base-input>
                </b-form-group>
                <b-form-group description="Select a category" id="form-category" label="Category:" label-for="form-category--input">
                  <b-form-select :options="options" class="mb-3" required v-model="teamForm.category"></b-form-select>
                </b-form-group>
                <b-form-group description="Enter your institution details." label="Institution Details:">
                  <base-input :addon-left-icon="validateIcon(teamForm.institution.name)" placeholder="Enter institution name." required type="text" v-model="teamForm.institution.name"></base-input>
                  <base-input :addon-left-icon="validateIcon(teamForm.institution.address)" placeholder="Enter institution address." required type="text" v-model="teamForm.institution.address"></base-input>
                  <base-input :addon-left-icon="validateIcon(teamForm.institution.short_name)" placeholder="Enter institution short name." required type="text" v-model="teamForm.institution.short_name"></base-input>
                </b-form-group>
                <b-form-group description="Where are you from?" id="form-phonenumber" label="Location:" label-for="form-location--input">
                  <base-input id="form-location--input" :addon-left-icon="validateIcon(teamForm.location)" placeholder="State" required type="text" v-model="teamForm.location"></base-input>
                  <base-input id="form-country--input" :addon-left-icon="validateIcon(teamForm.country)" placeholder="Country" required type="text" v-model="teamForm.country"></base-input>
                </b-form-group>
                <b-form-group description="Link to the team profile picture." id="form-picture-url" label="Team logo:" label-for="form-picture-url--input">
                  <base-input id="form-picture-url--input" placeholder="https://example.website.com/images/demo.jpg" type="link" v-model="teamForm.logo_url"></base-input>
                </b-form-group>
                <b-form-group description="Links to your teams social media" id="form-social-links" label="Social Media" label-for="form-social-links--input">
                  <base-input addon-left-icon="fa fa-link text-dark" placeholder="https://examplewebsite.com" v-model="teamForm.website_url"></base-input>
                  <base-input addon-left-icon="fab fa-facebook-f" placeholder="https://facebook.com/example" v-model="teamForm.social.facebook"></base-input>
                  <base-input addon-left-icon="fab fa-instagram text-danger" placeholder="https://instagram.com/example" v-model="teamForm.social.instagram"></base-input>
                  <base-input addon-left-icon="fab fa-twitter" placeholder="https://twitter.com/example" v-model="teamForm.social.twitter"></base-input>
                </b-form-group>
                <b-form-group description="Talk about your team." id="form-bio" label="Bio:" label-for="form-bio--input">
                  <b-form-textarea :max-rows="6" :min-rows="3" :rows="4" id="form-bio--input" placeholder="Bio" required type="text" v-model="teamForm.bio"></b-form-textarea>
                </b-form-group>
                <b-form-group description="Search email and press enter." id="form-members" label="Members:" label-for="form-members--input">
                  <b-row class="justify-content-center align-items-center">
                    <b-col md="10" sm="12">
                      <b-input type="text" v-model="user_email"></b-input>
                    </b-col>
                    <b-col class="text-center" md="2" sm="12">
                      <b-button @click="searchUser" class="my-1" size variant="success">
                        <i class="fa fa-search"></i>
                      </b-button>
                    </b-col>
                  </b-row>
                  <card no-body>
                    <b-row class="justify-content-start p-3">
                      <b-col :key="user._id" lg="4" md="4" sm="6" v-for="user in users">
                        <badge type="secondary">{{user.display_name}}</badge>
                      </b-col>
                    </b-row>
                  </card>
                </b-form-group>
                <b-button type="submit" variant="primary">Create</b-button>
                <b-button type="reset" variant="danger">Reset</b-button>
              </b-form>
            </card>
          </div>
        </div>
      </div>
      <div v-else></div>
    </no-ssr>
  </section>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      dat: [],
      error: [],
      user: "",
      users: [],
      user_email: "",
      options: [
        {
          value: "combustion",
          text: "Combustion"
        },
        {
          value: "electric",
          text: "Electric"
        },
        {
          value: null,
          text: "Select a category"
        }
      ],
      teamForm: {
        category: null,
        user_emails: [],
        car_number: null,
        team_name: null,
        location: null,
        country: null,
        bio: null,
        logo_url: null,
        institution: {
          name: "",
          address: "",
          short_name: ""
        },
        social: {
          facebook: null,
          twitter: null,
          instagram: null
        },
        website_url: null
      },
      user_ids: [],
      checkAvail: {
        checking: false,
        checked: false,
        available: false,
        team_name: "",
        empty: true
      }
    };
  },
  methods: {
    ...mapActions(["getReq", "postReq"]),
    validateIcon(v){
      return v ? 'fas fa-check text-success': 'fas fa-times text-danger'
    },
    searchTeam() {
      let teamName = (this.checkAvail.username = this.teamForm.team_name);
      this.checkAvail.checking = true;
      this.checkAvail.checked = false;
      if(teamName){
        this.$axios.get(`/api/team/available/${teamName}`).then(res => {
          if (res.data) {
            this.checkAvail.checking = false;
            this.checkAvail.empty = false
            this.checkAvail.checked = true;
            if (res.data.success) {
              this.checkAvail.available = true;
              this.disableSubmit = false;
            } else {
              this.checkAvail.available = false;
              this.disableSubmit = true;
            }
          }
        }).catch(err => console.log);
      } else {
        this.checkAvail.checking = false
        this.checkAvail.checked = false
        this.checkAvail.available = false
        this.checkAvail.empty = true
      }
    },
    _setTimeout() {
      this.timer = setTimeout(this.searchTeam, 1000);
    },
    _clearTimeout() {
      clearTimeout(this.timer);
    },
    async onSubmit() {
      if(this.checkAvail.available){
        await this.postReq({
        url: "/api/team/create",
        body: {
          category: this.teamForm.category,
          team_name: this.teamForm.team_name,
          team_bio: this.teamForm.bio,
          institution: this.teamForm.institution,
          website_url: this.teamForm.website_url,
          location: this.teamForm.location,
          country: this.teamForm.country,
          social: this.teamForm.social,
          //user_ids: this.user_ids,
          user_ids: null,
          user_emails: this.teamForm.user_emails,
          logo_url: this.logo_url
        }
      });
      }
      this.$router.replace({ name: "team" }, (_) => {
        window.location.href = window.location.href 
      });
    },
    onReset() {
      this.$router.go(this.$route.name);
    },
    async searchUser() {
      let email = this.user_email.trim();
      let url = `/api/user/email/${email}/`,
        res,
        unique = true;
      let found = this.users.findIndex(user => user.email === email)
      if(found < 0){
        let { data } = await this.$axios.get(url)
        if (data.success == true) {
          if (!data.user.team) {
            this.users.push(data.user);
            this.teamForm.user_emails.push(data.user.email);
            this.user_ids.push(data.user._id);
          } else {
          }
        } else {
        }
      }
      this.user_email = "";
    }
  },
  computed: {
    // ...mapGetters(["currentUser"]),
    ...mapGetters(["currentUser","isAdmin"]),
    // showPage() {
    //   return !!this.currentUser ? true : false;
    // },
    availabilityStatus(){
      if(this.checkAvail.empty){
        return 'fas fa-times text-danger'
      } 
      if(this.checkAvail.checked && this.checkAvail.available){
        return 'fas fa-check text-success'
      }
      if(this.checkAvail.checked && !this.checkAvail.available){
        return 'fas fa-times text-danger'
      }
      return 'fas fa-spinner spin-360'
    }
  },
  beforeMount() {
    if (this.currentUser) {
      if (!this.currentUser.team) {
        console.log("me has no team");
      } else {
        this.$router.replace({ name: "team" });
      }
    } else {
      window.location.href = "/login";
    }
  },
  watch: {}
};
</script>

<style lang="scss">
.spin-360 {
  animation: spin 1s infinite linear;
}
@keyframes spin {
  0% {
    transform: rotate(0deg)
  }
  50% {
    transform: rotate(180deg)
  }
  100% {
    transform: rotate(360deg)
  }
}
</style>
