<template>
<section class="section">
  <div class="container px-0">
    <div class="row justify-content-center mx-0">
      <div class="col-sm-12 col-md-12 px-0">
        
    <div v-if="isAdmin">
      <no-ssr>
        <div class="card shadow">
          <div class="card-header bg-transparent border-0">
            <h3 class="text-center mb-0 header-font" v-if="event">{{event.name}} Teams</h3>
          </div>
          <b-container class="px-0">
            <div class="row mx-0 justify-content-center">
              <div class="col-sm-12 col-md-8 pl-0">
                <base-input addon-left-icon="fas fa-search text-success" placeholder="Search" v-model="searchText"></base-input>
              </div>
              <div class="col">
                <b-btn @click="addTeamModal" variant="success">Add team</b-btn>
              </div>
              <!-- <div class="col">
                <base-button @click.prevent="uploadModal.show = true" outline type="primary">Upload</base-button>
              </div>
              <div class="col pr-0">
                <b-btn @click="sendDownloadRequest" variant="success">Download?</b-btn>
              </div> -->
            </div>
            <div class="table-responsive-sm">
              <table class="table">
                <thead class>
                  <tr>
                    <th scope="col">
                      <div class="border-right">Car #</div>
                    </th>
                    <th scope="col">Team Name</th>
                    <th scope="col">Institution</th>
                    <th scope="col">Captain</th>
                    <th scope="col">Members</th>
                    <th scope="col">Country</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr :key="car._id" v-for="car in filteredCars">
                    <th scope="row">
                      <div class="media align-items-center">
                        <div class="media-body">
                          <span class="mb-0 text-sm">{{car.car_number}}</span>
                        </div>
                      </div>
                    </th>
                    <td>
                      <a :href="'/team/'+car.team._id" target="_blank">{{car.team.team_name}}</a>
                    </td>
                    <td>
                      <div v-if="car.team.institution">{{car.team.institution.name}}</div>
                    </td>
                    <td>
                      <div v-if="car.team.captain">
                        <a :href="`/profile/${getAlt(car.team.captain)}`" target="_blank">{{getName(car.team.captain)}}</a>
                      </div>
                    </td>
                    <td>
                      <div v-if="car.team.users && car.team.users.length > 0">{{car.team.users.length}}</div>
                    </td>
                    <td>
                      <div v-if="car.team.country">{{car.team.country}}</div>
                    </td>
                    <td>
                      <b-dropdown no-caret size="sm" toggle-class="text-decoration-none" variant="link">
                        <template slot="button-content">
                          <i class="fas fa-ellipsis-h"></i>
                        </template>
                        <b-dropdown-item @click.prevent="editTeamModal(car._id)">Edit</b-dropdown-item>
                        <b-dropdown-item @click.prevent="deleteTeamModal(car._id)">Remove</b-dropdown-item>
                      </b-dropdown>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </b-container>
        </div>
        <modal :show.sync="addTeam.modal" modal-classes="modal-dark modal-dialog-centered modal-lg" modal-gradient="dark" v-if="addTeam.modal">
          <h6 class="modal-title" id="modal-title-notification" slot="header">Add team to event</h6>
          <b-container>
            <b-form @reset.prevent="onReset" @submit.prevent>
              <b-form-group>
                <label class="typo__label">Search and select team</label>
                <multiselect :options="teams" label="team_name" placeholder="Pick a team" track-by="team_name" v-model="addTeam.team"></multiselect>
              </b-form-group>
              <b-form-group label="Category">
                <multiselect :close-on-select="true" :custom-label="camelCaseText" :options="['electric', 'combustion']" :searchable="false" :show-labels="true" placeholder="Pick a category" v-model="addTeam.category"></multiselect>
              </b-form-group>
              <b-form-group label="Car number">
                <b-input placeholder="Enter number" v-model="addTeam.car_number"></b-input>
              </b-form-group>
            </b-form>
          </b-container>
          <template slot="footer">
            <base-button @click.prevent class="mr-auto" text-color="white" type="link">Cancel</base-button>
            <base-button @click.prevent="addTeamSubmit" type="secondary">Confirm</base-button>
          </template>
        </modal>
        <modal :show.sync="editTeam.modal" modal-classes="modal-dark modal-dialog-centered modal-lg" modal-gradient="dark" v-if="editTeam.modal">
          <h6 class="modal-title" id="modal-title-notification" slot="header">Edit car information</h6>
          <b-container>
            <b-form @reset.prevent="onReset" @submit.prevent>
              <b-form-group>
                <b-input :value="editTeam.team.team_name" class="text-dark" disabled></b-input>
              </b-form-group>
              <b-form-group label="Category">
                <multiselect :close-on-select="true" :custom-label="camelCaseText" :options="['electric', 'combustion']" :searchable="false" :show-labels="true" placeholder="Pick a category" v-model="editTeam.category"></multiselect>
              </b-form-group>
              <b-form-group label="Car number">
                <b-input class="text-dark" placeholder="Enter number" v-model="editTeam.car_number"></b-input>
              </b-form-group>
            </b-form>
          </b-container>
          <template slot="footer">
            <base-button @click.prevent class="mr-auto" text-color="white" type="link">Cancel</base-button>
            <base-button @click.prevent="editTeamSubmit" type="secondary">Confirm</base-button>
          </template>
        </modal>
        <modal :show.sync="deleteTeam.modal" modal-classes="modal-danger modal-dialog-centered " modal-gradient="danger" v-if="deleteTeam.modal">
          <h6 class="modal-title" id="modal-title-notification" slot="header">Remove car</h6>
          <b-container>
            <b-row>
              <b-col>
                <div class="text-center">Car # {{deleteTeam.car_number}} - {{deleteTeam.team.team_name}}</div>
                <div class="text-center">Are you sure you want to remove this car?</div>
              </b-col>
            </b-row>
          </b-container>
          <template slot="footer">
            <base-button @click.prevent class="mr-auto" text-color="white" type="link">Cancel</base-button>
            <base-button @click.prevent="deleteTeamSubmit" type="secondary">Confirm</base-button>
          </template>
        </modal>
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
      </no-ssr>
    </div>
      </div>
    </div>
  </div>
