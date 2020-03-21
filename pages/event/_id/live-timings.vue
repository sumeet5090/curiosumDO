<template>
  <section class="section">
    <div class="container">
      <modal :show.sync="editModalActive" gradient="secondary" modal-classes="modal-secondary modal-dialog-centered" v-if="editModalActive">
        <h6 class="modal-title" id="modal-title-notification" slot="header">Edit</h6>
        <b-form @reset.prevent @submit.prevent>
          <b-form-group id="form-input-event_names" label="Event name:" label-for="form-input-event_names--input" v-if="editModalActive">
            <b-form-select :options="event_names" class="mb-3 text-dark" id="form-input-event_names--input" required v-model="selectedRowEdit.event_name"></b-form-select>
          </b-form-group>
          <b-form-group id="form-lap-num" label="Lap number:" label-for="form-lap-num--input" v-if="editModalActive">
            <b-form-input class="mb-3 text-dark" id="form-lap-num--input" max="1000" min="0" placeholder="Enter lap number." type="number" v-model="selectedRowEdit.lap_number"></b-form-input>
          </b-form-group>
          <b-form-group id="form-lap-time" label="Lap time:" label-for="form-lap-time--input" v-if="editModalActive">
            <b-form-input class="mb-3 text-dark" id="form-lap-time--input" placeholder="Enter lap time (seconds)" type="text" v-model="selectedRowEdit.lap_time"></b-form-input>
          </b-form-group>
          <b-form-group id="form-driver-initial" label="Driver initial:" label-for="form-driver-initial--input" v-if="editModalActive">
            <b-form-input class="mb-3 text-dark" id="form-driver-initial--input" placeholder="Enter driver initial" type="text" v-model="selectedRowEdit.driver_initial"></b-form-input>
          </b-form-group>
          <b-alert :show="errors.length > 0" @dismissed="showDismissibleAlert=false" dismissible v-if="showDismissibleAlert" variant="danger">
            <div :key="error" v-for="error in errors">{{error}}</div>
          </b-alert>
          <b-alert :show="!!success_msg" variant="success">
            <div>{{success_msg}}</div>
          </b-alert>
        </b-form>
        <template slot="footer">
          <base-button @click.prevent="cancelEdit" class="mr-auto" text-color="dark" type="link">Cancel</base-button>
          <base-button @click.prevent="confirmEdit" type="success">Confirm</base-button>
        </template>
      </modal>
      <modal :show.sync="deleteModalActive" gradient="danger" modal-classes="modal-danger modal-dialog-centered modal-sm" v-if="deleteModalActive">
        <h6 class="modal-title" id="modal-title-notification" slot="header">Delete</h6>
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
        <span class="display-4 header-font">Live Timings for
          <strong class="text-primary">{{event.name}}</strong>
        </span>
      </b-row>
      <b-row class="justify-content-center">
        <div class="header-font">The following entries are unofficial.</div>
      </b-row>
      <b-row class="justify-content-center">
        <div class="col-12">
          <b-table :fields="fields" :items="event.live_timings" :sort-by.sync="table.sortBy" :sort-compare="sortCompareAdvanced" :sort-desc="table.sortDesc" bordered hover outlined responsive small class="font-md-small">
            <template slot="team_id.category" slot-scope="data">
              <div class="icon-container text-center">
                <img class="img-thumbnail icon-category" src="@/assets/images/icons/category/combustion.svg" title="Combustion" v-b-tooltip.hover.bottom v-if="data.item.team_id.category == 'combustion'">
                <img class="img-thumbnail icon-category" src="@/assets/images/icons/category/electric.svg" title="Electric" v-b-tooltip.hover.bottom v-if="data.item.team_id.category == 'electric'">
              </div>
            </template>
            <template slot="team_id.car_number" slot-scope="data">
              <div class="text-center px-0">{{data.item.team_id.car_number}}</div>
            </template>
            <template slot="team_id.team_name" slot-scope="data">
              <div class="text-center px-1">{{data.item.team_id.team_name}}</div>
            </template>
            <template slot="team_id.institution.short_name" slot-scope="data">
              <div class="text-center px-1">{{data.item.team_id.institution.short_name}}</div>
            </template>
            <template slot="event_name" slot-scope="data">
              <div class="text-center">{{data.item.event_name}}</div>
            </template>
            <template slot="lap_number" slot-scope="data">
              <div class="text-center px-0">{{data.item.lap_number}}</div>
            </template>
            <template slot="lap_time" slot-scope="data">
              <div class="text-center px-0">{{data.item.lap_time}}</div>
            </template>
            <template slot="driver_initial" slot-scope="data">
              <div class="text-center px-0">{{data.item.driver_initial}}</div>
            </template>
            <template slot="actions" slot-scope="data">
              <div class="text-center" v-if="isAdmin">
                <i @click="editItemModal(data.item)" class="fas fa-pen mr-2 cursor-pointer text-primary"></i>
                <i @click="deleteItemModal(data.item)" class="fas fa-trash-alt cursor-pointer text-danger"></i>
              </div>
            </template>
          </b-table>
        </div>
      </b-row>
    </div>
  </section>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { setInterval } from 'timers';
