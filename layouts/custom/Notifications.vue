<template>
<modal :show.sync="modalState.notifications" gradient="success" style="height: 100vh" modal-classes="modal-danger modal-dialog-centered">
  <h6 slot="header" class="modal-title display-4" id="modal-title-notification">Notifications</h6>
  <div class="py-0 text-center">
    <b-list-group class="modal-custom">
      <div class="notification" v-for="n in notif" :key="n.id">
        <b-list-group-item class="flex-column align-items-start" style="color: black;">
          <div class="d-flex w-100 justify-content-between">
            <b-link :to="n.link" class="font-weight-bold notification-header" @click="modalShowNotification">{{n.title}}</b-link>
            <b-badge variant="light">{{n.date}}</b-badge>
          </div>
          <p class="mb-1 font-weight-light notification-text">
            <vue-markdown>{{n.description}}</vue-markdown>
          </p>
        </b-list-group-item>
      </div>
    </b-list-group>
  </div>
  <template slot="footer">
    <base-button type="white" @click="modalShowNotification">Ok, Got it</base-button>
    <base-button type="link" text-color="white" class="ml-auto" @click="modalShowNotification">
      Close
    </base-button>
  </template>
</modal>
</template>

<script>
import axios from "axios";
import {
  mapGetters,
  mapActions,
  mapState,
  mapMutations
} from "vuex";
import Modal from "@/components/Modal";
import VueMarkdown from "vue-markdown";
let moment = require("moment");
export default {
  name: "notifications",
  data() {
    return {
      notif: []
    };
  },
  components: {
    Modal,
    "vue-markdown": VueMarkdown
  },
  computed: {
    ...mapState({
      modalState: state => state.modals
    })
  },
  methods: {
    ...mapMutations(["modalShowNotification"]),
    ...mapActions(["getReq"]),
    formatNotifications(notifications) {
      let temp = "",
        splitDesc = [],
        slicedDesc = [],
        splitSlicedDesc = [],
        dateTimeArray = [],
        dateTimeString = "",
        lengthOfNoti = 240;
      for (let n = 0; n < notifications.length; n++) {
        temp = notifications[n].description;
        splitDesc = temp.split(" ");
        if (temp.length > lengthOfNoti) {
          slicedDesc = temp.slice(0, lengthOfNoti);
          splitSlicedDesc = slicedDesc.split(" ");
          if (
            splitDesc[splitDesc.length - 1] !=
            splitSlicedDesc[splitSlicedDesc.length - 1]
          ) {
            splitSlicedDesc[splitSlicedDesc.length - 1] = "...";
          }
          temp = splitSlicedDesc.join(" ");
          notifications[n].description = temp;
          temp = notifications[n].date;
          dateTimeArray = temp.split("T");
          dateTimeString =
            dateTimeArray[0] + " " + dateTimeArray[1].split(".")[0];
          notifications[n].date = dateTimeString;
        }
      }
      return notifications;
    },
    async getNotifications() {
      try {
        let data = await this.getReq({
          url: `/api/event/fb2019/announcements`
        })
        if (!data) {
          return;
        }
        if (process.browser) {
          if(data.announcements) {
            let previousCount = localStorage.getItem("NotifCount")
            let currentCount = data.announcements.length
            localStorage.setItem("NotifCount", currentCount)
            // Temporary, will be done later.
            if (previousCount < currentCount) {
              this.notif.push({
                id: 1,
                title: "New announcements",
                link: "/event/fb2019/announcements",
                description: "There may be new notifications for FB2019",
                date: moment(Date.now()).fromNow()
              })
              this.notif = this.formatNotifications(this.notif)
          }
          }
        }
        // this.notif = data.announcements
      } catch (error) {
        console.log(error);
        return;
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      setInterval( async () => {
        this.getNotifications();
      }, 10000)
    })
  }
};
</script>
