<template>
    <div>
        <div class="columns is-multiline is-centered">
            <template v-if="allowAddShapes">
                <div class="column is-24 py-0">
                    <div class="content is-small">
                        <h4 class="dark-gray-color mb-0">Form auswählen</h4>
                    </div>
                </div>
                <div class="column is-24">
                    <hr class="divider">
                </div>
                <div class="column is-half">
                    <div @click="addShapeBlock('rect')" class="shape-rectangle"></div>
                </div>
                <div class="column is-half">
                    <div @click="addShapeBlock('circle')" class="shape-circle"></div>
                </div>
                <div class="column is-half">
                    <div @click="addShapeBlock('triangle')" class="shape-triangle"></div>
                </div>
                <div class="column is-half mt-5">
                    <!--                <div @click="addShapeBlock('polygon')" class="shape-polygon"></div>-->
                </div>
            </template>

            <div v-show="isAllowed('color')" class="column is-24 py-0">
                <div class="columns is-multiline">
                    <div class="column is-flex is-justify-content-space-between">
                        <span class="dark-gray-color">Formfarbe</span>
                        <button
                            :style="{'background-color': (activeObject || {}).fill ? activeObject.fill.displayColor : null}"
                            :class="{'chess-background': (activeObject || {}).fill === 'none'}"
                            @click="openColorPicker(activeObject.fill, $event)"
                            class="button is-rounded color-button-round m-0">
                        </button>
                    </div>
                </div>
            </div>
            <div v-show="isAllowed('color')" class="column is-24">
                <hr class="divider">
            </div>

            <div v-show="isAllowed('delete')" class="column is-24 py-0">
                <div class="columns is-multiline">
                    <div class="column is-flex is-justify-content-space-between">
                        <span class="dark-gray-color">Form löschen</span>
                        <span @click="deleteForm" style="cursor: pointer" class="svg-20"
                              v-html="icon('Loeschen')"></span>
                    </div>
                </div>
            </div>
            <div v-show="isAllowed('delete')" class="column is-24">
                <hr class="divider">
            </div>
            <div v-if="showExtendedSwitch" class="column is-24 py-0">
                <div class="columns is-multiline">
                    <div class="column is-flex is-flex-direction-column is-align-items-center">
                        <label class="has-text-weight-medium blue-color mb-2" for="extendedEditSwitch">
                            Erweiterte Form-Bearbeitung
                        </label>
                        <div class="onoffswitch">
                            <input type="checkbox" :checked="extendedEditSwitchOn" @click="enableExtendedEdit"
                                   name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch" tabindex="0">
                            <label class="onoffswitch-label" for="myonoffswitch">
                                <span class="onoffswitch-inner"></span>
                                <span class="onoffswitch-switch"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <extended-edit v-if="extendedEditSwitchOn && activeObject" :active-object="activeObject"
                           :has-alignment="isAllowed('hmove') || isAllowed('vmove')"
                           :has-layer="isAllowed('zindex')"
                           :has-opacity="isAllowed('opacity')" :has-duplicate="isAllowed('duplicate')">
            </extended-edit>
            <div v-if="showExtendedSwitch" class="column is-24">
                <hr class="divider">
            </div>

        </div>
    </div>
</template>
<style scoped>
.shape-rectangle {
    width: 100px;
    height: 100px;
    background: #0e689a;
}

.shape-triangle {
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-bottom: 100px solid #0e689a;
}

.shape-circle {
    width: 100px;
    height: 100px;
    background: #0e689a;
    border-radius: 50%
}

.shape-polygon {
    width: 100px;
    height: 57.735px;
    background: #0e689a;
    position: relative;
}

.shape-polygon::before {
    content: "";
    position: absolute;
    top: -28.8675px;
    left: 0;
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-bottom: 28.8675px solid #0e689a;
}

.shape-polygon::after {
    content: "";
    position: absolute;
    bottom: -28.8675px;
    left: 0;
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-top: 28.8675px solid #0e689a;
}
</style>
<script>
import {mapGetters, mapMutations} from "vuex";
import BlockActions from "../../../BlockActions";
import EditorObject, {Shape} from "@rissc/printformer-editor-client/dist/Objects";
import ExtendedEdit from "./ExtendedEdit";

export default {
    name: "shapes",
    components: {ExtendedEdit},
    props: {
        activeObject: EditorObject
    },
    mounted() {
        const dialog = $('#delete-shape-dialog');
        dialog
            .dialog({
                classes: {
                    "ui-dialog": 'py-4 px-6',
                    "ui-dialog-titlebar": "is-hidden",
                },
                autoOpen: false,
                resizable: false,
                height: "auto",
                width: 384,
                modal: true,
                buttons: [
                    {
                        text: "LÖSCHEN",
                        class: "button no-radius is-info my-0",
                        click: () => {
                            this.$catch(this.activeObject.delete())
                                .then(() => dialog.dialog("close"));
                        }
                    },
                    {
                        text: "ABBRECHEN",
                        class: "button no-radius is-dark dark-gray-background-color my-0",
                        click: () => {
                            dialog.dialog("close");
                        }
                    }
                ]
            });
    },
    computed: {
        isShape() {
            return this.activeObject && Shape.isShape(this.activeObject);
        },
        showExtendedSwitch() {
            return (this.isAllowed(BlockActions.OPACITY)
                || this.isAllowed(BlockActions.H_MOVE)
                || this.isAllowed(BlockActions.V_MOVE)
                || this.isAllowed(BlockActions.Z_INDEX)
                || this.isAllowed(BlockActions.DUPLICATE))
        },
        ...mapGetters(['allowAddShapes']),
    },
    methods: {
        icon(name) {
            return this.$svg(name, 'text-and-icons-dark');
        },
        addShapeBlock(type) {
            this.$catch(this.$editor.addShapeBlock(type));
        },
        isAllowed(action) {
            return this.isShape && !this.activeObject.prohibitedActions.includes(action);
        },
        openColorPicker(color, event) {
            this.setCurrentColorSpace(color.colorSpace);
            this.setColorByColorSpace(color);
            this.setColorClosure((color) => this.activeObject.setFillColor(color));
            if (color.colorSpace === 'PANTONE') {
                $('#pantone-color-select').val(color.name)
                document.querySelector('#pantone-user-color-preview').style.backgroundColor = color.displayColor;
            } else if (color.colorSpace === 'HKS') {
                $('#hks-color-select').val(color.name)
                document.querySelector('#hks-user-color-preview').style.backgroundColor = color.displayColor;

            }

            $('#color-picker')
                .dialog('option', 'position', {
                    collision: "fit",
                    my: "right top+10",
                    at: "center bottom",
                    of: $(event.currentTarget)
                })
                .dialog('open');
        },
        deleteForm(e) {
            $('#delete-shape-dialog')
                .dialog('option', 'position', {my: "right center", at: "left-300 center", of: $(e.currentTarget)})
                .dialog('open');
        },
        enableExtendedEdit() {
            this.extendedEditSwitchOn = !this.extendedEditSwitchOn;
        },
        ...mapMutations(['setColorClosure', 'setCurrentColorSpace', 'setColorByColorSpace']),
    },
    data() {
        return {
            extendedEditSwitchOn: false,
        }
    }
}
</script>
