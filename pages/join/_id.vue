<template>
  <section class="section section-hero">
    <div class="container">
      <h4 class="text-center text-curiosum">Are you sure you want to join the team?</h4>
      <div class="row justify-content-center align-items-center my-5">
        <div class="col-sm-12 col-md-8">
          <div class="text-center text-curiosum link-container">{{inviteLink}}</div>
        </div>
      </div>
      <div class="row justify-content-center">
        <base-button @click.prevent="joinTeam" type="success">Confirm</base-button>
        <base-button @click.prevent="goBack" type="danger">Cancel</base-button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    let inviteLink = "https://curiosumportal.in/join/demoL1nK"
    let params = this.$route.params, id = params.id
    if(id!=null){
      inviteLink = `https://curiosumportal.in/join/${id}`
    }
    return {
      inviteLink: inviteLink,
      confirm: false,
      joinTeamError: false
    };
  },
  methods: {
    click2copyLink() {
      let temp = document.querySelector("#invite-link");
      if (temp) {
        temp.setAttribute("type", "text");
        temp.select();
        try {
          let copied = document.execCommand("copy");
          let msg = copied
            ? "URL copied to clipboard"
            : "Couldn't copy, try doing it manually.";
          this.alertMsg = msg;
          this.showAlert = true;
        } catch (e) {
          console.log(e);
        }
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    joinTeam() {
      this.joinTeamError = "";
      let params = this.$route.params
      let id = params.id
      this.$axios
        .get(`/api/team/verify/${id}`)
        .then(res => {
            if (res.data && res.data.success) {
            this.joinTeamError = "";
            this.$router.push({name: "team"});
          } else {
            this.joinTeamError = res.data.message
              ? res.data.message
              : "Unable to join the team. Try again with a different link.";
            this.$router.push({name: "team"});
          }
        })
        .catch(err => console.log);
    }
  },
  mounted(){
  },
};
</script>

<style>
.link-container {
  border: 2px solid #4b2722;
  padding: 0.75rem 0;
  border-radius: 0.5rem;
}
</style>