</section>
</template>
<script>
import moment from "moment";
import Multiselect from "vue-multiselect";
const noProfilePic = require("@/assets/images/noprofilepic.png");
import "vue-multiselect/dist/vue-multiselect.min.css";
import { mapGetters } from "vuex";
export default {
  components: {
    multiselect: Multiselect
  },
  data() {
    return {
      event: null,
      cars: [],
      params: {},
      addTeam: {
        modal: false,
        event: null,
        team: null,
        car_number: null,
        category: null
      },
      editTeam: {
        modal: false,
        event: null,
        team: null,
        car_number: null,
        category: null
      },
      deleteTeam: {
        modal: false,
        event: null,
        team: null,
        car_number: null,
        category: null
      },
      searchText: "",
      noProfilePic: noProfilePic,
      teams: [],
      value: null,
      uploadModal: {
        show: false,
        file: null
      },
      error: null,
      success: null
    };
  },
  computed: {
    ...mapGetters(["isAdmin"]),
    filteredCars() {
      if (this.searchText !== "") {
        return this.cars.filter(car => {
          if (
            car.team.team_name
              .toLowerCase()
              .includes(this.searchText.toLowerCase())
          ) {
            return true;
          }
          if (
            car.team.institution &&
            car.team.institution.name &&
            car.team.institution.name
              .toLowerCase()
              .includes(this.searchText.toLowerCase())
          ) {
            return true;
          }
          if (
            car.car_number.toLowerCase().includes(this.searchText.toLowerCase())
          ) {
            return true;
          }
        });
      }
      return this.cars;
    }
  },
  methods: {
    addTeamModal() {
      this.addTeam = {
        modal: true,
        event: this.params.id,
        team: null,
        car_number: null,
        category: null
      };
    },
    formatDate(date) {
      return moment(date).format("YYYYMMDD-HHmmss");
    },
    sendDownloadRequest() {
      this.success = null;
      this.error = null;
      let params = this.$route.params;
      this.$axios
        .get(`/api/event/${params.id}/csv/cars`)
        .then(({ data }) => {
          if (data && data.success == false) {
            this.error = data.message;
          } else {
            const url = window.URL.createObjectURL(
                new Blob([data], { type: "text/csv;charset=UTF-8" })
              ),
              link = document.createElement("a"),
              fileName = `event-${params.id}-cars-${this.formatDate(
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
        .post(`/api/event/${params.id}/csv/cars`, formData, {
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
    addTeamSubmit() {
      let { event, team, car_number, category } = this.addTeam;
      console.log(team);
      this.$axios
        .post(`/api/event/${event}/cars/${team._id}/car`, {
          car_number,
          category
        })
        .then(res => {
          if (res.data && res.data.success) {
            console.log("Added team // Show success msg");
            this.$router.go(this.$route.name);
          } else {
            console.log("Couldn't add team // Show failed msg");
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addTeamCancel() {
      this.addTeam = {
        modal: false,
        event: null,
        team: null,
        car_number: null,
        category: null
      };
    },
    editTeamModal(car_id) {
      let car = this.cars.find(c => c._id === car_id);
      console.log(car);
      if (car) {
        this.editTeam = {
          modal: true,
          event: this.params.id,
          team: car.team,
          car_number: car.car_number,
          category: car.category,
          car_id: car._id
        };
      }
    },
    editTeamSubmit() {
      let event = this.params.id;
      let { team, category, car_id, car_number } = this.editTeam;
      this.$axios
        .put(`/api/event/${event}/cars/${team._id}/car`, {
          car_number,
          category
        })
        .then(res => {
          if (res.data && res.data.success) {
            console.log("Success");
            this.$router.go(this.$route.name);
          } else {
            console.log("Failed");
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    deleteTeamModal(car_id) {
      let car = this.cars.find(c => c._id === car_id);
      if (car) {
        this.deleteTeam = {
          modal: true,
          event: this.params.id,
          team: car.team,
          car_number: car.car_number,
          category: car.category
        };
      }
    },
    deleteTeamSubmit() {
      let event = this.params.id;
      let { team } = this.deleteTeam;
      if (team && team._id) {
        this.$axios
          .delete(`/api/event/${event}/cars/${team._id}/car`)
          .then(res => {
            console.log(res.data);
            if (res.data && res.data.success) {
              console.log("Success");
              this.$router.go(this.$route.name);
            } else {
              console.log("failed");
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    camelCaseText(v) {
      let vl = v.toLowerCase();
      vl = vl.split("");
      vl[0] = vl[0].toUpperCase();
      vl = vl.join("");
      return vl;
    },
    getTeams() {
      this.$axios
        .get(`/api/team`)
        .then(res => {
          if (res.data && res.data.success) {
            this.teams = res.data.teams;
          } else {
            this.teams = [];
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getEvent() {
      this.$axios
        .get(`/api/event/${this.params.id}`)
        .then(res => {
          if (res.data && res.data.success) {
            this.event = res.data.event;
          } else {
            this.event = {};
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getCars() {
      // Populate car with team infp
      this.$axios
        .get(`/api/event/${this.params.id}/cars`)
        .then(res => {
          if (res.data && res.data.success) {
            this.cars = res.data.cars;
          } else {
            this.cars = [];
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getSrc(user) {
      if (user.profile) {
        return user.profile.picture;
      }
      return this.noProfilePic;
    },
    getAlt(user) {
      return user.username;
    },
    getName(user) {
      return user.display_name;
    }
  },
  mounted() {
    console.log(this.params);
    this.getEvent();
    this.getCars();
    this.getTeams();
  },
  created() {
    this.params = this.$route.params;
  }
};
</script>

<style lang="scss">
.table {
  th,
  td {
    padding-left: 0rem;
    padding-right: 0rem;
  }
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
</style>
