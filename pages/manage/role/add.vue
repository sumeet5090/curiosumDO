<template>
<section class="section section-hero custom-gradient">
  <b-container  v-if="isAdmin">
    <b-row class="justify-content-center">
      <div class="col-md-8">
        <card>
          <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
            <b-form-group id="form-user_email" label="Email:" label-for="form-user_email--input">
              <b-form-input class="text-dark" id="form-user_email--input" type="email" v-model="user_email" required placeholder="Enter email"></b-form-input>
            </b-form-group>
            <b-form-group id="form-input-role" label="Role:" label-for="form-input-role--input">
              <b-form-select id="form-input-role--input" required v-model="input_role" :options="roles" class="mb-3 text-dark"></b-form-select>
            </b-form-group>
            <b-alert variant="danger" dismissible v-if="errors.length > 0" :show="showDismissableAlert" @dismissed="showDismissableAlert=false">
                <div v-for="error in errors" :key="error">{{error}}</div>
              </b-alert>
              <b-alert variant="success" :show="!!success_msg">
                <div>{{success_msg}}</div>
              </b-alert>
            <b-button type="submit" variant="primary">Update</b-button>
            <b-button type="reset" variant="danger">Reset</b-button>
          </b-form>
        </card>
      </div>
    </b-row>
  </b-container>
  <error-page v-else message="You are not authorized to view this content." icon="fas fa-exclamation-circle"></error-page>
</section>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      user_email: null,
      roles: [
        {
          value: "admin",
          text: "Admin"
        },
        {
          value: "volunteer",
          text: "Volunteer"
        },
        {
          value: "staff",
          text: "Staff"
        },
        {
          value: "alumni",
          text: "Alumni"
        },
        {
          value: null,
          text: "Select a category"
        }
      ],
      input_role: null,
      errors: [],
      success_msg: null
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAdmin"])
  },
  methods: {
    ...mapActions(["postReq"]),
    validEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    async onSubmit() {
      this.errors = [];
      this.success_msg = "";
      if (this.user_email) {
        if (!this.user_email) {
          return this.errors.push("Enter a valid email.");
        }
        if (!this.validEmail(this.user_email)) {
          return this.errors.push("Enter a valid email.");
        }
      }
      if (!this.input_role) {
        return this.errors.push("Select a role.");
      }
      if (this.errors.length == 0) {
        let res = await this.postReq({
          url: "/api/user/addrole",
          body: {
            user_email: this.user_email,
            role: this.input_role
          }
        });
        if(res){
          if(res.success){
            this.success_msg = res.message;
          } else {
            this.showError(res.message)
          }
        }
      }
    },
    onReset() {
      (this.input_role = null), (this.errors = []), (this.user_email = null);
    },
    showError(msg) {
      this.showDismissableAlert = true;
      this.errors.push(msg);
    }
  }
};
</script>

<style lang="scss">
</style>
