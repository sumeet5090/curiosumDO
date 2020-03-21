<template>
  <section class="section">
    <div class="container">
      <div class="row justify-content-center">
        <b-form class="col-md-8">
          <b-form-row>
            <b-col md="6">
              <b-form-group for="create-post-username--input" id="create-post-username" label="Username">
                <b-form-input id="create-post-username--input" type="text" v-model="form.user_name"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group for="create-post-car-number--input" id="create-post-car-number" label="Car number">
                <b-form-input id="create-post-car-number--input" type="text" v-model="form.car_number"></b-form-input>
              </b-form-group>
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col md="6">
              <b-form-group for="create-post-team-name--input" id="create-post-team-name" label="Team name">
                <b-form-input id="create-post-team-name--input" type="text" v-model="form.team_name"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group for="create-post-institution-name--input" id="create-post-institution-name" label="Institution name">
                <b-form-input id="create-post-institution-name--input" type="text" v-model="form.institution_name"></b-form-input>
              </b-form-group>
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col md="6">
              <b-form-group for="create-post-query-type--input" id="create-post-query-type" label="Query type">
                <b-form-select class="text-capitalize" id="create-post-query-type--input" type="text" v-model="form.query_type">
                  <option :value="null">Select query type</option>
                  <option :key="key" :value="type.name" class="text-capitalize" v-for="(type, key) in query_types">{{type.name}}</option>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group for="create-post-rule-year--input" id="create-post-rule-year" label="Rule year">
                <b-form-input id="create-post-rule-year--input" type="text" v-model="form.rule_year"></b-form-input>
              </b-form-group>
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col md="6">
              <b-form-group for="create-post-section--input" id="create-post-section" label="Section">
                <b-form-select class="text-capitalize" id="create-post-section--input" type="text" v-model="form.section">
                  <option :value="null">Select section</option>
                  <option :key="key" :value="key" v-for="(sect, key) in sections">{{sect.name}} ({{sect.notation}})</option>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group for="create-post-rule--input" id="create-post-rule" label="Rule">
                <b-form-select id="create-post-rule--input" v-model="form.rule">
                  <option :value="null">Select rule</option>
                  <option :key="key" :value="key" v-for="(rule, key) in rules">{{rule.name}} ({{rule.notation}})</option>
                </b-form-select>
              </b-form-group>
            </b-col>
          </b-form-row>
          <b-form-row>
            <b-col>
              <b-form-group for="create-post-sub-rule--input" id="create-post-sub-rule" label="Section">
                <b-form-select id="create-post-sub-rule--input" v-model="form.sub_rule">
                  <option :value="null">Select sub rule</option>
                  <option :key="key" :value="key" v-for="(subRule, key) in subRules">{{subRule.name}} ({{subRule.notation}})</option>
                </b-form-select>
              </b-form-group>
            </b-col>
          </b-form-row>
          <b-form-group for="create-post-query-subject--input" id="create-post-query-subject" label="Query subject">
            <b-form-input id="create-post-query-subject--input" type="text" v-model="form.query_subject"></b-form-input>
          </b-form-group>
          <b-form-row id="create-post-query-description" v-if="loaded">
            <b-col sm="12">
              <legend class="col-form-label pt-0">Query Description</legend>
              <p class="text-dark font-weight-bold"><small>Note: Please enter query in English, following proper grammar protocol and be as detailed as possible.</small></p>
            </b-col>
            <b-col class="mb-2" sm="12">
              <div v-if="isBrowser">
                <markdown-editor language="en" v-model="form.query_description" :toolbars="toolbar" placeholder="Start writing a description..." fontSize="16px"/>
              </div>
            </b-col>
          </b-form-row>
          <base-button @click.prevent="submitCreate" class="float-right ml-2" outline type="success">Submit</base-button>
          <base-button @click.prevent="resetCreate" class="float-right" outline type="danger">Reset</base-button>
        </b-form>
      </div>
    </div>
  </section>
</template>
<script>
import {mavonEditor} from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
  components: {
      'markdown-editor': mavonEditor
    },
  data() {
    return {
      form: {
        user_name: null,
        car_number: null,
        team_name: null,
        institution_name: null,
        rule_book_year: null,
        section: null,
        rule: null,
        sub_rule: null,
        query_type: null,
        query_subject: null,
        query_description: ""
      },
      toolbar: {
        bold: true,
        italic: true,
        header: false,
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
      sections: [],
      query_types: [
        {
          name: "public"
        },
        {
          name: "private"
        }
      ],
      loaded: false
    };
  },
  computed: {
    rules() {
      if (this.form.section != null) {
        let key = this.form.section;
        if (this.sections && this.sections.length > 0) {
          return this.sections[key].rules;
        }
      }
      return [];
    },
    subRules() {
      if (this.form.section != null && this.form.rule != null) {
        let key = this.form.rule;
        let rules = this.rules;
        if (rules.length > 0) {
          return rules[key].sub_rules;
        }
      }
      return [];
    },
    isBrowser(){
      return !!process.browser
    },
  },
  watch: {
    "form.section": {
      handler: function(val) {
        this.form.rule = null;
        this.form.sub_rule = null;
      }
    },
    "form.rule": {
      handler: function(val) {
        this.form.sub_rule = null;
      }
    }
  },
  methods: {
    submitCreate() {},
    resetCreate() {
      this.form = {
        rule_book_year: null,
        section: null,
        rule: null,
        sub_rule: null,
        query_type: null,
        query_subject: null,
        query_description: null
      }
    },
    loadSections() {
      let params = this.$route.params
      this.$axios
        .get(`/api/event/{params.id}/forum/sections`)
        .then(({ data }) => {
          if (data && data.success) {
            return (this.sections = data.sections);
          }
          return (this.sections = []);
        })
        .catch(err => {
          console.log(err);
          this.sections = [];
        });
    }
  },
  beforeMount() {
    this.$nextTick(() => {
      this.loadSections();
    });
  },
  mounted(){
    this.loaded = true
  }
};
</script>
