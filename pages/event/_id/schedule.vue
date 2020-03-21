<template>
<section class="section section-xl pt-0 mt-0">
  <modal :show.sync="editModalActive" gradient="secondary" modal-classes="modal-secondary modal-dialog-centered" v-if="editModalActive">
    <h6 class="modal-title" id="modal-title-notification" slot="header">Edit</h6>
    <b-form @reset.prevent @submit.prevent style="overflow-y: scroll; max-height: 50vh;">
      <b-form-group class="my-1" id="form-day-number" label="Day Number:" label-class="p-0" label-for="form-day-number--input">
        <b-form-input class="text-dark" id="form-day-number--input" max="100" min="0" placeholder="Enter day number" required type="number" v-model="selectedRowEdit.day_number"></b-form-input>
      </b-form-group>
      <b-form-group class="my-1" id="form-day-number" label="Day:" label-class="p-0" label-for="form-day--input">
        <b-form-input class="text-dark" id="form-day--input" min="1" placeholder="Enter day" required type="text" v-model="selectedRowEdit.day"></b-form-input>
      </b-form-group>
      <b-form-group class="my-1" id="form-date" label="Date:" label-class="p-0" label-for="form-date--input">
        <base-input addon-left-icon="fa fa-calendar" id="form-date--input">
          <flatpickr :config="{altInput: true, dateFormat: 'Z', altFormat: 'J F Y' }" @on-close="blur" @on-open="focus" class="form-control text-dark datepicker" slot-scope="{focus, blur}" v-model="selectedRowEdit.date"></flatpickr>
        </base-input>
      </b-form-group>
      <b-form-group class="my-1" id="form-activity-number" label="Activity:" label-class="p-0" label-for="form-activity--input">
        <b-form-input class="text-dark" id="form-activity--input" min="1" placeholder="Enter activity" required type="text" v-model="selectedRowEdit.activity"></b-form-input>
      </b-form-group>
      <b-form-group class="my-1" id="form-start_time" label="Start Time:" label-class="p-0" label-for="form-start_time--input">
        <base-input addon-left-icon="far fa-clock" id="form-start_time--input">
          <flatpickr :config="{noCalendar: true, defaultDate: selectedRowEdit.date, enableTime: true, altInput: true, dateFormat: 'h:i K', altFormat: 'h:i K' }" @on-close="blur" @on-open="focus" class="form-control text-dark datepicker" slot-scope="{focus, blur}" v-model="selectedRowEdit.start_time"></flatpickr>
        </base-input>
      </b-form-group>
      <b-form-group class="my-1" id="form-end_time" label="End Time:" label-class="p-0" label-for="form-end_time--input">
        <base-input addon-left-icon="far fa-clock" id="form-end_time--input">
          <flatpickr :config="{noCalendar: true, defaultDate: selectedRowEdit.date, enableTime: true, altInput: true, dateFormat: 'h:i K', altFormat: 'h:i K' }" @on-close="blur" @on-open="focus" class="form-control text-dark datepicker" slot-scope="{focus, blur}" v-model="selectedRowEdit.end_time"></flatpickr>
        </base-input>
      </b-form-group>
      <b-form-group class="my-1" id="form-comments-number" label="Comments:" label-class="p-0" label-for="form-comments--input">
        <b-form-input class="text-dark" id="form-comments--input" min="1" placeholder="Enter comment" required type="text" v-model="selectedRowEdit.comments"></b-form-input>
      </b-form-group>
      <b-form-group class="my-1" id="form-location-number" label="Location:" label-class="p-0" label-for="form-location--input">
        <b-form-input class="text-dark" id="form-location--input" min="1" placeholder="Enter location" required type="text" v-model="selectedRowEdit.location"></b-form-input>
      </b-form-group>
      <b-form-group>
        <div class="container">
          <span class="row align-items-center">
              <base-switch class v-model="selectedRowEdit.visitor_view"></base-switch>
              <span class="ml-2">Visitor</span>
          </span>
        </div>
      </b-form-group>
      <b-form-group>
        <div class="container">
          <span class="row align-items-center">
              <base-switch class="mb-1" v-model="selectedRowEdit.participant_view"></base-switch>
              <span class="ml-2">Participant</span>
          </span>
        </div>
      </b-form-group>
      <b-form-group>
        <div class="container">
          <span class="row align-items-center">
              <base-switch class="mb-1" v-model="selectedRowEdit.volunteer_view"></base-switch>
              <span class="ml-2">Volunteer</span>
          </span>
        </div>
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
      <b-alert :show="errors.length > 0" @dismissed="showDismissibleAlert=false" dismissible v-if="showDismissibleAlert" variant="danger">
        <div :key="error" v-for="error in errors">{{error}}</div>
      </b-alert>
      <b-alert :show="!!success_msg" variant="success">
        <div>{{success_msg}}</div>
      </b-alert>
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
    <div class="display-4 header-font">Schedules</div>
  </b-row>
  <b-row class="justify-content-center">
    <div class="col-10">
      <b-table :fields="fields" :items="event.schedules" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" bordered class="font-small" hover outlined responsive small>
        <template slot="date" slot-scope="data">{{getDate(data.item.date)}}</template>
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
import moment from "moment";
import {
  mapActions,
  mapGetters
} from "vuex";
import flatPicker from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
export default {
  data() {
    return {
      event: {
        schedules: []
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
      sortBy: "day_number",
      sortDesc: false,
      fields: [{
          label: "Day #",
          key: "day_number",
          sortable: true
        },
        {
          label: "Day",
          key: "day",
          sortable: true
        },
        {
          label: "Date",
          key: "date",
          sortable: true
        },
        {
          label: "Activity",
          key: "activity"
        },
        {
          label: "Start Time",
          key: "start_time",
          sortable: true
        },
        {
          label: "End Time",
          key: "end_time",
          sortable: true
        },
        {
          label: "Location",
          key: "location",
          sortable: true
        },
        {
          label: "Comments",
          key: "comments",
          sortable: true
        },
        {
          label: "Actions",
          key: "actions",
          thClass: "d-none",
          tdClass: "d-none"
        }
      ],
      success_msg: "",
      errors: [],
      showDismissibleAlert: false
    };
  },
  components: {
    flatpickr: flatPicker
  },
  methods: {
    ...mapActions(["getReq", "putReq", "delReq"]),
    async getSchedules() {
      try {
        let res = await this.getReq({
          url: `/api/event/${this.$route.params.id}/schedules`
        });
        if (res.success) {
          return (this.event = res.event);
        }
        return (this.event = {
          schedules: []
        });
      } catch (error) {
        console.log(error);
        return (this.event = {
          schedules: []
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
      if (this.event._id && updateEdit._id) {
        if (updateEdit.day_number && updateEdit.day) {
          let url = `/api/event/${this.event._id}/schedule/${updateEdit._id}`,
            body = {
              day_number: updateEdit.day_number,
              day: updateEdit.day,
              date: updateEdit.date,
              activity: updateEdit.activity,
              start_time: updateEdit.start_time,
              end_time: updateEdit.end_time,
              location: updateEdit.location,
              comments: updateEdit.comments,
              volunteer_view: updateEdit.volunteer_view,
              participant_view: updateEdit.participant_view,
              visitor_view: updateEdit.visitor_view
            };
          try {
            let res = await this.putReq({
              url,
              body
            });
            if (res.success) {
              this.success_msg = res.success_msg || "Updated schedule.";
              this.event.schedules.find((sc, id) => {
                if (sc._id === updateEdit._id) {
                  Object.keys(updateEdit).forEach(key => {
                    this.event.schedules[id][key] = updateEdit[key];
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
          this.showErr("Couldn't delete schedule.");
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
        let url = `/api/event/${this.event._id}/schedule/${updateEdit._id}`;
        try {
          let res = await this.delReq({
            url
          });
          if (res.success) {
            this.success_msg = res.message || "Deleted schedule.";
            for (let i = 0; i < this.event.schedules.length; i++) {
              if (this.event.schedules[i]._id === updateEdit._id) {
                var removedObject = this.event.schedules.splice(i, 1);
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
      this.success_msg = "";
      this.showDismissibleAlert = true;
      this.errors.push(msg);
    },
    getDate(date) {
      return moment(date).format("LL");
    }
  },
  computed: {
    ...mapGetters(["isAdmin", "currentUser"])
  },
  beforeMount() {
    this.$nextTick(async () => {
      await this.getSchedules();
    });
  },
  mounted() {
    if (this.isAdmin == true) {
      this.fields[8].thClass = "";
      this.fields[8].tdClass = "";
    }
  }
};
</script>

<style lang="scss">
.font-small {
  font-size: 0.8rem;
}
</style>
