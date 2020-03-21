<template>
  <section class="section">
    <div class="container">
      <b-row class="justify-content-center">
        <div class="display-4 header-font">
          Registered Teams for
          <strong class="text-primary">{{event.name}}</strong>
        </div>
      </b-row>
      <b-row class="justify-content-center my-2" v-if="isAdmin" v-show="isAdmin">
        <!-- <base-alert :dismissible="true" class="col-12" icon="far fa-times-circle" type="danger" v-if="isAdmin && error">
          <template slot="text">{{error}}</template>
        </base-alert>
        <base-alert :dismissible="true" class="col-12" icon="far fa-check-circle" type="success" v-if="isAdmin && success">
          <template slot="text">{{success}}</template>
        </base-alert>
        <base-button @click.prevent="sendDownloadRequest" outline type="success" v-if="isAdmin">Download</base-button>
        <base-button @click.prevent="uploadModal.show = true" outline type="primary" v-if="isAdmin">Upload</base-button>-->
      </b-row>
      <b-row class="justify-content-center">
        <base-input addon-left-icon="fas fa-search text-success" class="col-sm-12 col-md-6 px-0 mx-0" placeholder="Search" type="text" v-model="filter"></base-input>
      </b-row>
      <b-row class="mt-2 justify-content-center">
        <no-ssr>
          <b-table :fields="fields" :filter="filter" :items="cars" :sort-by.sync="table.sortBy" :sort-compare="sortCompareAdvanced" bordered class="font-md-small" hover outlined responsive>
            <template slot="category" slot-scope="data">
              <div class>
                <img class="img-thumbnail icon-category" src="@/assets/images/icons/category/combustion.svg" v-if="data.item.category == 'combustion'" />
                <img class="img-thumbnail icon-category" src="@/assets/images/icons/category/electric.svg" v-if="data.item.category == 'electric'" />
              </div>
            </template>
            <template slot="car_number" slot-scope="data">{{data.item.car_number}}</template>
            <template slot="team.team_name" slot-scope="data">
              <div class="d-flex justify-content-between">
                <router-link :to="{name: 'team-id', params: {id: data.item.team._id}}" class="text-primary" tag="a">{{data.item.team.team_name}}</router-link>
                <router-link :to="{name: 'team-id-settings', params: {id: data.item.team._id}}" class="btn btn-sm btn-link cursor-pointer ml-auto" tag="a" v-if="isAdmin">
                  <i class="fas fa-pen"></i>
                </router-link>
              </div>
            </template>
            <template slot="team.institution.name" slot-scope="data">
              <truncate :length="45" :text="(data.item.team.institution.name || '').toString()" action-class="truncated-less-sign" clamp=" ... " less="[hide]"></truncate>
            </template>
            <template slot="team.social" slot-scope="data">
              <a :href="data.item.team.website_url" rel="noreferrer" target="_blank" v-if="data.item.team.website_url">
                <icon color="dark" name="fa fa-link" size="sm"></icon>
              </a>
              <a :href="data.item.team.social.facebook" rel="noreferrer" target="_blank" v-if="data.item.team.social.facebook">
                <icon name="fab fa-facebook" size="sm" style="color: #3B5999"></icon>
              </a>
              <a :href="data.item.team.social.twitter" rel="noreferrer" target="_blank" v-if="data.item.team.social.twitter">
                <icon name="fab fa-twitter" size="sm" style="color: #1DA1F2"></icon>
              </a>
              <a :href="data.item.team.social.instagram" rel="noreferrer" target="_blank" v-if="data.item.team.social.instagram">
                <icon color="danger" name="fab fa-instagram" size="sm"></icon>
              </a>
            </template>
            <template slot="team.url" slot-scope="data">

              <a :href="data.item.team.url" rel="noreferrer" target="_blank" v-if="data.item.team.url">
              <icon color="yellow" name="fas fa-folder" size="sm"></icon>
              </a>

            </template>
          </b-table>
        </no-ssr>
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
import moment from "moment";
import { mapGetters } from "vuex";
export default {
  components: {
    truncate
  },
  computed: {
    ...mapGetters(["isAdmin"]),
    pageCount: function() {
      if (this.teams) {
        let x = this.teams.length / this.table.perPage;
        let y = parseInt(x);
        return x == y ? y : y + 1;
      } else {
        return 1;
      }
    }
  },
  methods: {
    handleUpload(v) {
      this.uploadModal.file = this.$refs.upload_file.files[0];
    },
    sortCompareAdvanced: function(a, b, key) {
      let e1 = a,
        e2 = b;
      key.split(".").forEach(k => {
        e1 = e1[k];
        e2 = e2[k];
      });
      if (typeof e1 === "number" && typeof e2 === "number") {
        return e1 < e2 ? -1 : e1 > e2 ? 1 : 0;
      } else if (typeof e1 === "undefined") {
        return 1;
      } else {
        return e1.toString().localeCompare(e2.toString(), undefined, {
          numeric: true
        });
      }
    },
    formatDate(date) {
      return moment(date).format("YYYYMMDD-HHmmss");
    },
    sendDownloadRequest() {
      this.success = null;
      this.error = null;
      let params = this.$route.params;
      this.$axios
        .get(`/api/event/${params.id}/teams/csv`)
        .then(({ data }) => {
          console.log(data);
          if (data && data.success == false) {
            this.error = data.message;
          } else {
            const url = window.URL.createObjectURL(new Blob([data])),
              link = document.createElement("a"),
              fileName = `event-${params.id}-${this.formatDate(
                Date.now()
              )}.csv`;
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
      if (this.uploadModal.file) {
        console.log(this.uploadModal.file.name);
      }
      formData.append("file", this.uploadModal.file);
      this.$axios
        .post(`/api/event/${params.id}/teams/csv`, formData, {
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
    url2: 'https://drive.google.com/drive/u/3/folders/1J88BQXVpPA3kg0nE7y14cIw9ynITJn8Z',
      filter: null,
      table: {
        sortBy: "car_number"
      },
      fields: [
        {
          label: "",
          key: "category",
          sortable: true
        },
        {
          label: " ",
          key: "car_number",
          sortable: true
        },
        {
          sortable: true,
          label: " ",
          key: "team.team_name"
        },
        {
          key: "team.institution.name",
          label: " ",
          sortable: true
        },
        {
          sortable: true,
          label: " ",
          key: "team.country"
        },
        {
          label: " ",
          key: "team.social"
        },
        {
        label: " ",
        key: "team.url"
        }
      ],
      uploadModal: {
        show: false,
        file: null
      },
      error: null,
      success: null
    };
  },
  async asyncData({ $axios, params, error }) {
    try {
      const { data } = await $axios.get(`/api/event/${params.id}/cars`, {
        validateStatus: status => {
          return status < 400;
        }
      });
      let event_res = await $axios.get(`/api/event/${params.id}`, {
        validateStatus: status => {
          return status < 400;
        }
      });
      return {
        event: event_res.data.event,
        isLoaded: data.success,
        cars: data.cars
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
