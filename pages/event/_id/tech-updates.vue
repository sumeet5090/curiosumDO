<template>
<section class="section section-xl pt-0 mt-0">
    <modal :show.sync="editModalActive" gradient="secondary" modal-classes="modal-secondary modal-dialog-centered" v-if="editModalActive">
      <h6 class="modal-title" id="modal-title-notification" slot="header">Edit</h6>
      <b-form @reset.prevent="onReset" @submit.prevent>
        <b-form-group v-if="selectedRowEdit._id">
          <div class="container">
            <span class="row align-items-center" v-if="selectedRowEdit.team.cars[0].category === 'electric'">
              <base-switch class="mb-1" id="form-accumulator" v-model="selectedRowEdit.accumulator"></base-switch>
              <label class="ml-2 h6" for="form-accumulator">Accumulator</label>
            </span>
          </div>
          <div class="container">
            <span class="row align-items-center" v-if="selectedRowEdit.team.cars[0].category === 'electric'">
              <base-switch class="mb-1" id="form-scrutineering_elec" v-model="selectedRowEdit.scrutineering_elec"></base-switch>
              <label class="ml-2 h6" for="form-scrutineering_elec">Scrutineering Electric</label>
            </span>
          </div>
          <div class="container">
            <span class="row align-items-center">
              <base-switch class="mb-1" id="form-scrutineering_mech" v-model="selectedRowEdit.scrutineering_mech"></base-switch>
              <label class="ml-2 h6" for="form-scrutineering_mech">Scrutineering Mechanical</label>
            </span>
          </div>
          <div class="container">
            <span class="row align-items-center">
              <base-switch class="mb-1" id="form-driver_egress" v-model="selectedRowEdit.driver_egress"></base-switch>
              <label class="ml-2 h6" for="form-driver_egress">Driver Egress</label>
            </span>
          </div>
          <div class="container">
            <span class="row align-items-center">
              <base-switch class="mb-1" id="form-tilt" v-model="selectedRowEdit.tilt"></base-switch>
              <label class="ml-2 h6" for="form-tilt">Tilt</label>
            </span>
          </div>
          <div class="container">
            <span class="row align-items-center">
              <base-switch class="mb-1" id="form-noise_ready_to_drive_sound" v-model="selectedRowEdit.noise_ready_to_drive_sound"></base-switch>
              <label class="ml-2 h6" for="form-noise_ready_to_drive_sound">Noise ready to drive sound</label>
            </span>
          </div>
          <div class="container">
            <span class="row align-items-center">
              <base-switch class="mb-1" id="form-brakes" v-model="selectedRowEdit.brakes"></base-switch>
              <label class="ml-2 h6" for="form-brakes">Brakes</label>
            </span>
          </div>
          <div class="container">
            <span class="row align-items-center">
              <base-switch class="mb-1" id="form-rain" v-model="selectedRowEdit.rain"></base-switch>
              <label class="ml-2 h6" for="form-rain">Rain</label>
            </span>
          </div>
        </b-form-group>
        <b-alert :show="showDismissableAlert" @dismissed="showDismissableAlert=false" dismissible v-if="errors.length > 0" variant="danger">
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
      <div class="col-12">
        <p class="h3 header-font px-1 text-center"> Tech Updates for <strong class="text-primary text-capitalize">{{event.name}}</strong></p>
      </div>
    </b-row>
    <b-row class="justify-content-center">
      <div class="col-md-10">
        <b-table :fields="fields" :items="event.tech_updates" :sort-by.sync="table.sortBy" :sort-compare="sortCompareAdvanced" :sort-desc="table.sortDesc" bordered class="font-md-small" hover outlined responsive small>
          <template slot="team.cars.category" slot-scope="data">
            <div class="icon-container text-center">
              <img alt="Combustion" class="img-thumbnail icon-category" src="@/assets/images/icons/category/combustion.svg" title="Combustion" v-b-tooltip.hover.bottom v-if="data.item.team.cars[0].category == 'combustion'">
              <img alt="Electric" class="img-thumbnail icon-category" src="@/assets/images/icons/category/electric.svg" title="Electric" v-b-tooltip.hover.bottom v-if="data.item.team.cars[0].category == 'electric'">
            </div>
          </template>

          <template slot="team.cars.car_number" slot-scope="data">
            <div class="text-center px-0">{{data.item.team.cars[0].car_number}}</div>
          </template>
          <template slot="team.team_name" slot-scope="data">
            <div class="text-center px-0">
              <router-link :to="{name: 'team-id', params: {id: data.item.team._id}}" class="btn btn-link text-capitalize" tag="a">{{data.item.team.team_name}}</router-link>
            </div>
          </template>
          <template slot="team.institution.short_name" slot-scope="data">
            <div class="text-center px-0">{{data.item.team.institution.short_name}}</div>
          </template>
          <template slot="accumulator" slot-scope="data">
            <div class="icon-container text-center">
              <img :class="[{'gray-img': !data.item.accumulator}]" alt="Accumulator" class="icon-category" src="@/assets/images/icons/tech/accumulator.png" title="Accumulator" v-b-tooltip.hover.bottom>
            </div>
          </template>
          <template slot="scrutineering_elec" slot-scope="data">
            <div class="icon-container text-center">
              <img :class="[{'gray-img': !data.item.scrutineering_elec}]" alt="Scrutineering Electric" class="icon-category" src="@/assets/images/icons/tech/scrut-elec.png" title="Scrutineering Electric" v-b-tooltip.hover.bottom>
            </div>
          </template>
          <template slot="scrutineering_mech" slot-scope="data">
            <div class="icon-container text-center">
              <img :class="[{'gray-img': !data.item.scrutineering_mech}]" alt="Scrutineering Mechanical" class="icon-category" src="@/assets/images/icons/tech/scrut-mech.png" title="Scrutineering Mechanical" v-b-tooltip.hover.bottom>
            </div>
          </template>
          <template slot="driver_egress" slot-scope="data">
            <div class="icon-container text-center">
              <img :class="[{'gray-img': !data.item.driver_egress}]" alt="Driver Egress" class="icon-category" src="@/assets/images/icons/tech/egress.png" title="Driver Egress" v-b-tooltip.hover.bottom>
            </div>
          </template>
          <template slot="tilt" slot-scope="data">
            <div class="icon-container text-center">
              <img :class="[{'gray-img': !data.item.tilt}]" alt="Tilt" class="icon-category" src="@/assets/images/icons/tech/tilt.png" title="Tilt" v-b-tooltip.hover.bottom>
            </div>
          </template>
          <template slot="noise_ready_to_drive_sound" slot-scope="data">
            <div class="icon-container text-center">
              <img :class="[{'gray-img': !data.item.noise_ready_to_drive_sound}]" alt="Noise Ready to Drive Sound" class="icon-category" src="@/assets/images/icons/tech/noise.png" title="Noise Ready to Drive Sound" v-b-tooltip.hover.bottom>
            </div>
          </template>
          <template slot="brakes" slot-scope="data">
            <div class="icon-container text-center">
              <img :class="[{'gray-img': !data.item.brakes}]" alt="Breaks" class="icon-category" src="@/assets/images/icons/tech/brakes.png" title="Breaks" v-b-tooltip.hover.bottom>
            </div>
          </template>

          <template slot="rain" slot-scope="data">
            <div class="icon-container text-center">
              <img :class="[{'gray-img': !data.item.rain}]" alt="Rain" class="icon-category" src="@/assets/images/icons/tech/rain.png" title="Rain" v-b-tooltip.hover.bottom>
            </div>
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
  </section>
