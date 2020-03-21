<template>
  <div class="post-page">
    <b-container>
      <b-row>
        <b-col sm="12">
          <expanded-post :post="post"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ExpandedPost from "@/components/forum/ExpandedPost.vue";
export default {
  components: {
    "expanded-post": ExpandedPost
  },
  computed: {
    ...mapGetters(["currentUser", "isAuthenticated"])
  },
  async asyncData({ $axios, params, error }) {
  console.log(params)
    try {
      const { data } = await $axios.get(`/api/event/${params.id}/forum/posts/${params.postId}`, {
        validateStatus: status => {
          return status < 400;
        }
      });
      return {
        isLoaded: true,
        post: data.post
      };
    } catch (err) {
      error({
        message: "Post not found",
        statusCode: 404

      });
    }
  }
};
</script>

<style lang="scss">
</style>
