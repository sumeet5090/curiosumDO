<template>
  <div>
    <!-- <div v-if="!!currentUser && isAdmin"> -->
    <div>
      <header class="header-global">
        <app-header></app-header>
      </header>
      <notification-modal/>
      <nuxt/>
      <footer class="footer pt-0">
        <app-footer></app-footer>
      </footer>
    </div>
    <!-- <div v-else>
      <div id="low-poly-background"></div>
      <section class="section section-hero">
        <div class="container align-content-center">
          <card class="py-4 px-2 border-0 bg-none my-5 noselect" no-body>
            <div class="row justify-content-center">
              <div class="col-md-12 text-center">
                <i class="fas fa-exclamation-triangle fa-6x" style="color: #ff3c00;"></i>
              </div>
              <div class="col-md-12 text-white text-center">
                <div class="display-2 font-weight-300">We are currently under maintenance.</div>
                <div class="lead">We'll get back to you as soon as possible.</div>
              </div>
            </div>
          </card>
        </div>
      </section>
    </div> -->
  </div>
</template>

<script>
// var refreshDuration = 10000;
// var refreshTimeout;
// var numPointsX;
// var numPointsY;
// var unitWidth;
// var unitHeight;
// var points;
// function randomize() {
//   for (var i = 0; i < points.length; i++) {
//     if (
//       points[i].originX != 0 &&
//       points[i].originX != unitWidth * (numPointsX - 1)
//     ) {
//       points[i].x =
//         points[i].originX + Math.random() * unitWidth - unitWidth / 2;
//     }
//     if (
//       points[i].originY != 0 &&
//       points[i].originY != unitHeight * (numPointsY - 1)
//     ) {
//       points[i].y =
//         points[i].originY + Math.random() * unitHeight - unitHeight / 2;
//     }
//   }
// }

// function refresh() {
//   randomize();
//   for (
//     var i = 0;
//     i < document.querySelector("#low-poly-background svg").childNodes.length;
//     i++
//   ) {
//     var polygon = document.querySelector("#low-poly-background svg").childNodes[
//       i
//     ];
//     var animate = polygon.childNodes[0];
//     if (animate.getAttribute("to")) {
//       animate.setAttribute("from", animate.getAttribute("to"));
//     }
//     animate.setAttribute(
//       "to",
//       points[polygon.point1].x +
//         "," +
//         points[polygon.point1].y +
//         " " +
//         points[polygon.point2].x +
//         "," +
//         points[polygon.point2].y +
//         " " +
//         points[polygon.point3].x +
//         "," +
//         points[polygon.point3].y
//     );
//     animate.beginElement();
//   }
//   refreshTimeout = setTimeout(function() {
//     refresh();
//   }, refreshDuration);
// }
// function onLoad() {
//   var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//   svg.setAttribute("width", window.outerWidth);
//   svg.setAttribute("height", window.outerHeight);
//   document.querySelector("#low-poly-background").appendChild(svg);

//   var unitSize = (window.innerWidth + window.innerHeight) / 15;
//   numPointsX = Math.ceil(window.innerWidth / unitSize) + 1;
//   numPointsY = Math.ceil(window.innerHeight / unitSize) + 1;
//   unitWidth = Math.ceil(window.innerWidth / (numPointsX - 1));
//   unitHeight = Math.ceil(window.innerHeight / (numPointsY - 1));

//   points = [];

//   for (var y = 0; y < numPointsY; y++) {
//     for (var x = 0; x < numPointsX; x++) {
//       points.push({
//         x: unitWidth * x,
//         y: unitHeight * y,
//         originX: unitWidth * x,
//         originY: unitHeight * y
//       });
//     }
//   }

//   randomize();

//   for (var i = 0; i < points.length; i++) {
//     if (
//       points[i].originX != unitWidth * (numPointsX - 1) &&
//       points[i].originY != unitHeight * (numPointsY - 1)
//     ) {
//       var topLeftX = points[i].x;
//       var topLeftY = points[i].y;
//       var topRightX = points[i + 1].x;
//       var topRightY = points[i + 1].y;
//       var bottomLeftX = points[i + numPointsX].x;
//       var bottomLeftY = points[i + numPointsX].y;
//       var bottomRightX = points[i + numPointsX + 1].x;
//       var bottomRightY = points[i + numPointsX + 1].y;

