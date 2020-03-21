<template>
  <div class="article-clean">
    <div class="container" v-if="post._id">
      <b-alert dismissible v-model="successAlert.show" variant="success">{{successAlert.message}}</b-alert>
      <b-alert dismissible v-model="errorAlert.show" variant="danger">{{errorAlert.message}}</b-alert>
      <div class="row justify-content-center">
        <div class="col-lg-12 col-xl-12">
          <div class="intro">
            <div class="text-center">
              <div class="float-right">
                <b-dropdown no-caret right size="sm" toggle-class="text-decoration-none mt-3" v-if="post.user && currentUser" variant="link">
                  <template slot="button-content">
                    <i class="fas fa-ellipsis-h fa-2x m-0 text-black-50" style="font-size: 20px;"></i>
                    <span class="sr-only">Settings</span>
                  </template>
                  <b-dropdown-item v-if="post.user && (post.user._id === currentUser._id) && isEditable" @click="navigateToEdit(post._id)">Edit</b-dropdown-item>
                  <b-dropdown-item @click.prevent="makeDuplicateModal(post._id)" v-if="isAdmin && !post.duplicate.value">Mark as duplicate</b-dropdown-item>
                  <b-dropdown-item @click.prevent="makeNotDuplicateModal(post._id)" v-if="isAdmin && post.duplicate.value">Mark as not duplicate</b-dropdown-item>
                  <b-dropdown-item @click.prevent="makeSpamModal(post._id)" v-if="isAdmin && !post.spam.value">Mark as spam</b-dropdown-item>
                  <b-dropdown-item @click.prevent="makeNotSpamModal(post._id)" v-if="isAdmin && post.spam.value">Remove from spam</b-dropdown-item>
                  <b-dropdown-item @click.prevent="makeResolvedModal(post._id)" v-if="isAdmin && post.status !== 'resolved'">Mark as resolved</b-dropdown-item>
                  <b-dropdown-item @click.prevent="closeQueryModal(post._id)" v-if="isAdmin && post.status == 'open'">Close query</b-dropdown-item>
                  <b-dropdown-item @click.prevent="reOpenQueryModal(post._id)" v-if="isAdmin && (post.status == 'closed' || post.status == 'resolved')">Re-open query</b-dropdown-item>
                  <b-dropdown-item v-if="isAdmin && !post.deleted" @click="deleteQueryModal(post._id)"><div class="text-danger">Delete</div></b-dropdown-item>
                </b-dropdown>
                <b-dropdown no-caret right size="sm" toggle-class="text-decoration-none mt-3" v-else variant="link">
                  <template slot="button-content">
                    <i class="fas fa-ellipsis-h m-0 text-black-50" style="font-size: 20px;"></i>
                    <span class="sr-only">Settings</span>
                  </template>
                  <b-dropdown-item href="/login">Respond</b-dropdown-item>
                </b-dropdown>
              </div>
              <h5>
                <span class="bg-danger mr-1 text-white text-uppercase px-1 rounded" v-if="post.duplicate && post.duplicate.value">Duplicate</span>
                <span class="bg-danger mr-1 text-white text-uppercase px-1 rounded" v-if="post.spam && post.spam.value">Spam</span>
                <span class="bg-danger mr-1 text-white text-uppercase px-1 rounded" v-if="post.status === 'closed'">Closed</span>
                <span class="bg-primary mr-1 text-white text-uppercase px-1 rounded" v-if="post.status === 'open'">Open</span>
                <span class="bg-green mr-1 text-white text-uppercase px-1 rounded" v-if="post.status === 'resolved'">Resolved</span>
              </h5>
              <h3>
                <span>{{post.subject}}</span>
              </h3>
            </div>
            <div class="text-center" v-if="post.user">
              <span class="by">by</span>
              <router-link :to="{name: 'profile-id', params: {id: post.user.username}}" class="text-curiosum cursor-pointer" tag="strong">{{post.user.display_name}}</router-link>
              <span class="date">{{formatDate(post.date_posted)}}</span>
            </div>
            <div v-if="post.status">
              <hr class="m-0 border-success rounded" style="border-width: 0.25rem;" v-if="post.status == 'resolved'">
              <hr class="m-0 border-danger rounded" style="border-width: 0.25rem;" v-if="post.status == 'closed'">
              <hr class="m-0 border-primary rounded" style="border-width: 0.25rem;" v-if="post.status == 'open'">
            </div>
          </div>
          <div class="card">
            <div class="card-body">
              <vue-markdown>{{post.description}}</vue-markdown>
            </div>
          </div>
          <div class="mt-3">
            <h6>Comments</h6>
          </div>
          <div class="row">
          <div :key="key" class="card col-12 mb-2" :class="reply.highlight ? 'order-1' : 'order-2'"  v-for="(reply, key) in post.replies">
            <div class="py-1">
              <div class="card-header py-0 px-2" :class="reply.highlight ? 'reply-pinned' : ''">
                <i class="fas fa-certificate" v-b-popover.left.hover="'Staff'" style="color: goldenrod;" v-if="hasStar(reply.user)"></i>
                <span v-if="reply.highlight">
                  <i class="fas fa-thumbtack" v-b-popover.left.hover="'Pinned'" style="transform: rotate(50deg);"></i>
                </span>
                <span>
                  <router-link :to="{name: 'profile-id', params: {id: reply.user.username}}" class="ml-2 reply-username cursor-pointer" tag="small">{{reply.user.display_name}}</router-link>
                </span>
                <div class="float-right">
                  <b-dropdown class="reply-dropdown" no-caret toggle-class="text-decoration-none" v-if="currentUser._id === reply.user._id || isAdmin" variant="link">
                  <template slot="button-content">
                    <i class="fas fa-ellipsis-h" style="font-size: 1rem; margin-top: .25rem"></i>
                    <span class="sr-only">Settings</span>
                  </template>
                  <b-dropdown-item v-if="currentUser._id == reply.user._id" @click="editResponseModal(key, reply._id)">Edit</b-dropdown-item>
                  <b-dropdown-item v-if="isAdmin" @click="editResponseAdminModal(key, reply._id)">
                    <div v-if="!reply.highlight">Pin reply</div>
                    <div v-else>Remove pin</div>
                  </b-dropdown-item>
                </b-dropdown>
                </div>
                <div class="mr-2 float-right reply-date">
                  <small>{{formatDate(reply.date)}}</small>
                </div>
              </div>
              <div class="px-2 py-1">
                <vue-markdown>{{reply.text}}</vue-markdown>
              </div>
            </div>
          </div>
          </div>
          <b-container class="px-0 mb-2" fluid v-if="post.status == 'open'">
            <b-row class="mx-0 justify-content-between" v-if="isAuthenticated">
              <div class="col-8 col-md-9 px-0">
                <base-input @keyup.enter.native="Reply" addon-left-icon="fas fa-comment-alt text-curiosum-light mr-2" class="m-0 h-100" input-classes="text-curiosum" placeholder="Write a response" v-model="newReply.text"></base-input>
              </div>
              <b-btn @click.prevent="Reply" class="col col-md-3 m-0 h-100 btn-curiosum">Send</b-btn>
            </b-row>
          </b-container>
        </div>
      </div>
      <modal :show.sync="adminEditResponse.modal" footer-classes="py-2" modal-classes="modal-dialog-centered modal-sm" v-if="isAdmin && adminEditResponse.modal">
        <h6 class="modal-title" id="modal-title-notification" slot="header">Edit response</h6>
        <div class="row text-dark">
          <div class="col-12 text-center">
            <div v-if="adminEditResponse.highlight === true">Are you sure you want to pin this reply?</div>
            <div v-else>Are you sure you want to remove this reply from pinned?</div>
          </div>
        </div>
        <template slot="footer">
          <base-button @click.prevent="cancelEditResponseAdmin" text-color="dark" type="link">Cancel</base-button>
          <base-button @click.prevent="confirmEditResponseAdmin" class="ml-auto" type="success">Confirm</base-button>
        </template>
      </modal>
      <modal :show.sync="editResponse.modal" footer-classes="py-2" modal-classes="modal-dialog-centered modal-sm" v-if="editResponse.modal">
        <h6 class="modal-title" id="modal-title-notification" slot="header">Edit response</h6>
        <div class="row text-dark">
          <div class="col-12 text-center">
            <b-textarea max-rows="3" rows="2" v-model="editResponse.reply"></b-textarea>
          </div>
        </div>
        <template slot="footer">
          <base-button @click.prevent="cancelEditResponse" text-color="dark" type="link">Cancel</base-button>
          <base-button @click.prevent="confirmEditResponse" class="ml-auto" type="success">Edit</base-button>
        </template>
      </modal>
      <modal :show.sync="makeDuplicate.modal" gradient="danger" modal-classes="modal-danger modal-dialog-centered modal-sm" v-if="makeDuplicate.modal">
        <h6 class="modal-title" id="modal-title-notification" slot="header">Mark as duplicate</h6>
        <div class="row">
          <div class="col-12 text-center">
            <div class="text-white">This post will be marked as duplicate.</div>
            <div class="text-white">Are you sure?</div>
          </div>
        </div>
        <template slot="footer">
          <base-button @click.prevent="cancelDuplicate" class="mr-auto" text-color="white" type="link">Cancel</base-button>
          <base-button @click.prevent="confirmDuplicate" type="success">Confirm</base-button>
        </template>
      </modal>
      <modal :show.sync="makeNotDuplicate.modal" gradient="danger" modal-classes="modal-danger modal-dialog-centered modal-sm" v-if="makeNotDuplicate.modal">
        <h6 class="modal-title" id="modal-title-notification" slot="header">Mark as not duplicate</h6>
        <div class="row">
          <div class="col-12 text-center">
            <div class="text-white">This post will be marked as not duplicate.</div>
            <div class="text-white">Are you sure?</div>
          </div>
        </div>
        <template slot="footer">
          <base-button @click.prevent="cancelNotDuplicate" class="mr-auto" text-color="white" type="link">Cancel</base-button>
          <base-button @click.prevent="confirmNotDuplicate" type="success">Confirm</base-button>
        </template>
      </modal>
      <modal :show.sync="makeSpam.modal" gradient="danger" modal-classes="modal-danger modal-dialog-centered modal-sm" v-if="makeSpam.modal">
        <h6 class="modal-title" id="modal-title-notification" slot="header">Delete</h6>
        <div class="row">
          <div class="col-12 text-center">
            <div class="text-white">By confirming, this post will be marked as spam.</div>
            <div class="text-white">Are you sure?</div>
          </div>
        </div>
        <template slot="footer">
          <base-button @click.prevent="cancelSpam" class="mr-auto" text-color="white" type="link">Cancel</base-button>
          <base-button @click.prevent="confirmSpam" type="success">Confirm</base-button>
        </template>
      </modal>
      <modal :show.sync="makeNotSpam.modal" gradient="danger" modal-classes="modal-danger modal-dialog-centered modal-sm" v-if="makeNotSpam.modal">
        <h6 class="modal-title" id="modal-title-notification" slot="header">Remove from spam</h6>
        <div class="row">
          <div class="col-12 text-center">
            <div class="text-white">By confirming, this post will be removed from spam.</div>
            <div class="text-white">Are you sure?</div>
          </div>
        </div>
        <template slot="footer">
          <base-button @click.prevent="cancelNotSpam" class="mr-auto" text-color="white" type="link">Cancel</base-button>
          <base-button @click.prevent="confirmNotSpam" type="success">Confirm</base-button>
        </template>
      </modal>
      <modal :show.sync="makeResolved.modal" gradient="danger" modal-classes="modal-danger modal-dialog-centered modal-sm" v-if="makeResolved.modal">
        <h6 class="modal-title" id="modal-title-notification" slot="header">Mark as resolved</h6>
        <div class="row">
          <div class="col-12 text-center">
            <div class="text-white">By confirming, this post will be marked as resolved.</div>
            <div class="text-white">Are you sure?</div>
          </div>
        </div>
        <template slot="footer">
          <base-button @click.prevent="cancelResolved" class="mr-auto" text-color="white" type="link">Cancel</base-button>
          <base-button @click.prevent="confirmResolved" type="success">Confirm</base-button>
        </template>
      </modal>
      <modal :show.sync="closeQuery.modal" gradient="danger" modal-classes="modal-danger modal-dialog-centered modal-sm" v-if="closeQuery.modal">
        <h6 class="modal-title" id="modal-title-notification" slot="header">Mark as closed</h6>
        <div class="row">
          <div class="col-12 text-center">
            <div class="text-white">By confirming, this post will be marked as closed.</div>
            <div class="text-white">Are you sure?</div>
          </div>
        </div>
        <template slot="footer">
          <base-button @click.prevent="cancelCloseQuery" class="mr-auto" text-color="white" type="link">Cancel</base-button>
          <base-button @click.prevent="confirmCloseQuery" type="success">Confirm</base-button>
        </template>
      </modal>
      <modal :show.sync="reOpenQuery.modal" gradient="danger" modal-classes="modal-danger modal-dialog-centered modal-sm" v-if="reOpenQuery.modal">
        <h6 class="modal-title" id="modal-title-notification" slot="header">Delete</h6>
        <div class="row">
          <div class="col-12 text-center">
            <div class="text-white">By confirming, this post will be marked as open.</div>
            <div class="text-white">Are you sure?</div>
          </div>
        </div>
        <template slot="footer">
          <base-button @click.prevent="cancelReOpenQuery" class="mr-auto" text-color="white" type="link">Cancel</base-button>
          <base-button @click.prevent="confirmReOpenQuery" type="success">Confirm</base-button>
        </template>
      </modal>
      <modal :show.sync="deleteQuery.modal" modal-classes="modal-dialog-centered modal-sm" v-if="deleteQuery.modal">
        <h6 class="modal-title" id="modal-title-notification" slot="header">Delete</h6>
        <div class="row">
          <div class="col-12 text-center">
            <div class="text-dark">By confirming, this post will be deleted.</div>
            <div class="text-danger font-weight-bold">This action cannot be reversed.</div>
            <div class="text-dark">Are you sure?</div>
          </div>
        </div>
        <template slot="footer">
          <base-button @click.prevent="cancelDeleteQuery" class="mr-auto" text-color="dark" type="link">Cancel</base-button>
          <base-button @click.prevent="confirmDeleteQuery" type="success">Confirm</base-button>
        </template>
      </modal>
    </div>
    <error-page message="Please login to view the posted content." v-else></error-page>
  </div>
