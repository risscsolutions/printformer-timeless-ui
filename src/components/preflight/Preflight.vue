<template>
    <div id="preflight" class="pt-4">
        <preflight-result-table severity="info" v-show="hasInfo" :results="preflight.result.hits['info']"
                                :title="hitTitle"/>
        <preflight-result-table severity="warning" v-show="hasWarnings" :results="preflight.result.hits['warning']"
                                :title="warningTitle"/>
        <preflight-result-table severity="success" v-show="hasFixups" :results="preflight.result.fixups"
                                :title="fixupTitle"/>
        <preflight-result-table severity="danger" v-show="hasErrors" :results="errorResult" :title="errorTitle"/>
        <div class="flex-space-around button-group-container" v-if="preflight.report_file_url">
            <button v-on:click="downloadReportFile"
                    class="button" style="width: 100%; margin-top: 0.25rem;">
                <span v-html="pdfSvg"></span>
                <span class="text-description has-text-weight-bold">
                    {{ $i18n.translate('Report-PDF herunterladen') }}
                </span>
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.preflight-round-corners {
    border-radius: 6px;
    margin-top: 1rem;
}
</style>

<script>
import PreflightResultTable from "./PreflightResultTable";
import Events from "@rissc/printformer-editor-client/dist/Events";
import {mapMutations, mapState} from "vuex";

export default {
    components: {PreflightResultTable},
    created() {
        this.$editor.getEvents()
            .on(Events.PREFLIGHT.PROCESSED, (event) => {
                console.debug(event);
                this.setPreflightResult(event);
                this.$nextTick(() => {
                    $('#preflight')
                        .dialog('option', 'position', {
                            collision: "fit",
                            my: "center center",
                            at: "center center",
                            of: $('#editor-iframe')
                        })
                        .dialog('open');
                });
            });
    },
    mounted() {
        const dialog = $('#preflight');
        dialog
            .dialog({
                title: this.$i18n.translate('Ergebnis der Druckdatenprüfung'),
                classes: {
                    "ui-dialog": 'p-0',
                    "ui-dialog-titlebar": 'has-background-white is-size-6 has-text-weight-normal dark-gray-color py-4 px-4'
                },
                closeText: 'X',
                autoOpen: false,
                resizable: false,
                draggable: false,
                width: '800px',
                modal: true,
            });
    },
    data() {
        return {
            pdfSvg: '',//this.$svg('pf_icon_pdf'),

            hitTitle: this.$i18n.translate('Informationen'),
            warningTitle: this.$i18n.translate('Warnungen'),
            fixupTitle: this.$i18n.translate('Korrekturen'),
            errorTitle: this.$i18n.translate('Fehler'),
        }
    },
    methods: {
        downloadReportFile: function () {
            const windowOpen = window.open();
            windowOpen.location = this.preflight.report_file_url;
        },
        ...mapMutations(['setPreflightResult'])
    },
    computed: {
        hasErrors() {
            return (this.preflight.result.errors && this.preflight.result.errors.length > 0) ||
                (this.preflight.result.hits['error'] && this.preflight.result.hits['error'].length > 0);
        },
        hasHits() {
            return this.preflight.result.hits && this.preflight.result.hits.length > 0;
        },
        hasInfo() {
            return this.preflight.result.hits['info'] && this.preflight.result.hits['info'].length > 0;
        },
        hasWarnings() {
            return this.preflight.result.hits['warning'] && this.preflight.result.hits['warning'].length > 0;
        },
        hasFixups() {
            return this.preflight.result.fixups && this.preflight.result.fixups.length > 0;
        },
        errorResult() {
            const hitErrors = this.preflight.result.hits['error'] || [];
            const preflightErrors = this.preflight.result.errors || [];
            return preflightErrors.concat(hitErrors)
        },
        ...mapState(['preflight'])
    }
}
</script>
