import Vuex from 'vuex';
import axios from 'axios';
const state = {
  fields: {},
  modals: {
    notifications: false,
    messages: false,
    login: false,
    register: false
  },
  team: {},
  announcements: [],
  isAuthenticated: false,
  user: {},
  events: [],
  teams: []
}
const mutations = {
  modalShowNotification(state) {
    state.modals.notifications = !state.modals.notifications;
  },
  addAnnouncements(state, ancmt) {
    state
      .announcements
      .push(ancmt)
  },
  loadMoreAnnouncements(state, ancmt, count) {
    // TODO: add LoadMore button in notifications.
  },
  SET_USER: function (state, user) {
    if (user === {}) {
      state.user = null
      state.isAuthenticated = false
    } else {
      state.user = user
      state.isAuthenticated = true
    }
  },
  auth: function (state, auth) {
    state.isAuthenticated = auth
  },
  SET_TEAMS: function (state, teams) {
    state.teams = teams
  },
  SET_EVENTS: function (state, events) {
    state.events = events
  },
  SET_TEAM: function (state, team) {
    state.team = team
  }
}
const actions = {
  nuxtServerInit({ commit }, { req }) {
    if (req.isAuthenticated()) {
      commit('SET_USER', JSON.parse(JSON.stringify(req.user)))
      commit('auth', req.isAuthenticated())
    } else {
      commit('SET_USER', null)
      commit('auth', false)
    }
  },
  modalShowNotification({ commit }) {
    commit('modalShowNotification')
  },
  async logout({ commit }) {
    await this.$axios.post('/api/logout')
    commit('SET_USER', null)
    commit('auth', false)
  },
  async getUserTeam({ commit }, id) {
    try {
      let response = await this.$axios.get('/api/user/profile/' + id + '/team')
      if (response.data.success) {
        return response.data.team
      }
      return {}
    } catch (error) {
      return {}
    }
  },
  async setTeam({ commit }, id) {
    try {
      let res = await this.$axios.get('/api/team/' + id + '/user')
      if (res.data.success) {
        return commit('SET_TEAM', res.data.team)
      }
    } catch (error) {
      return
    }
  },
  async getEvents({ commit }) {
    try {
      let { data } = await this.$axios.get('/api/event')
      commit('SET_EVENTS', data.events)
    } catch (error) {
      console.log(error)
      commit('SET_EVENTS', [])
    }
  },
  async unsetTeams({ commit }) {
    return commit('SET_TEAMS', [])
  },
  async getTeamsForEvent({ commit }, id) {
    try {
      if (id) {
        let { data } = await this.$axios.get(`/api/event/${id}/teams`)
        console.log(data.teams);
        if (data.teams.length > 0) {

          return commit('SET_TEAMS', data.teams)

        }
        return commit('SET_TEAMS', [])
      }
      return commit('SET_TEAMS', [])
    } catch (err) {
      console.log(err)
      commit('SET_TEAMS', [])
    }
  },
  async createCar({ }, params) {
    // try {
    //   let { data } = await this.$axios.post(`/api/event/${params.event_id}/create/${String(params.team_id)}/car`, { car_number: params.car_number })
    //   if (data) {
    //     if (params.push_url) {
    //       this.$router.push({ path: params.push_url })
    //     }
    //   }
    // } catch (error) {
    //   console.log(error)
    // }
  },
  async postReq({ }, params) {
    try {
      let { data } = await this.$axios.post(params.url, params.body)
      return data
    } catch (error) {
      console.log(error)
    }
  },
  async delReq({ }, params) {
    try {
      let { data } = await this.$axios.delete(params.url)
      return data
    } catch (error) {
      console.log(error)
    }
  },
  async putReq({ }, params) {
    try {
      let { data } = await this.$axios.put(params.url, params.body)
      return data
    } catch (error) {
      console.log(error)
    }
  },
  async getReq({ }, params) {
    try {
      const { data } = await this.$axios.get(params.url)
      return data;
    } catch (error) {
      console.log(error)
    }
  }
}
const getters = {
  currentUser: function (state) {
    if (state.isAuthenticated) {
      return state.user
    }
    return null
  },
  isAdmin: function (state) {
    if (state.isAuthenticated) {
      if (state.user.role.indexOf('admin') > -1) {
        return true
      }
      if(state.user.role.indexOf('staff') > -1) {
        return true
      }
    }
    return false
  },
  getModalStates: state => state.modals,
  getImages: state => state.images,
  getAnnouncements: state => state.announcements,
  isAuthenticated: state => state.isAuthenticated,
  events: state => state.events,
  teams: state => state.teams,
  getTeam: state => state.team
}

const createStore = () => {
  return new Vuex.Store({
    state,
    mutations,
    actions,
    getters
  })
}

export default createStore
