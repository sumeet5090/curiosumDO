<template>
<section class="section custom-gradient">
    <div class="container mt-2">
        <card no-body class="p-2 px-3 text-dark" >
            <b-row class="justify-content-center">
              <div class="h3 font-weight-900">{{event.name}}</div>
              <b-table class="m-2" bordered stacked responsive :items="[event]" :fields="fields">
                <template slot="name" slot-scope="data">
                  <span class="font-weight-bold">
                    {{data.item.name}}
                  </span>
                  <span v-if="isAdmin" v-show="isAdmin">
                    <router-link :to="{name: 'manage-update-event'}"><i class="fas fa-pen"></i></router-link>
                  </span>
                </template>
                <template slot="start_date" slot-scope="data">{{formatDate(data.item.start_date)}}</template>
                <template slot="end_date" slot-scope="data">{{formatDate(data.item.end_date)}}</template>
                <template slot="link" slot-scope="data">
                  <a :href="data.item.link">Website</a>
                </template>
              </b-table>
            </b-row>
        </card>
    </div>
</section>
</template>

<script>
let moment = require('moment')
import {mapGetters} from 'vuex'
export default {
  data() {
    return {
      fields: [
        {
          key: "name",
          label: "Name"
        },
        {
          key: "start_date",
          label: "Start Date"
        },
        {
          key: "end_date",
          label: "End Date"
        },
        {
          key: "venue",
          label: "Location"
        },
        {
          key: "link"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(['isAdmin'])
  },
  async asyncData({ $axios, params, error }) {
    try {
      const { data } = await $axios.get(`/api/event/${params.id}`, {
        validateStatus: status => {
          return status < 400;
        }
      });
      return {
        isLoaded: data.success,
        event: data.event
      };
    } catch (err) {
      error({
        message: "Event not found",
        statusCode: 404
      });
    }
  },
  methods: {
    formatDate(date) {
      return moment(date).format('dddd, LL');;
    }
  }
};
</script>

<style lang="scss" >
table.b-table.b-table-stacked > tbody > tr > [data-label]::before {
  text-align: initial !important;
}

table.b-table.b-table-stacked > tbody > tr > :first-child {
    border-top-width: 0.0625rem;
}
</style>