</template>

<script>
//"accumulator": true, "scrutineering_elec": null, "scrutineering_mech": true, "driver_egress": null, "tilt": null, "noise_ready_to_drive_sound": true, "brakes": null, "rain": true;
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      event: {},
      teams: [{}],
      editModalActive: false,
      deleteModalActive: false,
      selectedRowEdit: {
        _id: null,
        accumulator: false,
        scrutineering_elec: false,
        scrutineering_mech: false,
        driver_egress: false,
        tilt: false,
        noise_ready_to_drive_sound: false,
        brakes: false,
        rain: false
      },
      selectedRowDelete: {
        _id: null
      },
      table: {
        sortBy: "team.car_number",
        sortDesc: false,
        sortDirection: "asc"
      },
      fields: [
        {
          label: "⠀",
          key: "team.cars.category",
          sortable: true
        },
        {
          label: "⠀",
          key: "team.cars.car_number",
          sortable: true
        },
        {
          label: "⠀",
          key: "team.team_name",
          sortable: true
        },
        {
          label: "⠀",
          key: "team.institution.short_name",
          sortable: true
        },
        {
          label: "⠀",
          key: "accumulator",
          sortable: true,
          tdClass: "tupdates-icon",
        },
        {
          label: "⠀",
          key: "scrutineering_elec",
          sortable: true,
          tdClass: "tupdates-icon"
        },
        {
          label: "⠀",
          key: "scrutineering_mech",
          sortable: true,
          tdClass: "tupdates-icon"
        },
        {
          label: "⠀",
          key: "driver_egress",
          sortable: true,
          tdClass: "tupdates-icon"
        },
        {
          label: "⠀",
          key: "tilt",
          sortable: true,
          tdClass: "tupdates-icon"
        },
        {
          label: "⠀",
          key: "noise_ready_to_drive_sound",
          sortable: true,
          tdClass: "tupdates-icon"
        },
        {
          label: "⠀",
          key: "brakes",
          sortable: true,
          tdClass: "tupdates-icon"
        },
        {
          label: "Rain",
          key: "rain",
          sortable: true,
          tdClass: "tupdates-icon"
        },
        {
          label: "Actions",
          key: "actions",
          thClass: "d-none",
          tdClass: "d-none"
        }
      ],
      editModalActive: false,
      deleteModalActive: false,
      errors: [],
      success_msg: "",
      showDismissableAlert: false
    };
  },
  computed: {
    ...mapGetters(["isAdmin", "currentUser"])
  },
  methods: {
    ...mapActions(["getReq", "putReq", "delReq"]),

    sortCompareAdvanced: function(a, b, key) {
      let e1 = a;
      let e2 = b;
      key.split(" ").forEach(k => {
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
    deleteItemModal(item) {
      this.deleteModalActive = true;
      this.selectedRowDelete = JSON.parse(JSON.stringify(item));
    },
    async confirmEdit() {
      this.success_msg = "";
      this.errors = [];
      let updateEdit = this.selectedRowEdit;
      console.log(updateEdit._id)
      if (this.event._id && updateEdit._id) {
        let url = `/api/event/${this.event._id}/tech-updates/${updateEdit._id}`,
          body = {
            accumulator: updateEdit.accumulator,
            scrutineering_elec: updateEdit.scrutineering_elec,

            
            scrutineering_mech: updateEdit.scrutineering_mech,
            driver_egress: updateEdit.driver_egress,
            tilt: updateEdit.tilt,
            noise_ready_to_drive_sound: updateEdit.noise_ready_to_drive_sound,
            brakes: updateEdit.brakes,
            rain: updateEdit.rain
          };
        try {
          let res = await this.putReq({
            url,
            body
          });
          if (res.success) {
            this.success_msg = res.success_msg || "Updated tech update.";
            this.event.tech_updates.find((sc, id) => {
              if (sc._id === updateEdit._id) {
                Object.keys(updateEdit).forEach(key => {
                  this.event.tech_updates[id][key] = updateEdit[key];
                });
              }
            });
          } else {
            this.success_msg = "";
            this.showErr(res.message);
          }
        } catch (error) {
          console.log(error);
          this.success_msg = "";
          this.showErr("Internal server error.");
        }
      } else {
        this.success_msg = "";
        this.showErr("Schedule not found.");
      }
    },
    async confirmDelete() {
      this.success_msg = "";
      this.errors = [];
      let updateEdit = this.selectedRowDelete;
      if (this.event._id && updateEdit._id) {
        let url = `/api/event/${this.event._id}/techupdate/${updateEdit._id}`;
        try {
          let res = await this.delReq({
            url
          });
          if (res.success) {
            this.success_msg = res.message || "Deleted tech update.";
            for (let i = 0; i < this.event.tech_updates.length; i++) {
              if (this.event.tech_updates[i]._id === updateEdit._id) {
                var removedObject = this.event.tech_updates.splice(i, 1);
                removedObject = null;
                break;
              }
            }
          } else {
            this.success_msg = "";
            this.showErr(res.message);
          }
        } catch (error) {
          this.success_msg = "";
          this.showErr("Internal server error.");
        }
      } else {
        this.success_msg = "";
        this.showErr("Schedule not found.");
      }
      this.deleteModalActive = false;
    },
    cancelEdit() {
      this.editModalActive = false;
      this.selectedRowEdit = {};
    },
    cancelDelete() {
      this.deleteModalActive = false;
      this.selectedRowDelete = {};
    },
    showErr(msg) {
      this.succ
      ess_msg = "";
      this.showDismissibleAlert = true;
      this.errors.push(msg);
    }
  },
  mounted() {
    this.$nextTick(async function() {
      try {
        let res = await this.getReq({
          url: `/api/event/${this.$route.params.id}/tech-updates`
        });
        if (res.success) {
          this.event = res.event;
        } else {
          this.event = {};
        }
      } catch (err) {
        console.log(err);
      }
    });
    if (this.isAdmin == true) {
      this.fields[12].thClass = " ";
      this.fields[12].tdClass = " ";
    }
  }
};
</script>

<style lang="scss">
.icon-container {
  padding: 0;
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
.gray-img1 {
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
}

.tupdates-icon {
  padding: 1rem 0;
}
.table td,
.table th {
  vertical-align: middle;
}
th {
  text-align: center !important;
  padding: 0 !important;
}
</style>
