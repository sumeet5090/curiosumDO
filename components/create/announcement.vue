<template>
  <b-form @reset.prevent="onReset" @submit.prevent>
    <b-form-select class="mb-3 text-dark" id="form-event--input" required v-model="selectedEvent">
      <option :value="null">Select an event</option>
      <option :key="ev._id" :value="ev._id" v-for="ev in events">{{ev.name}}</option>
    </b-form-select>
    <b-form-group v-if="selectedEvent" id="form-title" label="Title:" label-for="form-title--input">
      <b-form-input id="form-title--input" placeholder="Enter announcement title." type="text" v-model="form.title"></b-form-input>
    </b-form-group>
    <b-form-group v-if="selectedEvent" id="form-start-date" label="Date:" label-for="form-start-date--input">
      <base-input addon-left-icon="fa fa-calendar" id="form-start-date--input">
        <flatpickr :config="{altInput: true, dateFormat: 'Z', altFormat: 'J F Y h:i K', enableTime: true   }" @on-close="blur" @on-open="focus" class="form-control text-dark datepicker" slot-scope="{focus, blur}" v-model="form.date_time"></flatpickr>
      </base-input>
    </b-form-group>
    <b-form-group v-if="selectedEvent" id="form-author" label="Author:" label-for="form-author--input">
      <b-form-input disabled id="form-author--input" placeholder type="text" v-model="currentUser.display_name"></b-form-input>
    </b-form-group>
    <b-form-group v-if="selectedEvent" description="Describe the announcement." id="form-description" label="Description:" label-for="form-description--input">
      <markdown-editor language="en" v-model="form.description" :toolbars="toolbar" placeholder="Start writing a description..." fontSize="16px"/>
    </b-form-group>
    <b-form-group v-if="selectedEvent" description="(Tags seperated by space)" id="form-tags-list" label="Tags" label-for="form-tags-list--input">
      <b-form-input @keyup.native="addTag" id="form-tags-list--input" placeholder="Enter a tag" type="text" v-model="tag"></b-form-input>
      <badge :key="tag" type="secondary" class="mt-2" v-for="tag in form.tags">{{tag}}</badge>
    </b-form-group>
    <b-alert :show="errors.length > 0" @dismissed="showDismissibleAlert=false" dismissible variant="danger">
      <div :key="error" v-for="error in errors">{{error}}</div>
    </b-alert>
    <b-alert :show="!!success_msg" variant="success">
      <div>{{success_msg}}</div>
    </b-alert>
    <b-button @click.prevent="onSubmit" variant="success">Create  </b-button>
    <b-button type="reset" variant="danger">Reset</b-button>
  </b-form>
</template>

<script>
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import {mavonEditor} from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { mapActions, mapGetters } from "vuex";
export default {
  components: {
    flatpickr: flatPicker,
    'markdown-editor': mavonEditor
  },
  data() {
    return {
      tag: null,
      form: {
        title: null,
        description: "",
        date_time: Date.now(),
        tags: []
      },
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
      selectedEvent: null,
      success_msg: "",
      errors: [],
      showDismissibleAlert: false
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAdmin", "events"])
  },
  methods: {
    ...mapActions(["getReq", "postReq", "getEvents"]),
    addTag() {
      this.form.tags = this.tag.split(" ");
    },
    async onSubmit() {
      try {
        this.success_msg = null;
        this.showDismissibleAlert = false;
        this.errors = [];
        let url = `/api/event/${this.selectedEvent}/announcements`;
        if(this.selectedEvent) {
          let res = await this.postReq({
            url: url,
            body: {
              dateTime: this.form.date_time,
              author: this.currentUser._id,
              title: this.form.title,
              description: this.form.description,
              tags: this.form.tags
            }
          });
          if (res.success) {
            this.success_msg = res.message;
          } else {
            this.errors.push(res.message);
          }
        } else {
          this.errors.push("No event selected, try again.");
        }
      } catch (error) {
        console.log(error);
        this.errors.push("Couldn't reach server. Try again later.");
      }
    },
    onReset() {
      this.errors = [];
      this.success_msg = "";
      this.showDismissibleAlert = false;
      this.selectedEvent = null;
      this.form.title = null;
      this.form.description = null;
      this.form.date_time = Date.now();
      this.form.tags = [];
    }
  },
  beforeMount() {
    this.$nextTick(async () => {
      await this.getEvents();
    })
    this.errors = []
    this.success_msg = ''
    this.showDismissibleAlert = false;
  }
};
</script>

<style lang="scss">
</style>
