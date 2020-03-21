<template>
  <section class="section">
    <div class="container">
      <b-row class="justify-content-center">
        <div class="h2 font-weight-bold header-font text-uppercase">All teams</div>
      </b-row>
      <b-row class="justify-content-center my-2" v-if="isAdmin" v-show="isAdmin">
        <base-alert :dismissible="true" class="col-12" icon="far fa-times-circle" type="danger" v-if="isAdmin && error">
          <template slot="text">{{error}}</template>
        </base-alert>
        <base-alert :dismissible="true" class="col-12" icon="far fa-check-circle" type="success" v-if="isAdmin && success">
          <template slot="text">{{success}}</template>
        </base-alert>
        <!-- <base-button @click.prevent="sendDownloadRequest" outline type="success" v-if="isAdmin">Download</base-button>
        <base-button @click.prevent="uploadModal.show = true" outline type="primary" v-if="isAdmin">Upload</base-button> -->
      </b-row>
      <b-row class="justify-content-center">
        <base-input addon-left-icon="fas fa-search text-success" class="col-sm-12 col-md-6 px-0 mx-0" placeholder="Search" type="text" v-model="filter"></base-input>
      </b-row>
      <b-row>
        <b-table :fields="fields" :filter="filter" :items="teams" :sort-compare="sortCompareAdvanced" bordered class="font-md-small" hover outlined responsive>
          <template slot="category" slot-scope="data">
            <div class>
              <img class="img-thumbnail icon-category" src="@/assets/images/icons/category/combustion.svg" v-if="data.item.category == 'combustion'">
              <img class="img-thumbnail icon-category" src="@/assets/images/icons/category/electric.svg" v-if="data.item.category == 'electric'">
            </div>
          </template>
          <template slot="team_name" slot-scope="data">
            <div class="d-flex justify-content-between">
              <router-link :to="{name: 'team-id', params: {id: data.item._id}}" class="text-primary" tag="a">{{data.item.team_name}}</router-link>
              <router-link :to="{name: 'team-id-settings', params: {id: data.item._id}}" class="btn btn-sm btn-link cursor-pointer ml-auto" tag="a" v-if="isAdmin">
                <i class="fas fa-pen"></i>
              </router-link>
            </div>
          </template>
          <template slot="institution.name" slot-scope="data">
            <truncate :length="45" :text="(data.item.institution.name || '').toString()" action-class="truncated-less-sign" clamp=" ... " less="[hide]"></truncate>
          </template>
          <template slot="social" slot-scope="data">
            <a :href="data.item.website_url" rel="noreferrer" target="_blank" v-if="data.item.website_url">
              <icon color="dark" name="fa fa-link" size="sm"></icon>
            </a>
            <a :href="data.item.social.facebook" rel="noreferrer" target="_blank" v-if="data.item.social.facebook">
              <icon name="fab fa-facebook" size="sm" style="color: #3B5999"></icon>
            </a>
            <a :href="data.item.social.twitter" rel="noreferrer" target="_blank" v-if="data.item.social.twitter">
              <icon name="fab fa-twitter" size="sm" style="color: #1DA1F2"></icon>
            </a>
            <a :href="data.item.social.instagram" rel="noreferrer" target="_blank" v-if="data.item.social.instagram">
              <icon color="danger" name="fab fa-instagram" size="sm"></icon>
            </a>
          </template>
        </b-table>
      </b-row>
    </div>
    <modal :show.sync="uploadModal.show" body-classes="p-0" modal-classes="modal-dialog-centered modal-sm" v-if="uploadModal.show">
      <card body-classes="px-lg-5 py-lg-5" class="border-0" header-classes="bg-white pb-5" shadow type="secondary">
        <template>
          <div class="text-muted text-center mb-3">
            <small>Upload file</small>
          </div>
          <b-form-file accept=".csv" drop-placeholder="Drop file here..." placeholder="Choose a file..." v-model="uploadModal.file"></b-form-file>
        </template>
        <template>
          <div class="text-center pt-2">
            <base-button @click.prevent="uploadFile" type="primary">Upload</base-button>
          </div>
        </template>
      </card>
    </modal>
  </section>
