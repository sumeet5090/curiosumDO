<template>
  <section class="section min-vh-100">
    <div v-if="isAdmin">
      <div class="card bg-default shadow">
        <div class="card-header bg-transparent border-0">
          <h3 class="text-white mb-0">Events</h3>
        </div>
        <div class="table-responsive">
          <table class="table align-items-center table-dark table-flush">
            <thead class="thead-dark">
              <tr>
                <th scope="col">Event Name</th>
                <th scope="col">Teams Registered</th>
                <th scope="col">Rules Forum</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr :key="eve._id" v-for="eve in events">
                <th scope="row">
                  <div class="media align-items-center">
                    <div class="media-body">
                      <span class="mb-0 text-sm">{{eve.name}}</span>
                    </div>
                  </div>
                </th>
                <td>{{eve.cars.length}}</td>
                <td>
                  <router-link :to="{name: 'event-id-forum', params: { id: eve.event_short}}" class="btn btn-sm btn-curiosum" tag="a">Forum</router-link>
                </td>
                <td>
                  <b-dropdown size="sm">info</b-dropdown>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <b-container class="px-0">
      <b-row class="mx-0">
        <div class="col-12 text-center header-font font-weight-bold h4">EVENT TEAMS CARS</div>
      </b-row>
      <div :key="car._id" v-for="car in cars">{{car}}</div>
      <div :key="ev._id" v-for="ev in events">
        <div>{{ev.name}}</div>
        <div>
          <base-input addon-left-icon="fas fa-search" placeholder="Search for team"></base-input>
        </div>
        <div>
          <base-button type="success">Add New team to event</base-button>
        </div>

        <div :key="te" v-for="te in ev.teams">
          <div>{{getTeamInfo(te)}}</div>
          <div>
            <base-button type="danger">Remove team from event</base-button>
          </div>
        </div>
      </div>
      <div :key="team._id" v-for="team in teams">{{team.team_name}}</div>
    </b-container>
  </section>
</template>

<script>
export default {
  data() {
    return {
      events: [],
      teams: [],
      cars: []
    };
  },
  methods: {
    getTeamInfo(id) {
      if (this.teams && this.teams.length > 0) {
        let f = this.teams.find(ob => ob._id === id);
        if (f) {
          return f;
        }
      }
    },
    loadEvents() {
      this.$axios
        .get("/api/event")
        .then(res => {
          if (res.data && res.data.success) {
            console.log("Found events");
            this.events = res.data.events;
          } else {
            this.events = [];
          }
        })
        .catch(err => {
          if (err) {
            console.log(err);
          }
          this.events = [];
        });
    },
    loadTeams() {
      this.$axios
        .get("/api/team")
        .then(res => {
          if (res.data && res.data.success) {
            console.log("Found teams");
            this.teams = res.data.teams;
          } else {
            this.teams = [];
          }
        })
        .catch(err => {
          if (err) {
            console.log(err);
          }
          this.teams = [];
        });
    },
    getCars() {
      this.$axios
        .get(`/api/event/all/cars`)
        .then(res => {
          if (res.data && res.data.success) {
            console.log("Found cars");
            this.cars = res.data.cars;
          } else {
            this.cars = [];
          }
        })
        .catch(err => {
          if (err) {
            console.log(err);
          }
          this.cars = [];
        });
    }
  },
  mounted() {
    this.loadEvents();
    this.loadTeams();
    this.getCars();
  }
};
</script>

<style lang="scss">
</style>
