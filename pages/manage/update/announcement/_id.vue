<template>
  <section class="section">
    <no-ssr>
      <div class="row justify-content-center" v-if="!!isAdmin">
        <div class="col-md-10">
          <b-form @reset.prevent="onReset" @submit.prevent>
            <b-form-group id="form-start-date" label="Date:" label-for="form-start-date--input" v-if="announcement._id">
              <base-input addon-left-icon="fa fa-calendar" id="form-start-date--input">
                <flatpickr :config="{altInput: true, dateFormat: 'Z', altFormat: 'J F Y h:i K', enableTime: true   }" @on-close="blur" @on-open="focus" class="form-control text-dark datepicker" slot-scope="{focus, blur}" v-model="announcement.dateTime"></flatpickr>
              </base-input>
            </b-form-group>
            <b-form-group id="form-author" label="Author:" label-for="form-author--input" v-if="announcement._id">
              <b-form-input disabled id="form-author--input" placeholder type="text" v-model="currentUser.display_name"></b-form-input>
            </b-form-group>
            <b-form-group description="Describe the announcement." id="form-description" label="Description:" label-for="form-description--input" v-if="announcement._id">
              <markdown-editor :toolbars="toolbar" fontSize="16px" language="en" placeholder="Start writing a description..." v-model="announcement.description"/>
            </b-form-group>
            <b-form-group description="(Tags seperated by space)" id="form-tags-list" label="Tags" label-for="form-tags-list--input" v-if="announcement._id">
              <b-form-input @keyup.native="addTag" id="form-tags-list--input" placeholder="Enter a tag" type="text" v-model="tag"></b-form-input>
              <badge :key="key" class="mt-2" type="secondary" v-for="(tag, key) in announcement.tags">
                {{tag}}
                <a @click="popTag(key)" class="btn-sm m-1 cursor-pointer" type="secondary">
                  <i class="fas fa-times text-danger"></i>
                </a>
              </badge>
            </b-form-group>
            <b-alert :show="errors.length > 0" @dismissed="showDismissibleAlert=false" dismissible variant="danger">
              <div :key="error" v-for="error in errors">{{error}}</div>
            </b-alert>
            <b-alert :show="!!success_msg" variant="success">
              <div>{{success_msg}}</div>
            </b-alert>
            <b-button @click.prevent="onSubmit" variant="info">Update</b-button>
            <b-button type="reset" variant="danger">Reset</b-button>
          </b-form>
        </div>
      </div>
      <error-page message="You are not allowed to see this." v-else/>
    </no-ssr>
  </section>
</template>

<script>
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { mavonEditor } from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    flatpickr: flatPicker,
    "markdown-editor": mavonEditor
  },
  data() {
    return {
      tag: null,
      announcement: {},
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
        help: true,
        trash: true,
        undo: true,
        redo: true
      },
      success_msg: "",
      errors: [],
      showDismissibleAlert: false
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAdmin", "events"])
  },
  methods: {
    ...mapActions(["getReq", "putReq", "getEvents"]),
    addTag() {
      this.announcement.tags = this.tag.split(" ");
    },
    popTag(key) {
      this.announcement.tags.splice(key, 1);
    },
    async onSubmit() {
      try {
        this.success_msg = null;
        this.showDismissibleAlert = false;
        this.errors = [];
        let url = `/api/event/fb2021/announcements/${this.params.id}`;
        console.log(url);
        let res = await this.putReq({
          url: url,
          body: {
            dateTime: this.announcement.dateTime,
            author: this.currentUser._id,
            title: this.announcement.title,
            description: this.announcement.description,
            tags: this.announcement.tags
          }
        });
        if (res.success) {
          this.success_msg = res.message;
          setTimeout(() => {
            this.$router.go();
          }, 1000);
        } else {
        console.log(res.message)
          this.errors.push(res.message);
        }
      } catch (error) {
        console.log(error);
        this.errors.push("Couldn't reach server. Try again later.");
      }
    },
    async getAnnouncement() {
      try {
        let res = await this.getReq({
          url: `/api/event/fb2021/announcements/${this.params.id}`
        });
        if (res) {
          if (res.success) {
            this.announcement = res.announcement;
            this.tag = res.announcement.tags.join(" ");
            return;
          } else {
            this.errors.push(res.message);
          }
        }
        setTimeout(() => {
          this.$router.go();
        });
      } catch (error) {
        console.log(error);
      }
    },
    onReset() {
      this.errors = [];
      this.success_msg = "";
      this.showDismissibleAlert = false;
      this.getAnnouncement();
    }
  },
  mounted() {
    this.errors = [];
    this.success_msg = "";
    this.showDismissibleAlert = false;
    this.$nextTick(async () => {
      this.getAnnouncement()
    })
  },
  async asyncData({ $axios, params, error }) {
    return {
      params: params
    };
  }
};
</script>

<style lang="scss">
</style>