</template>

<script>
import truncate from "vue-truncate-collapsed";
import moment from "moment"
import { mapGetters } from "vuex";
import flatten from "flat";
export default {
  components: {
    truncate
  },
  computed: {
    ...mapGetters(["isAdmin"])
  },
  methods: {
    sortCompareAdvanced: function(a, b, key) {
      if (typeof a[key] === "number" && typeof b[key] === "number") {
        return a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;
      } else if (typeof a[key] === "undefined") {
        return 1;
      } else if (typeof b[key] === "undefined") {
        return 1;
      } else {
        return flatten(a)
          [key].toString()
          .localeCompare(flatten(b)[key].toString(), undefined, {
            numeric: true
          });
      }
    },
    formatDate(date){
      return moment(date).format('YYYYMMDD-HHmmss')
    },
    sendDownloadRequest() {
      this.success = null;
      this.error = null;
      let params = this.$route.params;
      this.$axios
        .get(`/api/team/teams/csv`)
        .then(({ data }) => {
          console.log(data);
          if (data && data.success == false) {
            this.error = data.message;
          } else {
            const url = window.URL.createObjectURL(new Blob([data])),
              link = document.createElement("a"),
              fileName = `teams-${this.formatDate(Date.now())}.csv`;
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            this.success = "File downloaded.";
            document.body.removeChild(link);
          }
        })
        .catch(err => {
          this.error = "Internal server error.";
          console.log(err);
        });
    },
    uploadFile() {
      this.success = null;
      this.error = null;
      let formData = new FormData();
      let params = this.$route.params;
      if(this.uploadModal.file){
        console.log(this.uploadModal.file.name);
      }
      formData.append("file", this.uploadModal.file);
      this.$axios
        .post(`/api/team/update/csv`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(({ data }) => {
          console.log("Success");
          console.log(data);
          this.success = "Upload successful.";
        })
        .catch(err => {
          this.error = "Upload failed.";
        });
    }
  },
  data() {
    return {
      filter: null,
      table: {
        currentPage: 1,
        perPage: 100
      },
      fields: [
        {
          label: "",
          key: "category",
          sortable: true
        },
        {
          sortable: true,
          label: " ",
          key: "team_name"
        },
        {
          key: "institution.name",
          label: " ",
          sortable: true
        },
        {
          sortable: true,
          label: " ",
          key: "location",
          formatter: function(val) {
            if (val) {
              return val;
            }
            return "-";
          }
        },
        {
          sortable: true,
          label: " ",
          key: "country",
          formatter: function(val) {
            if (val) {
              return val;
            }
            return "-";
          }
        },
        {
          label: " ",
          key: "social"
        }
      ],
      uploadModal: {
        show: false,
        file: null
      },
    };
  },
  async asyncData({ $axios, params, error }) {
    try {
      const { data } = await $axios.get(`/api/team`, {
        validateStatus: status => {
          return status < 400;
        }
      });
      return {
        teams: data.teams,
        isLoaded: data.success
      };
    } catch (err) {
      error({
        message: "Teams not found",
        statusCode: 404
      });
    }
  }
};
</script>

<style lang="scss">
.truncated_less_sign {
  color: #5e72e4;
}

.icon-category {
  width: auto;
  height: 32px;
  background: none !important;
  border: 0;
  border-radius: 0;
  box-shadow: none;
  min-width: 24px;
}

.table {
  // border: 0.05rem solid $dark;
  th {
    padding: 0;
  }

  td {
    padding: 0.45rem;
    vertical-align: middle;
  }
}

a {
  .icon-sm {
    width: 1rem !important;
    height: 1rem !important;
  }
}

td > .icon.icon-shape {
  padding: 0;
  margin: 0;
}
</style>
