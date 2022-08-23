<template>
    <div id="preflight-modal" class="pt-4">
        <preflight-result-table severity="info" v-show="hasInfo"
                                :results="preflightResultInfos"
                                :title="hitTitle"></preflight-result-table>
        <preflight-result-table severity="warning" v-show="hasWarnings"
                                :results="preflightResultWarnings"
                                :title="warningTitle"></preflight-result-table>
        <preflight-result-table severity="success" v-show="hasFixups"
                                :results="preflightResultFixups"
                                :title="fixupTitle"></preflight-result-table>
        <preflight-result-table severity="danger" v-show="hasErrors"
                                :results="preflightResultErrors"
                                :title="errorTitle"></preflight-result-table>
        <div class="flex-space-around button-group-container" v-show="preflightReportFileURL">
            <button @click="downloadReportFile" class="button" style="width: 100%; margin-top: 0.25rem;">
                <span v-html="pdfSvg"></span>
                <span class="text-description has-text-weight-bold">
                    {{ $translate('PREFLIGHT_DOWNLOAD_REPORT') }}
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
                this.setPreflightResult(event);
                this.$nextTick(() => {
                    $('#preflight-modal')
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
        const dialog = $('#preflight-modal');
        dialog
            .dialog({
                title: this.$translate('PREFLIGHT_MODAL_TITLE'),
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

            hitTitle: this.$translate('PREFLIGHT_HITS_TITLE'),
            warningTitle: this.$translate('PREFLIGHT_WARNINGS_TITLE'),
            fixupTitle: this.$translate('PREFLIGHT_FIXUPS_TITLE'),
            errorTitle: this.$translate('PREFLIGHT_ERRORS_TITLE'),
        }
    },
    methods: {
        downloadReportFile: function () {
            const windowOpen = window.open();
            windowOpen.location = this.preflightReportFileURL;
        },
        ...mapMutations(['setPreflightResult'])
    },
    computed: {
        hasErrors() {
            return this.preflightResultErrors.length > 0;
        },
        hasInfo() {
            return this.preflightResultInfos.length > 0;
        },
        hasWarnings() {
            return this.preflightResultWarnings.length > 0;
        },
        hasFixups() {
            return this.preflightResultFixups.length > 0;
        },
        ...mapState([
            'preflightResultInfos',
            'preflightResultWarnings',
            'preflightResultFixups',
            'preflightResultErrors',
            'preflightStatus',
            'preflightReportFileURL',
        ])
    }
}
</script>
