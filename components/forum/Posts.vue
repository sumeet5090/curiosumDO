<template>
  <div class="row">
    <div :class="classForPost(post.status)" :key="post._id" class="px-0 post-container mb-2 col-12" v-for="post in filteredPosts">
      <div class="media">
        <div class="mr-3 status-icon">
          <i class="fas fa-lock-open text-primary" title="Open" v-b-tooltip.hover.left v-if="post.status === 'open'"></i>
          <i class="fas fa-lock text-danger" title="Closed" v-b-tooltip.hover.left v-if="post.status === 'closed'"></i>
          <i class="fas fa-check text-success" title="Resolved" v-b-tooltip.hover.left v-if="post.status === 'resolved'"></i>
        </div>
        <div class="media-body">
          <div>
            {{post.post_type}}
            <div v-if="isAuthenticated == false"> <router-link :to="{name: 'event-id-forum-post-postId', params: {postId: post._id}}" class="font-weight-bold" style="font-size: 1.1rem;">
              <truncate :length="100" :text="(post.subject || '').toString()" action-class="truncated-less-sign" clamp="..." less="[hide]"></truncate>
            </router-link> </div>
            <div v-else><router-link :to="{name: 'event-id-forum-post-postId', params: {id: $route.params.id, postId: post._id}}" class="font-weight-bold" style="font-size: 1.1rem;">
              <truncate :length="100" :text="(post.subject || '').toString()" action-class="truncated-less-sign" clamp="..." less="[hide]"></truncate>
            </router-link>  </div>
            <div class="float-right" v-if="isAdmin">
              <base-button @click="pinPost($route.params.id, post._id)" icon="fas fa-thumbtack" size="sm" title="Pin" v-if="!post.pinned"></base-button>
              <base-button @click="unpinPost($route.params.id, post._id)" icon="fas fa-thumbtack rotate-180" size="sm" title="Unpin" v-else></base-button>
            </div>
          </div>
          <div class="container">
            <div class="row">
              <div class="col-md-6 px-0" v-if="post.sub_rule">
                <small>Rule {{post.sub_rule.notation}}</small>
              </div>
              <div class="col-md-6 px-0" v-if="post.user">
                <small>
                  Posted by
                  <router-link :to="{name: 'profile-id', params: {id: post.user.username}}">{{post.user.display_name}}</router-link>
                </small>
              </div>
              <div class="col-3 px-0">
                <small>{{formatDate(post.date_posted)}}</small>
              </div>
              <div class="col-3 px-0">
                <small>{{post.replies.length != 1 ? `${post.replies.length} replies` : `${post.replies.length} reply` }}</small>
              </div>
              <div class="col-md-3 px-0" v-if="post.replies.length > 0">
                <small>
                  Last reply by
                  <a :href="'/profile/'+getLastReply(post.replies).username" target="_blank">{{getLastReply(post.replies).display_name}}</a>
                </small>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  </div>



</template>

<script>
import moment from "moment";
import truncate from "vue-truncate-collapsed";
import _ from "lodash";
import { mapGetters } from "vuex";
export default {
  components: {
    truncate
  },
  props: {
    filters: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      posts: []
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAdmin", "isAuthenticated"]),
    filteredPosts() {
      if (this.filters) {
        let { section, rule, sub_rule, subject } = this.filters;
        let filtered = this.posts.filter(post => {
          if (this.isAuthenticated && post.post_type === "private") {
            if(this.isAdmin){
              return this.subfilter(post);
            }
            if (this.currentUser && this.currentUser.team === post.team) {
              return this.subfilter(post);
            }
            return false;
          } else {
            return this.subfilter(post)
          }
        });
        return filtered;
      }
      return [];
    }
  },
  methods: {

    subfilter(post) {
      let { section, rule, sub_rule, subject } = this.filters;
      if (subject !== "") {
        if (section == null) {
          return post.subject.toLowerCase().includes(subject.toLowerCase());
        }
        if (rule == null) {
          if (section === post.section.notation) {
            return post.subject.toLowerCase().includes(subject.toLowerCase());
          }
        }
        if (sub_rule == null) {
          if (section === post.section.notation && rule == post.rule.notation) {
            return post.subject.toLowerCase().includes(subject.toLowerCase());
          }
        } else {
          if (
            section === post.section.notation &&
            rule == post.rule.notation &&
            sub_rule === post.sub_rule.notation
          ) {
            return post.subject.toLowerCase().includes(subject.toLowerCase());
          }
        }
      } else {
        if (section == null) {
          return true;
        }
        if (rule == null) {
          if (section === post.section.notation) {
            return true;
          }
        }
        if (sub_rule == null) {
          if (section === post.section.notation && rule == post.rule.notation) {
            return true;
          }
        } else {
          if (
            section === post.section.notation &&
            rule == post.rule.notation &&
            sub_rule === post.sub_rule.notation
          ) {
            return true;
          }
        }
      }
      return false;
    },
    pinPost(event_id, post_id) {
      this.$axios
        .put(`/api/event/${event_id}/forum/posts/${post_id}/admin`, {
          post: {
            pinned: true
          }
        })
        .then(res => {
          if (res.data && res.data.success) {
          }
          this.$router.go(this.$route.name);
        })
        .catch(e => console.log);
    },
    unpinPost(event_id, post_id) {
      this.$axios
        .put(`/api/event/${event_id}/forum/posts/${post_id}/admin`, {
          post: {
            pinned: false
          }
        })
        .then(res => {
          if (res.data && res.data.success) {
          }
          this.$router.go(this.$route.name);
        })
        .catch(e => console.log);
    },
    formatDate(d) {
      return moment(d).fromNow();
    },
    classForPost(status) {
      let classList = [];
      if (status === "open") {
        classList.push("status-open");
      }
      if (status === "closed") {
        classList.push("status-closed");
      }
      if (status === "resolved") {
        classList.push("status-resolved");
      }
      return classList.join(" ");
    },
    getLastReply(replies) {
      let x = _.orderBy(replies, "date", "desc");
      if (x && x[0]) {
        return x[0].user;
      }
      return {};
    },
    getPosts() {

      let params = this.$route.params;
      this.$axios
        .get(`/api/event/${params.id}/forum/posts`)
        .then(res => {
          if (res.data && res.data.success) {
            return (this.posts = res.data.posts);
            console.log(this.posts)
          }
          return (this.posts = []);
        })
        .catch(err => console.log);
    }
  },
  beforeMount() {
    this.getPosts();
  }
};


</script>

<style lang="scss">
.status-open {
  border-left: 5px solid;
  border-color: #2c44d8;
}
.status-closed {
  border-left: 5px solid;
  border-color: #f5365c;
}
.status-resolved {
  border-left: 5px solid;
  border-color: #2dce89;
}
.post-body {
  width: 600px;
  height: 100%;
}
.status-icon {
  text-align: center;
  height: 80px;
  padding: 1.25rem 0.5rem;
  i {
    font-size: 22px;
    color: #1e1e1e;
  }
}
.rotate-180 {
  transform: rotate(180deg);
}
</style>
