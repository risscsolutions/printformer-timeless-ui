<template>
    <div>
        <div class="columns is-multiline is-centered">
            <div class="column is-24">
                <div class="box">
                    Neue Textbox
                </div>
            </div>
            <div class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div class="column is-24">
                <div class="field has-addons">
                    <div class="control">
                        <button type="submit" class="button is-info">Schriftart</button>
                    </div>
                    <div class="control is-expanded">
                        <div class="select is-fullwidth">
                            <select name="fonts">
                                <option value="Calibri">Calibri</option>
                                <option value="Arial">Arial</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div class="column is-24">
                <div class="field has-addons">
                    <div class="control">
                        <button type="submit" class="button is-info">Schriftgröße</button>
                    </div>
                    <div class="control is-expanded">
                        <div class="select is-fullwidth">
                            <select name="fonts">
                                <option value="12">12</option>
                                <option value="13">13</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div class="column is-24">
                <div class="columns is-multiline">
                    <div class="column"><b>Schriftschnitt</b></div>
                    <div class="column"><b>B</b></div>
                    <div class="column"><i>I</i></div>
                    <div class="column"><u>U</u></div>
                </div>
            </div>
            <div class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div class="column is-24">
                <div class="columns is-multiline">
                    <div class="column"><b>Schriftfarbe</b></div>
                </div>
            </div>
            <div class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div class="column is-24">
                <div class="columns is-multiline">
                    <div class="column"><b>Ausrichtung Text</b></div>
                </div>
            </div>
            <div class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div class="column is-24">
                <div class="columns is-multiline">
                    <div class="column"><b>Aufzählung</b></div>
                </div>
            </div>
            <div class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div class="column is-24">
                <div class="columns is-multiline">
                    <div class="column"><b>Textbox löschen</b></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BlockTypes from "@rissc/printformer-ts-common/dist/BlockTypes";
import CroppingImage from "../../CroppingImage";
import Events from "@rissc/printformer-editor-client/dist/Events";
import {BulmaAccordion} from 'vue-bulma-accordion';

export default {
    name: "texts",
    components: {CroppingImage, BulmaAccordion},
    created() {
        this.loadPictures();
    },
    mounted() {
        window.events.on(Events.EDITOR_PAGES_PAGED, (pageInfo) => {
            this.currentPage = pageInfo.pageNumber
            this.loadPictures();
        });
    },
    methods: {
        async loadPictures() {
            this.pictures = await this.$editor.findEditorObjects({
                type: BlockTypes.TEXT
            });
        }
    },
    computed: {
        hasAssets() {
            return this.pictures.length > 0
        }
    },
    data() {
        return {
            pictures: {},
            imageUrl: '',
            currentPage: 1
        }
    }
}
</script>
