<template>
    <div class="columns is-mobile is-vcentered is-centered">
        <div class="column is-1 has-text-centered dark-gray-color" style="width: 105px"></div>
        <div class="column buttons has-text-right mb-0">
            <button @click="goBack" class="button no-radius is-dark dark-gray-background-color">
                <span class="icon is-small" v-html="icon('Zueueck')"></span>
                <span class="has-text-weight-light">{{ previewConfig.cancelLabel }}</span>
            </button>
            <button :disabled="!confirmed" @click="gotToNext" class="button no-radius is-info ">
                <span class="icon is-small" v-html="icon('Auge')"></span>
                <span class="has-text-weight-light">{{ previewConfig.nextLabel }}</span>
            </button>
        </div>
        <div class="column is-2 is-hidden-touch"></div>
    </div>
</template>
<script>
import {mapState} from "vuex";
import {EventBus} from '../../../event-bus';

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
            // console.log(this.previewConfig.editorSteps.previous)
        },
        gotToNext() {
            // console.log(this.previewConfig.editorSteps.next)
        }
    },
    data() {
        return {
            confirmed: false
        }
    }
}
</script>