//       var rando = Math.floor(Math.random() * 2);

//       for (var n = 0; n < 2; n++) {
//         var polygon = document.createElementNS(svg.namespaceURI, "polygon");

//         if (rando == 0) {
//           if (n == 0) {
//             polygon.point1 = i;
//             polygon.point2 = i + numPointsX;
//             polygon.point3 = i + numPointsX + 1;
//             polygon.setAttribute(
//               "points",
//               topLeftX +
//                 "," +
//                 topLeftY +
//                 " " +
//                 bottomLeftX +
//                 "," +
//                 bottomLeftY +
//                 " " +
//                 bottomRightX +
//                 "," +
//                 bottomRightY
//             );
//           } else if (n == 1) {
//             polygon.point1 = i;
//             polygon.point2 = i + 1;
//             polygon.point3 = i + numPointsX + 1;
//             polygon.setAttribute(
//               "points",
//               topLeftX +
//                 "," +
//                 topLeftY +
//                 " " +
//                 topRightX +
//                 "," +
//                 topRightY +
//                 " " +
//                 bottomRightX +
//                 "," +
//                 bottomRightY
//             );
//           }
//         } else if (rando == 1) {
//           if (n == 0) {
//             polygon.point1 = i;
//             polygon.point2 = i + numPointsX;
//             polygon.point3 = i + 1;
//             polygon.setAttribute(
//               "points",
//               topLeftX +
//                 "," +
//                 topLeftY +
//                 " " +
//                 bottomLeftX +
//                 "," +
//                 bottomLeftY +
//                 " " +
//                 topRightX +
//                 "," +
//                 topRightY
//             );
//           } else if (n == 1) {
//             polygon.point1 = i + numPointsX;
//             polygon.point2 = i + 1;
//             polygon.point3 = i + numPointsX + 1;
//             polygon.setAttribute(
//               "points",
//               bottomLeftX +
//                 "," +
//                 bottomLeftY +
//                 " " +
//                 topRightX +
//                 "," +
//                 topRightY +
//                 " " +
//                 bottomRightX +
//                 "," +
//                 bottomRightY
//             );
//           }
//         }
//         polygon.setAttribute("fill", "rgba(225,225,225," + Math.random() / 3 + ")");
//         var animate = document.createElementNS(
//           "http://www.w3.org/2000/svg",
//           "animate"
//         );
//         animate.setAttribute("fill", "freeze");
//         animate.setAttribute("attributeName", "points");
//         animate.setAttribute("dur", refreshDuration + "ms");
//         animate.setAttribute("calcMode", "linear");
//         polygon.appendChild(animate);
//         svg.appendChild(polygon);
//       }
//     }
//   }
//   refresh();
// }
import appHeader from "@/layouts/AppHeader";
import appFooter from "@/layouts/AppFooter";
import notifications from "@/layouts/custom/Notifications";
import { mapGetters } from "vuex";
export default {
  components: {
    "app-header": appHeader,
    "app-footer": appFooter,
    "notification-modal": notifications
  },
  computed: {
    ...mapGetters(["currentUser", "isAdmin"])
  },
  mounted() {
    // onLoad()
  }
};
</script>

<style>
html {
  font-family: "Open Sans" sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
#low-poly-background {
  background: linear-gradient(
    145deg,
    #ff3c00 0%,
    #4b2722 30%,
    #4b2722 70%,
    #ff3c00 100%
  );
  z-index: -999;
  background-position: cover;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
}
.bg-none {
  background-color: rgba(255, 255, 255, 0) !important;
}
.noselect {
  -webkit-touch-callout: none; 
  -webkit-user-select: none; 
  -khtml-user-select: none; 
  -moz-user-select: none; 
  -ms-user-select: none; 
  user-select: none; 
}
</style>