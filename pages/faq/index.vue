<template>
  <section class="section section-xl">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-12 text-dark">
          <b-card :key="faq.id" no-body v-for="faq in faq_list">
            <b-card-header class="card-title" v-b-toggle="'collapse-'+faq.id">
              <span>
                <i class="collapse-icon fas fa-chevron-right"></i>
              </span>
              <span class="ml-2 font-weight-bold">{{faq.question}}</span>
            </b-card-header>
            <b-collapse :id="'collapse-'+faq.id" accordion="faq-accordion" :visible="faq.open">
              <b-card-body>
                <no-ssr tag="p">
                  <vue-markdown :linkify="false">{{faq.answer}}</vue-markdown>
                </no-ssr>
              </b-card-body>
            </b-collapse>
          </b-card>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import VueMarkdown from "vue-markdown";
export default {
  components: {
    "vue-markdown": VueMarkdown
  },
  data() {
    return {
      faq_list: [
        {
          id: 1,
          name: "FAQ #1",
          question: "How do I report a bug / issue on the website?",
          answer:
            "1. Shoot us an email at **info@curiosumtech.in**\n2. Describe the issue best you can, also try to include the screenshot of the issue.\n3. We will look into it and resolve it as soon as possible.",
          admin: false,
          captain: false,
          open: true
        },
        {
          id: 2,
          name: "FAQ #2",
          question: "Where do I check registered teams?",
          answer:
            "Here's a direct link. <a class='text-curiosum cursor-pointer font-weight-bold' href='/teams/all'>All teams</a> \nYou could also find <span><button class='btn btn-sm btn-curiosum'>All</button></span> on the <a href='/' class='text-curiosum cursor-pointer font-weight-bold'>Dashboard</a>",
          admin: false,
          captain: false
        },
        {
          id: 3,
          name: "FAQ #3",
          question: "What are the steps for joining a team?",
          answer:
            "1. Navigate to the \"Team\" page at [https://curiosumportal.in/team](https://curiosumportal.in/team)\n2. If you are not logged in, you will be redirected to login page. After logging in, navigate back to the Team page.\n3. If you are already in a team, your team profile is displayed on this page.\n4. You can join an existing team by clicking \"Join a team\" and entering the link given to you by your captain in the text input and click Join. Once completed successful, page will refresh.\n5. You can also Create a new team and invite team members to that team by clicking \"Create New Team\" and entering information about your team.<br>Note: Team name should be unique."
        },
        {
          id: 4,
          name: "FAQ #4",
          question:
            "I am the team captain, how do I update the team information or add members?",
          answer:
            "The team profile has a \"<i class=\"fas fa-pen text-curiosum font-weight-bold\"></i> \" link. That's the place to update your team information.\nStill can't find it? Just add a **'/settings'** at the end of the team url.\nIt may look like this <span class='text-curiosum'>https://curiosumportal.in/team/5bf7efca44277a3cee2eeec2<strong class='font-weight-bold'>/settings</strong></span>",
          admin: false,
          captain: false
        }
      ]
    };
  }
};
</script>

<style lang="scss">
strong {
  font-weight: bold !important;
}

.card-header.card-title {
  .collapse-icon {
    transition-duration: 200ms;
    transform: rotate(90deg);
  }

  &.collapsed {
    .collapse-icon {
      transform: rotate(0deg);
    }
  }
}
</style>