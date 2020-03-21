import Vue from 'vue';
import Badge from "@/components/Badge";
import BaseAlert from "@/components/BaseAlert";
import BaseButton from "@/components/BaseButton";
import BaseCheckbox from "@/components/BaseCheckbox";
import BaseDropdown from "@/components/BaseDropdown";
import BaseInput from "@/components/BaseInput";
import BasePagination from "@/components/BasePagination";
import BaseProgress from "@/components/BaseProgress";
import BaseRadio from "@/components/BaseRadio";
import BaseSlider from "@/components/BaseSlider";
import BaseSwitch from "@/components/BaseSwitch";
import Card from "@/components/Card";
import CloseButton from "@/components/CloseButton";
import Modal from "@/components/Modal";
import Icon from "@/components/Icon";
import ErrorPage from "@/components/ErrorPage";
import Loading from "@/components/Loading";
let components = [
  Badge, BaseAlert, BaseButton, BaseCheckbox, BaseInput, BasePagination,
  BaseProgress, BaseRadio, BaseSlider, BaseSwitch, Card, CloseButton, Icon, 
  Modal, BaseDropdown, ErrorPage, Loading
]

components.forEach(comp => {
  Vue.component(comp.name, comp)
})