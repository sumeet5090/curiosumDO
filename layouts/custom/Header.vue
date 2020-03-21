<template>
  <header class="header-global">
    <base-nav class="navbar-main" effect="light" expand transparent type="info">
      <router-link class="navbar-brand mr-lg-5" slot="brand" to="/landing">
        <img alt="LOGO" src="@/assets/images/300x300.svg" />
        <!-- TODO: Logo -->
      </router-link>
      <div class="row" slot="content-header" slot-scope="{closeMenu}">
        <div class="col-6 collapse-brand">
          <router-link class="navbar-brand mr-lg-5" slot="brand" to="/landing">
            <img alt="LOGO" src="@/assets/images/300x300.svg" />
            <!-- TODO: Logo (DARK) -->
          </router-link>
        </div>
        <div class="col-6 collapse-close">
          <close-button @click="closeMenu"></close-button>
        </div>
      </div>
      <ul class="navbar-nav navbar-nav-hover align-items-lg-center">
        <base-dropdown class="nav-item" tag="li">
          <a class="nav-link" data-toggle="dropdown" href="#" role="button" slot="title">
            <i class="ni ni-collection d-lg-none"></i>
            <span class="nav-link-inner--text">Profile Name</span>
          </a>
          <router-link class="dropdown-item" to="/landing">Dashboard</router-link>
          <router-link class="dropdown-item" to="/profile">Profile</router-link>
          <router-link class="dropdown-item" to="/login">Login</router-link>
        </base-dropdown>
      </ul>
      <ul class="navbar-nav align-items-lg-center ml-lg-auto">
        <li class="nav-item">
          <a class="nav-link nav-link-icon" data-toggle="tooltip" href target="_blank" title="Like us on Facebook">
            <i class="fa fa-facebook-square"></i>
            <span class="nav-link-inner--text d-lg-none">Facebook</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link nav-link-icon" data-toggle="tooltip" href target="_blank" title="Follow us on Instagram">
            <i class="fa fa-instagram"></i>
            <span class="nav-link-inner--text d-lg-none">Instagram</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link nav-link-icon" data-toggle="tooltip" href target="_blank" title="Follow us on Twitter">
            <i class="fa fa-twitter-square"></i>
            <span class="nav-link-inner--text d-lg-none">Twitter</span>
          </a>
        </li>
        <li class="nav-item">
          <a @click.prevent="modalShowNotification" class="nav-link nav-link-icon" data-toggle="tooltip" href target="_blank" title="Notifications">
            <i class="fa fa-bell"></i>
            <span class="nav-link-inner--text d-lg-none">Notifications</span>
          </a>
        </li>
        <li class="nav-item" v-if="!this.$store.state.isAuthenticated">
          <div class="btn-wrapper text-center">
            <!-- TODO:  -->
            <base-button block class="btn btn-neutral btn-icon my-3" data-toggle="tooltip" title="Get notifications" type="default">
              <span>Sign In</span>
            </base-button>
          </div>
        </li>
        <li class="nav-item" v-else>
          <!-- TODO: Add user profile badge and show logout button under drop down. -->
        </li>
      </ul>
    </base-nav>
  </header>
</template>
<script>
import BaseNav from "@/components/BaseNav";
import BaseDropdown from "@/components/BaseDropdown";
import CloseButton from "@/components/CloseButton";
import Modal from "@/components/Modal";
import { mapState, mapMutations } from "vuex";
import axios from "axios";
export default {
  name: "headerNav",
  components: {
    BaseNav,
    CloseButton,
    BaseDropdown,
    Modal
  },
  data() {
    return {
      toggled: false
    };
  },
  mutations: {},
  computed: {
    ...mapState({
      modalState: state => state.modals
    })
  },
  methods: {
    ...mapMutations(["modalShowNotification"])
  }
};
</script>
<style>
</style>