export default {
  data() {
    return {
      pagination: {

      },
      editModalActive: false,
      deleteModalActive: false,
      selectedRowEdit: {
        _id: null,
        event_name: null,
        lap_time: null,
        lap_number: null,
        driver_initial: null
      },
      selectedRowDelete: {
        _id: null
      },
      event_names: [
        {
          value: null,
          text: "Select event name"
        },
        {
          value: "Skid Pad",
          text: "Skid Pad"
        },
        {
          value: "Acceleration",
          text: "Acceleration"
        },
        {
          value: "Autocross",
          text: "Autocross"
        },
        {
          value: "Endurance",
          text: "Endurance"
        }
      ],
      selected: [],
      event: {},
      teams: [{}],
      fields: [
        {
          label: "⠀",
          key: "team_id.category",
          sortable: true
        },
        {
          label: " ",
          key: "team_id.car.car_number",
          sortable: true
        },
        {
          label: " ",
          key: "team_id.team_name",
          sortable: true
        },
        {
          label: " ",
          key: "team_id.institution.short_name",
          sortable: true
        },
        {
          label: "Event name",
          key: "event_name",
          sortable: true
        },
        {
          label: "Run #",
          key: "lap_number",
          sortable: true
        },
        {
          label: "Time",
          key: "lap_time",
          sortable: true
        },
        {
          label: "Driver",
          key: "driver_initial",
          sortable: true
        },
        {
          label: "Actions",
          key: "actions",
          thClass: "d-none",
          tdClass: "d-none"
        }
      ],
      errors: [],
      success_msg: "",
      showDismissibleAlert: false,
      table: {

        sortDesc: false,
        sortDirection: "asc"
      },
    };
  },
  computed: {
    ...mapGetters(["currentUser", "isAdmin"])
  },
  methods: {
    ...mapActions(["getReq", "putReq", "delReq"]),
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
    editItemModal(item) {
      this.editModalActive = true;
      this.selectedRowEdit = JSON.parse(JSON.stringify(item));
    },
    cancelEdit() {
      this.editModalActive = false;
      this.selectedRowEdit = {
        _id: null,
        event_name: null,
        lap_time: null,
        lap_number: null,
        driver_initial: null
      };
    },
    async confirmEdit() {
      this.success_msg = ''
      this.errors = []
      let updateItem = this.selectedRowEdit;
      if (updateItem._id && this.event._id) {
        if (
          updateItem.lap_number >= 0 &&
          updateItem.driver_initial.length > 0 &&
          updateItem.lap_time &&
          updateItem.event_name.length >= 0
        ) {
          let url = `/api/event/${this.event._id}/livetimings/${updateItem._id}`,
            body = {
              event_name: updateItem.event_name,
              lap_number: updateItem.lap_number,
              lap_time: updateItem.lap_time,
              driver_initial: updateItem.driver_initial
            };
          try {
            let res = await this.putReq({
              url, 
              body
            });
            if (res.success) {
              this.success_msg = res.message || "Live timing updated!";
              this.event.live_timings.find((lt, id) => {
                if (lt._id === updateItem._id) {
                  console.log("Found event, updated?");
                  Object.keys(updateItem).forEach(key => {
                    this.event.live_timings[id][key] = updateItem[key];
                  });
                }
              });
            } else {
              this.showErr(res.message);
            }
          } catch (error) {
            this.showErr("Internal Server Error.");
          }
        }
      } else {
        this.showErr("Please enter the required information.");
      }
    },
    async confirmDelete() {
      this.success_msg = ''
      this.errors = []
      let deleteItem = this.selectedRowDelete;
      if (deleteItem._id && this.event._id) {
        let url = `/api/event/${this.event._id}/live-timing/${deleteItem._id}`;
        let res = await this.delReq({ url });
        if (res.success) {
          this.success_msg = res.message || "Deleted Live timing."
        } else {
          this.showErr(res.message)
        }
      } else {
        this.showErr("Some error, try again.")
      }
    },
    cancelDelete(){
      this.success_msg = ""
      this.errors = []
      this.deleteModalActive = false;
      this.selectedRowDelete = {
        _id: null
      };
    },
    showErr(msg) {
      this.success_msg = "";
      this.showDismissibleAlert = true;
      this.errors.push(msg);
    },
    deleteItemModal(item) {
      this.success_msg = ""
      this.errors = []
      this.deleteModalActive = true;
      this.selectedRowDelete = JSON.parse(JSON.stringify(item));
    },
    async liveTiming() {
      try {
        let res = await this.getReq({
          url: `/api/event/${this.$route.params.id}/live-timings`
        });
        if (res.success) {
          this.event = res.event;
        } else {
          this.event = {};
        }
      } catch (err) {
        console.log(err);
      }
    }
  },
  mounted() {
    if (this.isAdmin == true) {
      this.fields[8].thClass = "";
      this.fields[8].tdClass = "";
    }
    let _this = this
    this.$nextTick( async () => {
      await _this.liveTiming()
      setInterval(async () => {
        await _this.liveTiming()
      }, 5000)
    });
  }
};
</script>

<style lang="scss">
.editable-input {
  input {
    border-width: 0;
    height: auto;
    width: auto;

    text-align: center;
    font-size: inherit;
    color: inherit;

    &.form-control {
      width: auto !important;
      padding: 0 !important;
      margin: 0 !important;
    }
  }

  &.focused {
    input {
      border-width: 1px;
    }
  }
}

.icon-container {
  padding: 0;
}

th.sorting::before,
th.sorting::after {
  padding-bottom: 0 !important;
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

.gray-img {
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
}

.table td {
  padding: 1rem 0;
}

th {
  text-align: center !important;
}
</style>
