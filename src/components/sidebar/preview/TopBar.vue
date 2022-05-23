<template>
    <div class="columns is-mobile is-vcentered is-centered">
        <div class="column is-1 has-text-centered dark-gray-color" style="width: 105px"></div>
        <div class="column buttons has-text-right mb-0">
            <button @click="goBack" class="button no-radius is-dark dark-gray-background-color">
                <span class="icon is-small" v-html="icon('Zueueck')"></span>
                <span class="has-text-weight-light" style="text-transform:uppercase">ZURÜCK ZUM EDITOR</span>
            </button>
            <button :disabled="!confirmed" @click="gotToNext" class="button no-radius is-info ">
                <span class="icon is-small" v-html="icon('Auge')"></span>
                <span class="has-text-weight-light" style="text-transform:uppercase">WEITER ZUM WARENBKORB</span>
            </button>
        </div>
        <div class="column is-2 is-hidden-touch"></div>
    </div>
</template>
<script>
import {mapState} from "vuex";
import {EventBus} from '../../../event-bus';
import {goToStep} from "../../../helpers";
import {urlQueryObject} from "../../../helper";

export default {
    name: "top-bar",
    computed: {
        ...mapState(['previewConfig'])
    },
    mounted() {
        EventBus.$on('clicked-confirmed', this.toggleButton);
    },
    methods: {
        icon(name) {
            return this.$svg(name);
        },
        toggleButton() {
            this.confirmed = !this.confirmed;
        },
        goBack() {
            goToStep(this.previewConfig.editorSteps.previous, urlQueryObject().query.draft)
        },
        gotToNext() {
            goToStep(this.previewConfig.editorSteps.next, urlQueryObject().query.draft)
        }
    },
    data() {
        return {
            confirmed: false
        }
    }
}
</script>
