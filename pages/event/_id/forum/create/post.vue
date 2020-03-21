<template>
  <div>
    <no-ssr>
      <section class="section pt-0" v-if="!!isAuthenticated">
        <b-container>
          <b-row class="justify-content-center">
            <b-col md="8" sm="12">
              <div class="text-center fa-2x header-font text-uppercase">Create new post</div>
            </b-col>
          </b-row>
          <b-row class="justify-content-between align-items-baseline">
            <b-col>
              <b-alert dismissible v-model="showSuccessAlert" variant="success">
                <div class="text-center" v-if="successMsg">{{success_msg}}</div>
              </b-alert>
              <b-alert dismissible v-model="showErrorAlert" variant="danger">
                <div class="text-center" v-if="successMsg">{{error_msg}}</div>
              </b-alert>
              <b-form>
                <b-form-group id="form-subject" label-for="form-subject--input">
                  <b-input class="form-control" id="form-subject--input" placeholder="Subject" rows="1" v-model="post.subject"></b-input>
                </b-form-group>
                <b-form-group :description="description_placeholder" id="form-description" label-for="form-description--input">
                  <markdown-editor :toolbars="toolbar" fontSize="16px" id="form-description--input" language="en" placeholder="Description" v-model="post.description"/>
                </b-form-group>
                <b-form-row>
                  <b-col class="mb-2" md>
                    <b-select v-model="post.section">
                      <option :value="-1">Select section</option>
                      <option :key="key" :value="key" v-for="(sect, key) in sections">{{sect.name}} ({{sect.notation}})</option>
                    </b-select>
                  </b-col>
                  <b-col class="mb-2" md>
                    <b-select class="col-md mr-1 mb-2" v-model="post.rule">
                      <option :value="-1">Select rule</option>
                      <option :key="key" :value="key" v-for="(rule, key) in rules">{{rule.name}} ({{rule.notation}})</option>
                    </b-select>
                  </b-col>
                  <b-col class="mb-2" md>
                    <b-select class="col-md mr-1 mb-2" v-model="post.sub_rule">
                      <option :value="-1">Select sub rule</option>
                      <option :key="key" :value="key" v-for="(subRule, key) in subRules">{{subRule.name}} ({{subRule.notation}})</option>
                    </b-select>
                  </b-col>
                </b-form-row>
                <b-form-row>
                  <b-col class="mb-2" md>
                    <b-input :placeholder="post.user.display_name" disabled v-if="post.user" v-model="post.user.display_name"/>
                    <b-input aria-disabled disabled v-else/>
                  </b-col>
                  <b-col class="mb-2" md>
                    <b-select v-model="post.type">
                      <option value="public">Public</option>
                      <option value="private">Private</option>
                    </b-select>
                  </b-col>
                  <b-col class="mb-2 d-flex" md>
                    <b-button @click.prevent="submitPost" class="w-50 btn-curiosum">Submit</b-button>
                    <b-button @click.prevent="resetPost" class="w-50 btn-curiosum-dark">Reset</b-button>
                  </b-col>
                </b-form-row>
              </b-form>
            </b-col>
          </b-row>
        </b-container>
      </section>
    </no-ssr>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
export default {
  components: {
    "markdown-editor": mavonEditor
  },
  data() {
    return {
      post: {
        subject: "",
        description: "",
        type: "public", // public / private
        section: -1,
        rule: -1,
        sub_rule: -1,
        user: null
      },
      showSuccessAlert: false,
      showErrorAlert: false,
      success_msg: "",
      error_msg: "",
      description_placeholder:
        "Please write the query in English and be as detailed as possible.",
      toolbar: {
        bold: true,
        italic: true,
        header: true,
        underline: true,
        strikethrough: true,
        quote: true,
        preview: true,
        ul: true,
        ol: true,
        link: true,
        table: true,
        trash: true,
        undo: true,
        redo: true
      }
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"]),
    rules() {
      if (this.post.section >= 0) {
        let key = this.post.section;
        if (this.sections && this.sections.length > 0 && key > -1) {
          return this.sections[key].rules;
        }
      }
      return [];
    },
    subRules() {
      if (this.post.section >= 0 && this.post.rule >= 0) {
        let key = this.post.rule;
        let rules = this.rules;
        if (rules.length > 0 && key > -1) {
          return rules[key].sub_rules;
        }
      }
      return [];
    }
  },
  async asyncData({ $axios, params, error }) {
    try {
      let { data } = await $axios.get(`/api/event/${params.id}/forum/sections`);
      if (data && data.success) {
        return {
          sections: data.sections
        };
      }
      return {
        sections: []
      };
    } catch (error) {}
  },
  methods: {
    submitPost() {
      let subject = this.post.subject;
      let description = this.post.description;
      let type = this.post.type;
      let params = this.$route.params;
      if (
        this.post.section > -1 &&
        this.post.rule > -1 &&
        this.post.sub_rule > -1 &&
        subject &&
        description &&
        type
      ) {
        let section = this.sections[this.post.section]._id;
        let rule = this.rules[this.post.rule]._id;
        let sub_rule = this.subRules[this.post.sub_rule]._id;
        let user = this.currentUser;
        this.$axios
          .post(`/api/event/${params.id}/forum/posts/create`, {
            subject,
            description,
            type,
            section,
            rule,
            sub_rule
          })
          .then(res => {
            console.log(res.data);
            if (res.data && res.data.success) {
              console.log(res.data);
              console.log("F");
              this.successMsg("Query posted.");
              this.resetPost();
              this.$router.replace({
                name: "event-id-forum-post-postId",
                params: { id: this.$route.params.id, postId: res.data.post._id }
              });
            } else {
              console.log("F");
              this.errorMsg("Error posting query.");
            }
          })
          .catch(err => {
            this.errorMsg("An error occured.");
            console.log(err);
          });
      } else {
        this.errorMsg("Please complete all fields");
      }
    },
    errorMsg(msg) {
      this.showErrorAlert = true;
      this.error_msg = msg;
    },
    successMsg(msg) {
      this.showSuccessAlert = true;
      this.success_msg = msg;
    },
    resetPost() {
      this.post.subject = "";
      this.post.description = "";
      this.post.type = "public";
      this.post.section = -1;
      this.post.rule = -1;
      this.post.sub_rule = -1;
    }
  },
  beforeMount() {
    if (!this.isAuthenticated) {
      console.log("Not authenticated.");
      this.router.push("/login");
    }
  },
  mounted() {
    if (!this.isAuthenticated) {
      console.log("Not authenticated.");
      this.router.push("/login");
    }
    this.post.user = this.currentUser;
  },
  watch: {
    "post.section": {
      handler: function(val) {
        this.post.rule = -1;
        this.post.sub_rule = -1;
      }
    },
    "post.rule": {
      handler: function(val) {
        this.post.sub_rule = -1;
      }
    }
  }
};
</script>

<style lang="scss">
.v-show-content {
  font-family: "Open Sans", sans-serif !important;
}
</style>