</template>

<script>
import moment from "moment";
import VueMarkdown from "vue-markdown";
import { mapGetters } from "vuex";
export default {
  components: {
    "vue-markdown": VueMarkdown
  },
  props: {
    post: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      newReply: {
        text: ""
      },
      timer: null,
      currentTime: null,
      errorAlert: {
        show: false,
        message: ""
      },
      successAlert: {
        show: false,
        message: ""
      },
      editResponse: {
        modal: false,
        postId: null,
        replyId: null,
        reply: ""
      },
      adminEditResponse: {
        modal: false,
        postId: null,
        replyId: null,
        highlight: null
      },
      makeDuplicate: {
        modal: false,
        post_id: null
      },
      makeNotDuplicate: {
        modal: false,
        post_id: null
      },
      makeSpam: {
        modal: false,
        post_id: null
      },
      makeNotSpam: {
        modal: false,
        post_id: null
      },
      makeResolved: {
        modal: false,
        post_id: null
      },
      closeQuery: {
        modal: false,
        post_id: null
      },
      reOpenQuery: {
        modal: false,
        post_id: null
      },
      deleteQuery: {
        modal: false,
        post_id: null
      },
      restoreQuery: {
        modal: false,
        post_id: null
      },
      previousTime: null
    };
  },

  computed: {
    ...mapGetters(["currentUser", "isAdmin", "isAuthenticated"]),
    isEditable() {
      let post = moment(this.post.date_posted);
      return this.currentTime - post <= 600000; // 10 minutes
    },
    replyHold() {
      let time = this.currentTime;
      if (time - this.previousTime >= 10000) {
        return false;
      }
      return true;
    },
    event_id() {
      return this.$route.params.id;
    }
  },
  created() {
    this.currentTime = moment();
    this.timer = setInterval(() => this.updateCurrentTime(), 1 * 1000);
  },
  methods: {
    updateCurrentTime() {
      this.currentTime = moment();
      if (!this.isEditable) {
        clearInterval(this.timer);
      }
    },
    navigateToEdit(post_id){
      if(this.event_id != null && post_id != null) {
        let route = {name: 'event-id-forum-post-postId-edit', params: {id: this.event_id, postId: post_id}}
        this.$router.replace(route)
      }
    },
    hasStar(user){
      if(user && user.role && user.role.length){
        if(user.role.indexOf('admin') > -1 || user.role.indexOf('staff') > -1){
          return true
        }
      }
      return false
    },
    formatDate(d) {
      return moment(d).fromNow();
    },
    Reply() {
      let params = this.$route.params;
      let url = `/api/event/${params.id}/forum/posts/${this.post._id}/reply`;
      if (this.newReply.text.length > 0 && !this.replyHold) {
        this.previousTime = parseInt(this.currentTime);
        this.$axios
          .put(url, { text: this.newReply.text })
          .then(res => {
            if (res.data && res.data.success) {
              console.log("Replied");
              let cr = this.$router.currentRoute;
              return this.$router.go(cr);
            }
            console.log("Failed");
          })
          .catch(err => console.log);
      }
    },
    cancelEditResponse() {
      this.editResponse = {
        modal: false,
        postId: null,
        replyId: null,
        reply: ""
      };
    },
    editResponseModal(key, replyId) {
      this.editResponse.postId = this.post._id;
      this.editResponse.replyId = replyId;
      this.editResponse.reply = "" + this.post.replies[key].text;
      this.editResponse.modal = true;
    },
    confirmEditResponse() {
      let { replyId, postId, reply } = this.editResponse;
      let eventId = this.$route.params.id;
      this.$axios
        .put(`/api/event/${eventId}/forum/posts/${postId}/reply/${replyId}`, {
          text: reply
        })
        .then(res => {
          if (res.data && res.data.success) {
            let cr = this.$router.currentRoute;
            return this.$router.go(cr);
          }
        })
        .catch(err => console.log);
    },
    cancelEditResponseAdmin() {
      this.adminEditResponse = {
        modal: false,
        postId: null,
        replyId: null,
        highlight: null
      };
    },
    editResponseAdminModal(key, replyId) {
      this.adminEditResponse.postId = this.post._id;
      this.adminEditResponse.replyId = replyId;
      console.log(this.post.replies[key].highlight);
      this.adminEditResponse.highlight = !this.post.replies[key].highlight;
      this.adminEditResponse.modal = true;
    },
    confirmEditResponseAdmin() {
      let { replyId, postId, highlight } = this.adminEditResponse;
      let eventId = this.$route.params.id;
      if (this.adminEditResponse.highlight != null) {
        this.$axios
          .put(`/api/event/${eventId}/forum/posts/${postId}/reply/${replyId}/admin`, {
            highlight: highlight
          })
          .then(res => {
            if (res.data && res.data.success) {
              let cr = this.$router.currentRoute;
              return this.$router.go(cr);
            }
          })
          .catch(err => console.log);
      }
    },
    successMsg(msg) {
      this.successAlert.message = msg;
      this.successAlert.show = true;
    },
    errorMsg(msg) {
      this.errorAlert.message = msg;
      this.errorAlert.show = true;
    },
    makeDuplicateModal(id) {
      this.makeDuplicate.post_id = id;
      this.makeDuplicate.modal = true;
    },
    cancelDuplicate() {
      this.makeDuplicate.post_id = null;
      this.makeDuplicate.modal = false;
    },
    confirmDuplicate() {
      if (this.makeDuplicate.post_id != null) {
        let params = this.$route.params;
        let url = `/api/event/${params.id}/forum/posts/${
          this.makeDuplicate.post_id
        }`;
        this.$axios
          .put(url, {
            post: {
              duplicate: {
                value: true,
                marked_by: this.currentUser._id
              }
            }
          })
          .then(res => {
            if (res.data && res.data.success) {
              this.successMsg("Successfully marked as duplicate.");
            } else {
              this.errorMsg(res.data.message);
            }
            this.cancelDuplicate();
            let cr = this.$router.currentRoute;
            return this.$router.go(cr);
          })
          .catch(err => {
            this.errorMsg("Some error occured, try again.");
            console.log(err);
          });
      }
    },
    makeNotDuplicateModal(id) {
      this.makeNotDuplicate.post_id = id;
      this.makeNotDuplicate.modal = true;
    },
    cancelNotDuplicate() {
      this.makeNotDuplicate.post_id = null;
      this.makeNotDuplicate.modal = false;
    },
    confirmNotDuplicate() {
      if (this.makeNotDuplicate.post_id != null) {
        let params = this.$route.params;
        let url = `/api/event/${params.id}forum/posts/${
          this.makeNotDuplicate.post_id
        }`;
        this.$axios
          .put(url, {
            post: {
              duplicate: {
                value: false,
                marked_by: this.currentUser._id
              }
            }
          })
          .then(res => {
            if (res.data && res.data.success) {
              this.successMsg("Successfully marked as not duplicate.");
            } else {
              this.errorMsg(res.data.message);
            }
            this.cancelNotDuplicate();
            let cr = this.$router.currentRoute;
            return this.$router.go(cr);
          })
          .catch(err => {
            this.errorMsg("Some error occured, try again.");
            console.log(err);
          });
      }
    },
    makeSpamModal(id) {
      this.makeSpam.post_id = id;
      this.makeSpam.modal = true;
    },

    cancelSpam() {
      this.makeSpam.post_id = null;
      this.makeSpam.modal = false;
    },
    confirmSpam() {
      if (this.makeSpam.post_id != null) {
        let params = this.$route.params;
        let url = `/api/event/${params.id}forum/posts/${this.makeSpam.post_id}`;
        this.$axios
          .put(url, {
            post: {
              spam: {
                value: true,
                marked_by: this.currentUser._id
              }
            }
          })
          .then(res => {
            if (res.data && res.data.success) {
              this.successMsg("Successfully marked as spam.");
            } else {
              this.errorMsg(res.data.message);
            }
            this.cancelSpam();
            let cr = this.$router.currentRoute;
            return this.$router.go(cr);
          })
          .catch(err => {
            this.errorMsg("Some error occured, try again.");
            console.log(err);
          });
      }
    },
    makeNotSpamModal(id) {
      this.makeNotSpam.post_id = id;
      this.makeNotSpam.modal = true;
    },

    cancelNotSpam() {
      this.makeNotSpam.post_id = null;
      this.makeNotSpam.modal = false;
    },
    confirmNotSpam() {
      if (this.makeNotSpam.post_id != null) {
        let params = this.$route.params;
        let url = `/api/event/${params.id}/forum/posts/${
          this.makeNotSpam.post_id
        }`;
        this.$axios
          .put(url, {
            post: {
              spam: {
                value: false,
                marked_by: this.currentUser._id
              }
            }
          })
          .then(res => {
            if (res.data && res.data.success) {
              this.successMsg("Successfully removed from spam.");
            } else {
              this.errorMsg(res.data.message);
            }
            this.cancelNotSpam();
            let cr = this.$router.currentRoute;
            return this.$router.go(cr);
          })
          .catch(err => {
            this.errorMsg("Some error occured, try again.");
            console.log(err);
          });
      }
    },
    makeResolvedModal(id) {
      this.makeResolved.post_id = id;
      this.makeResolved.modal = true;
    },
    cancelResolved() {
      this.makeResolved.post_id = null;
      this.makeResolved.modal = false;
    },
    confirmResolved() {
      if (this.makeResolved.post_id != null) {
        let params = this.$route.params;
        let url = `/api/event/${params.id}/forum/posts/${
          this.makeResolved.post_id
        }`;
        this.$axios
          .put(url, {
            post: {
              status: "resolved"
            }
          })
          .then(res => {
            if (res.data && res.data.success) {
              this.successMsg("Successfully marked as resolved.");
            } else {
              this.errorMsg(res.data.message);
            }
            this.cancelResolved();
            let cr = this.$router.currentRoute;
            return this.$router.go(cr);
          })
          .catch(err => {
            this.errorMsg("Some error occured, try again.");
            console.log(err);
          });
      }
    },
    closeQueryModal(id) {
      this.closeQuery.post_id = id;
      this.closeQuery.modal = true;
    },
    cancelCloseQuery() {
      this.closeQuery.post_id = null;
      this.closeQuery.modal = false;
    },
    confirmCloseQuery() {
      if (this.closeQuery.post_id != null) {
        let params = this.$route.params;
        let url = `/api/event/${params.id}/forum/posts/${
          this.closeQuery.post_id
        }`;
        this.$axios
          .put(url, {
            post: {
              status: "closed"
            }
          })
          .then(res => {
            if (res.data && res.data.success) {
              this.successMsg("Successfully closed query.");
            } else {
              this.errorMsg(res.data.message);
            }
            this.cancelCloseQuery();
            let cr = this.$router.currentRoute;
            return this.$router.go(cr);
          })
          .catch(err => {
            this.errorMsg("Some error occured, try again.");
            console.log(err);
          });
      }
    },
    reOpenQueryModal(id) {
      this.reOpenQuery.post_id = id;
      this.reOpenQuery.modal = true;
    },
    cancelReOpenQuery() {
      this.reOpenQuery.post_id = null;
      this.reOpenQuery.modal = false;
    },
    confirmReOpenQuery() {
      if (this.reOpenQuery.post_id != null) {
        let params = this.$route.params;
        let url = `/api/event/${params.id}/forum/posts/${
          this.reOpenQuery.post_id
        }`;
        this.$axios
          .put(url, {
            post: {
              status: "open"
            }
          })
          .then(res => {
            if (res.data && res.data.success) {
              this.successMsg("Successfully opened query.");
            } else {
              this.errorMsg(res.data.message);
            }
            this.cancelResolved();
            let cr = this.$router.currentRoute;
            return this.$router.go(cr);
          })
          .catch(err => {
            this.errorMsg("Some error occured, try again.");
            console.log(err);
          });
      }
    },
    deleteQueryModal(id){
      this.deleteQuery.post_id = id
      this.deleteQuery.modal = true
    },
    cancelDeleteQuery(){
      this.deleteQuery.post_id = null
      this.deleteQuery.modal = false
    },
    confirmDeleteQuery(){
      if (this.deleteQuery.post_id != null) {
        let params = this.$route.params;
        let url = `/api/event/${params.id}/forum/posts/${
          this.deleteQuery.post_id
        }`;
        this.$axios
          .delete(url, {})
          .then(res => {
            if (res.data && res.data.success) {
              this.successMsg("Successfully deleted query.");
            } else {
              this.errorMsg(res.data.message);
            }
            this.cancelDeleteQuery()
            let id = this.$route.params.id;
            if(id != null){
              return this.$router.replace({name: "event-id-forum", params: { id }});
            }
            return this.$router.replace("/")
          })
          .catch(err => {
            this.errorMsg("Some error occured, try again.");
            console.log(err);
          });
      }
    },
  }
};
</script>

<style lang="scss">
.article-clean {
  p {
    font-weight: unset;
  }
  blockquote {
    padding: 0 1rem;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;
  }
}
.reply-dropdown {
  button {
    padding: 0;
    margin-top: -.5rem;
  }
}

.reply-pinned {
  background:  #56ab2f;
  .reply-username, i.fas, .reply-date {
    color: white;
  }
}
</style>
