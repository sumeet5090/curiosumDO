<template>
    <b-container>
        <b-row class="justify-content-center p-0 m-0 pt-5">
            <b-col sm="12" class="text-center">
              <i :class="[icon + ' ' + 'text-'+color + ' ' + 'fa-'+size+'x']"></i>
            </b-col>
            <b-col sm="12" :class="'h3 text-center m-0 text-uppercase font-weight-bold text-'+color">
              {{heading}}
            </b-col>
            <b-col sm="12" class="text-center text-dark">
              <vue-markdown>{{message}}</vue-markdown>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import VueMarkdown from "vue-markdown";
export default {
  components: {
    "vue-markdown": VueMarkdown
  },
  name: "error-page",
  props: {
    message: {
      type: String,
      description: "Error message"
    },
    icon: {
      type: String,
      description: "Icon",
      default: "fas fa-exclamation-triangle"
    },
    color: {
      type: String,
      description: "Icon color",
      default: "warning"
    },
    size: {
      type: Number,
      description: "Icon size",
      default: 4,
    },
    heading: {
      type: String,
      description: "Header",
      default: "Error"
    }
  }
};
</script>
