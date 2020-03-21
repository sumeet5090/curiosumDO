<template>
<section class="section">
  <b-container>
    <modal :show.sync="deleteModalActive" gradient="danger" modal-classes="modal-danger modal-dialog-centered modal-sm" v-if="deleteModalActive">
      <h6 class="modal-title" id="modal-title-notification" slot="header">Delete</h6>
      <b-alert :show="errors.length > 0" @dismissed="showDismissibleAlert=false" dismissible v-if="showDismissibleAlert" variant="danger">
        <div :key="error" v-for="error in errors">{{error}}</div>
      </b-alert>
      <b-alert :show="!!success_msg" variant="success">
        <div>{{success_msg}}</div>
      </b-alert>
      <div class="row">
        <div class="col-12 text-center">
          <div class="text-white">By confirming you are deleting this entry.</div>
          <div class="text-white">Are you sure?</div>
        </div>
      </div>
      <template slot="footer">
        <base-button @click.prevent="cancelDelete" class="mr-auto" text-color="white" type="link">Cancel</base-button>
        <base-button @click.prevent="confirmDelete" type="success">Confirm</base-button>
      </template>
    </modal>
    <b-row class="justify-content-center">
      <div class="display-4 header-font">
        Announcements for
        <strong class="text-primary">{{event.name}}</strong>
      </div>
    </b-row>
    <b-row :key="annc._id" class="justify-content-center mt-4" v-for="annc in announcements">
      <b-col lg="8" md="10" sm="12">
        <b-card>
          <h4 class>{{annc.title}}</h4>
          <span class="ml-2 text-muted">
              <small>
                {{formatDate(Date.parse(annc.dateTime)) + ' by '}}
                <router-link :to="{name: 'profile-id', params: {id: getAuthor(annc.author).username}}" class="card-link" tag="a">{{getAuthor(annc.author).display_name}}</router-link>
              </small>
            </span>
          <vue-markdown :linkify="false">{{annc.description}}</vue-markdown>
          <div>
            <badge :key="tag" type="secondary" v-for="tag in annc.tags">#{{tag}}</badge>
          </div>
          <div v-if="!!isAdmin">
            <router-link :to="{name: 'manage-update-announcement-id', params: {id: annc._id}}" class="btn btn-outline-info btn-sm">Edit</router-link>
            <base-button @click.prevent="deleteModal(annc)" class="btn btn-outline-danger btn-sm">Delete</base-button>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</section>
</template>

<script>
let moment = require("moment");
import VueMarkdown from "vue-markdown";
import {
  mapGetters, mapActions
} from "vuex";
export default {
  components: {
    "vue-markdown": VueMarkdown
  },
  async asyncData({
    $axios,
    params,
    error
  }) {
    try {
      const {
        data
      } = await $axios.get(`/api/event/${params.id}`, {
        validateStatus: status => {
          return status < 400;
        }
      });
      const res = await $axios.get(`/api/event/${params.id}/announcements`, {
        validateStatus: status => {
          return status < 400;
        }
      });
      return {
        // isLoaded: data.success,
        params: params,
        announcements: res.data.announcements,
        event: data.event
      };
    } catch (err) {}
  },
  data() {
    return {
      event: {},
      announcements: [],
      params: {},
      deleteModalActive: false,
      selectedRow: {},
      showDismissibleAlert: false,
      success_msg: "",
      errors: []
    };
  },
  computed: {
    ...mapGetters(["isAdmin", "currentUser"])
  },
  methods: {
    ...mapActions(['getReq', 'delReq']),
    getAuthor: function (author_obj) {
      if (author_obj != null) {
        return {
          ...author_obj
        };
      }
      return {
        display_name: "",
        username: ""
      };
    },
    formatDate: function (date) {
      // From https://javascript.info/date
      let diff = new Date() - date;
      if (diff < 1000) {
        return "just now";
      }
      let sec = Math.floor(diff / 1000);
      if (sec < 60) return sec + " sec. ago";
      let min = Math.floor(diff / 60000);
      if (min < 60) return min + " min. ago";
      let d = date;
      return moment(d).fromNow();
    },
    deleteModal(item) {
      this.selectedRow = JSON.parse(JSON.stringify(item));
      this.deleteModalActive = true;
    },
    cancelDelete() {
      this.selectedRow = {};
      this.deleteModalActive = false;
    },
    async confirmDelete() {
      this.success_msg = "";
      this.errors = [];
      let deleteItem = this.selectedRow;
      if (this.event._id && deleteItem._id) {
        let url = `/api/event/${this.event._id}/announcements/${deleteItem._id}`;
        try {
          let res = await this.delReq({
            url
          });
          if (res.success) {
            this.success_msg = res.message || "Deleted announcement.";
            this.$router.go();
          } else {
            this.success_msg = "";
            this.showErr(res.message);
          }
        } catch (error) {
          console.log(error);
          this.success_msg = "";
          this.showErr("Internal server error.");
        }
      } else {
        this.success_msg = "";
        this.showErr("Schedule not found.");
      }
    },
    showErr(msg) {
      this.success_msg = "";
      this.showDismissibleAlert = true;
      this.errors.push(msg);
    }
  },
  mounted() {
  }
};
</script>

<style lang="scss">
b-card {
  h6 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

p {
  font-weight: inherit;
}
</style>
