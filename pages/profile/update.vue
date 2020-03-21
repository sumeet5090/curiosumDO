<template>
<div class="custom-gradient">
  <no-ssr>
    <section class="section ">
      <b-container>
        <div class="row justify-content-center">
          <div class="col-md-8">
            <card>
              <b-form @submit.prevent="onSubmit" @reset="onReset">
                <b-form-group id="form-displayname" label="Display Name:" label-for="form-displayname--input" description="We'll never share your email with anyone else.">
                  <b-form-input id="form-displayname--input" type="text" v-model="form.display_name" required placeholder="Enter email">
                  </b-form-input>
                </b-form-group>
                <b-form-group id="form-phonenumber" label="Phone number:" label-for="form-phonenumber--input" description="We'll never share your phone number with anyone else.">
                  <b-form-input id="form-phonenumber--input" type="text" v-model="form.phone_number" placeholder="Phone number">
                  </b-form-input>
                </b-form-group>
                <b-form-group id="form-picture-url" label="Profile picture:" label-for="form-picture-url--input" description="Link to a new profile picture.">
                  <b-form-input id="form-picture-url--input" type="url" v-model="form.link_to_logo" required placeholder="https://example.website.com/images/demo.jpg">
                  </b-form-input>
                </b-form-group>
                <b-form-group id="form-bio" label="Bio:" label-for="form-bio--input" description="Talk about yourself.">
                  <b-form-textarea id="form-bio--input" type="text" v-model="form.bio" placeholder="Bio" :rows="4" max-rows="6" min-rows="3">
                  </b-form-textarea>
                </b-form-group>
                <b-alert type="danger" v-if="errors.length > 0">
                  <div v-for="err in errors" :key="err">{{err}}</div>
                </b-alert>
                <b-alert type="success" v-if="success_msg">
                  <div>{{success_msg}}</div>
                </b-alert>
                <b-button type="submit" variant="primary">Update</b-button>
                <b-button type="reset" variant="danger">Reset</b-button>
              </b-form>
            </card>
          </div>
        </div>
      </b-container>
    </section>
  </no-ssr>
</div>
</template>

<script>
import {
  mapGetters,
  mapActions
} from "vuex";

export default {
  data() {
    return {
      form: {
        display_name: "",
        bio: "",
        phone_number: "",
        link_to_logo: "",
        location: "",
        gender: "",
      },
      user: {},
      success_msg: null,
      errors: []
    };
  },
  methods: {
    ...mapActions(["getReq", "postReq", "putReq", "accessControl"]),
    async onSubmit() {
      (this.success_msg = null), (this.errors = []);
      let url = `/api/user/update`;
      try {
        let res = await this.putReq({
          url: url,
          body: {
            phone_number: this.form.phone_number,
            profile: {
              picture: this.form.link_to_logo
            },
            bio: this.form.bio,
            display_name: this.form.display_name
          }
        });
        if (res.success) {
          this.$router.go(this.$router.currentRoute)
          return (this.success_msg =
            res.success == true ? "User created." : "Couldn't Create User");
        }
        return this.errors.push(res.message);
      } catch (error) {
        return this.errors.push(error);
      }
    },
    async onReset() {
      await this.loadFormData();
    },
    async loadFormData() {
      try {
        let res = await this.getReq({
          url: '/api/user/profile/' + this.currentUser.username
        })
        if (res.success) {
          this.user = res.user
          this.form.bio = this.user.bio;
          this.form.phone_number = this.user.phone_number;
          this.form.display_name = this.user.display_name;
          this.form.link_to_logo = this.user.profile.picture;
        }
      } catch (error) {
        console.log(error)
        this.form.bio = this.currentUser.bio;
        this.form.phone_number = this.currentUser.phone_number;
        this.form.display_name = this.currentUser.display_name;
        this.form.link_to_logo = this.currentUser.profile.picture;
      }
    }
  },
  computed: {
    ...mapGetters(["currentUser"])
  },
  mounted() {
    this.$nextTick(function () {
      this.loadFormData();
    });
  }
};
</script>
