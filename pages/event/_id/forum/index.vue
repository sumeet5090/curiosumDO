<template>
<section class="section pt-0" style="min-height: 90vh">
  <b-container>
    <b-row class="justify-content-center">
      <b-col md="8" sm="12">
        <div class="text-center mb-3 fa-2x header-font text-capitalize">
          <span class="text-curiosum-light"> {{event.name}}</span>
          <span class="text-curiosum">Rules Forum</span>
        </div>
      </b-col>
    </b-row>
    <b-row class="justify-content-between align-items-center">
      <b-select class="col-md-3"  v-model="select.section">
        <option :value="null">Select section</option>
        <option :key="key" :value="key" v-for="(sect, key) in sections">{{sect.name}} ({{sect.notation}})</option>
      </b-select>
      <b-select class="col-md-4"  v-model="select.rule">
        <option :value="null">Select rule</option>
        <option :key="key" :value="key" v-for="(rule, key) in rules">{{rule.name}} ({{rule.notation}})</option>
      </b-select>
      <b-select class="col-md-3"  v-model="select.sub_rule">
        <option :value="null">Select sub rule</option>
        <option :key="key" :value="key" v-for="(subRule, key) in subRules">{{subRule.name}} ({{subRule.notation}})</option>
      </b-select>
    </b-row>
    <b-row class="justify-content-between py-2">
      <div class="col-3 px-0">
        <router-link :to="{name: 'event-id-forum-create-post', params: { id: params.id }}" class="btn btn-curiosum w-100">New Post</router-link>
      </div>
      <base-input v-model="select.subject" addon-left-icon="fas fa-search" class="col-8 px-0"></base-input>
    </b-row>
    <b-container class="px-0 mt-5" fluid>
      <posts :filters="filters"/>
    </b-container>
  </b-container>
</section>
</template>

<script>
import Posts from "@/components/forum/Posts";
import PostsMobile from "@/components/forum/Posts-mobile.vue";
export default {
  components: {
    posts: Posts,
    "posts-mobile": PostsMobile
  },
  data() {
    return {
      select: {
        section: null,
        rule: null,
        sub_rule: null,
        subject: ""
      },
      selected: {
        section: null
      },
      fields: [{
          key: "date_posted",
          sortable: true,
          label: "Date posted"
        },
        {
          key: "rule_number",
          sortable: true,
          label: "Rule #"
        },
        {
          key: "query_subject",
          sortable: true,
          label: "Query Subject"
        },
        {
          key: "responses",
          sortable: true,
          label: "Responses"
        },
        {
          key: "last_post",
          sortable: true,
          label: "Last post"
        },
        {
          key: "query_status",
          sortable: true,
          label: "Status"
        }
      ]
    };
  },
  computed: {
    filters() {
      let filter = {
        section: null,
        rule: null,
        sub_rule: null,
        subject: ""
      };
      if (this.select.section != null) {
        filter.section = this.sections[this.select.section].notation;
      }
      if (this.select.rule != null) {
        filter.rule = this.rules[this.select.rule].notation;
      }
      if (this.select.sub_rule != null) {
        filter.sub_rule = this.subRules[this.select.sub_rule].notation;
      }
      if(this.select.subject != null){
        filter.subject = this.select.subject
      }
      return filter;
    },
    rules() {
      if (this.select.section != null) {
        let key = this.select.section;
        if (this.sections && this.sections.length > 0) {
          return this.sections[key].rules;
        }
      }
      return [];
    },
    subRules() {
      if (this.select.section != null && this.select.rule != null) {
        let key = this.select.rule;
        let rules = this.rules;
        if (rules.length > 0) {
          return rules[key].sub_rules;
        }
      }
      return [];
    },
    isMobile() {
      if (process.browser) {
        if (
          /Android|webOs|iPhone|iPad|iPod|Blackberry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          )
        ) {
          return true;
        }
        return false;
      }
    }
  },
  methods: {},
  watch: {
    "select.section": {
      handler: function (val) {
        this.select.rule = null;
        this.select.sub_rule = null;
      }
    },
    "select.rule": {
      handler: function (val) {
        this.select.sub_rule = null;
      }
    }
  },
  async asyncData({
    $axios,
    params,
    error
  }) {
    try {
      let event_id = params.id
      let res1 = await $axios.get(`/api/event/${event_id}/forum/sections`);
      let res2 = await $axios.get(`/api/event/${event_id}`);
      if (res1.data && res1.data.success && res2.data && res2.data.success) {
        return {
          sections: res1.data.sections,
          event: res2.data.event,
          params: params
        };
      }
      return {
        sections: [],
        params: params
      };
    } catch (error) {}
  }
};
</script>

<style lang="scss">
</style>
