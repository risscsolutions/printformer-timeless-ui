<template>
    <div>
        <div class="columns is-multiline is-centered">
            <div class="column is-24" v-if="allowAddTexts">
                <div class="box columns is-flex-direction-column is-centered is-vcentered gray-background p-2"
                     style="cursor: pointer" :class="{'no-interaction': activeObject}" @click="addTextBlock">
                    <span :style="{'opacity': activeObject ? '50%' : '100%'}"
                          class="dark-gray-color">Neue Textbox</span>
                    <span :style="{'opacity': activeObject ? '50%' : '100%'}" class="svg-20 m-1"
                          v-html="icon('HinzufuegenPlus')"></span>
                </div>
            </div>
            <div v-show="allowAddTexts" class="column is-24">
                <hr class="divider">
            </div>
            <div v-show="(isAllowed('font-family') || isAllowed('font-style')) && allFontsFlat" class="column is-24 py-0">
                <div class="columns is-multiline">
                    <div class="column is-flex is-justify-content-space-between">
                        <span class="dark-gray-color">Schriftart</span>
                        <select name="fonts" id="font-family">
                            <option v-for="font in allFontsFlat" :value="font.postscript_name">
                                {{ font.postscript_name }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <div v-show="(isAllowed('font-family') || isAllowed('font-style')) && allFontsFlat" class="column is-24">
                <hr class="divider">
            </div>
            <div v-show="isAllowed('font-size') && allFontSizes" class="column is-24 py-0">
                <div class="columns is-multiline">
                    <div class="column is-flex is-justify-content-space-between">
                        <span class="dark-gray-color">Schriftgröße</span>
                        <select class="width-140" name="fontSizes" id="font-size">
                            <option v-for="fontSize in allFontSizes" :value="fontSize">
                                {{ fontSize }} pt
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <div v-show="isAllowed('font-size') && allFontSizes" class="column is-24">
                <hr class="divider">
            </div>
            <div v-show="isAllowed('font-style')" class="column is-24 py-0">
                <div class="columns is-vcentered is-multiline is-gapless">
                    <div class="column is-15">
                        <span class="dark-gray-color">Schriftschnitt</span>
                    </div>
                    <div class="column is-3">
                        <button @click="textStyle" value="bold" id="bold-button" title=""
                                class="button is-small" :disabled="boldDisabled">
                            <b class="no-interaction">B</b>
                        </button>
                    </div>
                    <div class="column is-3">
                        <button @click="textStyle" value="italic" id="italic-button" title=""
                                class="button is-small" :disabled="italicDisabled">
                            <i class="no-interaction">I</i>
                        </button>
                    </div>
                </div>
            </div>
            <div v-show="isAllowed('font-style')" class="column is-24">
                <hr class="divider">
            </div>
            <div v-show="isAllowed('color')" class="column is-24 py-0">
                <div class="columns is-multiline">
                    <div class="column is-flex is-justify-content-space-between">
                        <span class="dark-gray-color">Schriftfarbe</span>
                        <input type="color" class="mobile-input-faker" v-model="currentColor"
                               :name="'Farbe ' + currentColor + ' gewählt'">
                    </div>
                </div>
            </div>
            <div v-show="isAllowed('color')" class="column is-24">
                <hr class="divider">
            </div>
            <div v-show="isAllowed('halign')" class="column is-24 py-0">
                <div class="columns is-multiline is-vcentered is-gapless">
                    <div class="column is-12">
                        <span class="dark-gray-color">Ausrichtung Text</span>
                    </div>
                    <div class="column is-3" style="cursor: pointer" @click="textAlign('justify')">
                        <span class="svg-20" title="Blocksatz" v-html="icon('Blocksatz')"></span>
                    </div>
                    <div class="column is-3" style="cursor: pointer" @click="textAlign('left')">
                        <span class="svg-20" title="Linksbuendig" v-html="icon('Linksbuendig')"></span>
                    </div>
                    <div class="column is-3" style="cursor: pointer" @click="textAlign('center')">
                        <span class="svg-20" title="zentriert" v-html="icon('zentriert')"></span>
                    </div>
                    <div class="column is-3" style="cursor: pointer" @click="textAlign('right')">
                        <span class="svg-20" title="rechtsbuendig" v-html="icon('rechtsbuendig')"></span>
                    </div>
                </div>
            </div>
            <div v-show="isAllowed('halign')" class="column is-24">
                <hr class="divider">
            </div>
            <div v-show="isAllowed('list')" class="column is-24 py-0">
                <div class="columns is-multiline">
                    <div class="column is-12">
                        <span class="dark-gray-color">Aufzählung</span>
                    </div>
                    <div class="column is-4" style="cursor: pointer" @click="textBulletPoints('alphabetic')">
                        <span class="svg-20" title="AufzaehlungPunkte" v-html="icon('AufzaehlungPunkte')"></span>
                    </div>
                    <div class="column is-4" style="cursor: pointer" @click="textBulletPoints('bullet')">
                        <span class="svg-20" title="AufzaehlungEcken" v-html="icon('AufzaehlungEcken')"></span>
                    </div>
                    <div class="column is-4" style="cursor: pointer" @click="textBulletPoints('number')">
                        <span class="svg-20" title="AufzaehlungZahlen" v-html="icon('AufzaehlungZahlen')"></span>
                    </div>
                </div>
            </div>
            <div v-show="isAllowed('list')" class="column is-24">
                <hr class="divider">
            </div>
            <div v-show="isAllowed('delete')" class="column is-24 py-0">
                <div class="columns is-multiline">
                    <div class="column is-flex is-justify-content-space-between">
                        <span class="dark-gray-color">Textbox löschen</span>
                        <span @click="deleteTextBox" style="cursor: pointer" class="svg-20"
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
                            Erweiterte Text-Bearbeitung
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
                           :has-line-height="isAllowed('fontsize')"
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

<script>
import {BulmaAccordion} from 'vue-bulma-accordion';
import {mapGetters, mapMutations, mapState} from "vuex";
import convert from "color-convert";
import {Text} from "@rissc/printformer-editor-client/dist/Objects/Blocks"
import EditorObject from "@rissc/printformer-editor-client/dist/Objects";
import ExtendedEdit from "./ExtendedEdit";
import BlockActions from "../../../BlockActions";

export default {
    name: "texts",
    components: {BulmaAccordion, ExtendedEdit},
    ...mapMutations(['setFontSizes', 'setFonts']),
    ...mapState(['fonts', 'fontSizes', 'editorConfig']),
    props: {
        activeObject: EditorObject
    },
    computed: {
        currentColor: {
            get() {
                if (!this.activeObject) return '#ffffff';
                return this.isText
                    ? this.activeObject.color.displayColor
                    : this.activeObject.fill.displayColor;
            },
            set(color) {
                const parsedColor = {
                    displayColor: color,
                    colorSpace: 'RGB',
                    values: convert.hex.rgb(color)
                }
                this.isText
                    ? this.$catch(this.activeObject.setFontColor(parsedColor))
                    : this.$catch(this.activeObject.setFillColor(parsedColor));
            }
        },
        isText() {
            return this.activeObject && Text.isText(this.activeObject);
        },
        showExtendedSwitch() {
            return (this.isAllowed(BlockActions.FONT_SIZE)
                || this.isAllowed(BlockActions.OPACITY)
                || this.isAllowed(BlockActions.H_MOVE)
                || this.isAllowed(BlockActions.V_MOVE)
                || this.isAllowed(BlockActions.Z_INDEX)
                || this.isAllowed(BlockActions.DUPLICATE))
        },
        ...mapGetters(['allowAddTexts']),
    },
    updated() {
        if (this.activeObject && Text.isText(this.activeObject)) {
            this.currentFont = this.activeObject.font;
            Promise.all([this.$editor.getFontService().getFontByPostScriptName(this.currentFont),
                this.$editor.getFontService().getOtherFontFamilyMembers(this.currentFont)])
                .then(([font, family]) => {
                    this.boldDisabled = font.styles.includes('bold') || !family.some(f => f.styles.includes('bold'))
                    this.italicDisabled = font.styles.includes('italic') || !family.some(f => f.styles.includes('italic'))
                });

            $('#font-family').val(this.activeObject.font).selectmenu('refresh');
            $('#font-size').val(this.activeObject.size).selectmenu('refresh');
        }
    },
    mounted() {
        const $fontSelect = $('#font-family');
        $fontSelect.selectmenu({
            icons: {button: "broken-arrow"},
            width: 140,
            change: (event, ui) => {
                this.changeFont(ui.item.value);
            }
        });

        $fontSelect.selectmenu("menuWidget").addClass(['height-200', 'width-140'])

        const $fontSize = $('#font-size');
        $fontSize.selectmenu({
            icons: {button: "broken-arrow"},
            width: 140,
            change: (event, ui) => {
                this.changeFontSize(ui.item.value);
            }
        });

        $fontSize.selectmenu("menuWidget").addClass(['height-200', 'width-140'])

        // load default texblock values
        if (this.activeObject) {
            $fontSelect.val(this.activeObject.font);
            this.currentFont = this.activeObject.font;

            $fontSize.val(this.activeObject.size);

        }

        this.$editor.getFontService().getSizes().then((sizes) => {
            this.$store.commit('setFontSizes', sizes);

            if (sizes.length) {
                this.allFontSizes = sizes;
            } else {
                this.allFontSizes = [8, 10, 12, 14, 16, 18, 20, 28, 36, 48, 72];
            }

            this.$nextTick(() => $fontSize.selectmenu('refresh'));
        });

        this.$editor.getFontService().getFontsByFamily().then((fonts) => {
            this.$store.commit('setFonts', fonts);

            // flatten fonts by family to single list with all fonts
            let flatFonts = [];
            for (let [familyFontKey, familyFontValue] of fonts) {
                for (let i = 0; i < familyFontValue.length; i++) {
                    flatFonts.push(familyFontValue[i])
                }
            }

            this.allFontsFlat = flatFonts;
            this.$nextTick(() => $fontSelect.selectmenu('refresh'));
        });
        $(this.$el).tooltip({
            classes: {
                'ui-tooltip': 'p-1 is-size-7'
            }
        });

        $('#bold-button').tooltip({
            content: "bold",
            classes: {
                'ui-tooltip': 'p-1 is-size-7'
            }
        });

        $('#italic-button').tooltip({
            content: "italic",
            classes: {
                'ui-tooltip': 'p-1 is-size-7'
            }
        });

        const dialog = $('#delete-text-dialog');
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
    methods: {
        addTextBlock() {
            this.$catch(
                this.$editor.addTextBlock(this.allFontsFlat[0].postscript_name, 16)
                    .then(textBlock => textBlock.setContent('Hier steht ein Beispieltext :)'))
            );
        },
        changeFont(postscriptName) {
            this.currentFont = postscriptName;
            this.$catch(this.activeObject.setFont(postscriptName));
        },
        changeFontSize(fontSize) {
            this.currentFontSize = fontSize;
            this.$catch(this.activeObject.setFontSize(fontSize));
        },
        deleteTextBox(e) {
            $('#delete-text-dialog')
                .dialog('option', 'position', {my: "right center", at: "left-300 center", of: $(e.currentTarget)})
                .dialog('open');
        },
        textAlign(position) {
            this.$catch(this.activeObject.setFontAlign(position));
        },
        textStyle(event) {
            this.$editor.getFontService().getOtherFontFamilyMembers(this.currentFont)
                .then(familyMembers => {
                    const fontStyle = familyMembers.filter(member => member.styles.includes(event.target.value))
                    if (fontStyle.length < 1) return;

                    this.activeObject.setFont(fontStyle[0].postscript_name);
                });

            $(event.target).tooltip('close');
        },
        icon(name) {
            return this.$svg(name, 'text-and-icons-dark');
        },
        textBulletPoints(type) {
            // bullet, number, alphabetic
            this.$catch(this.activeObject.addBulletPoint(type));
        },
        enableExtendedEdit() {
            this.extendedEditSwitchOn = !this.extendedEditSwitchOn;
        },
        isAllowed(action) {
            return this.isText && !this.activeObject.prohibitedActions.includes(action);
        },
    },
    data() {
        return {
            allFontsFlat: null,
            allFontSizes: null,
            currentFont: null,
            currentFontSize: null,
            extendedEditSwitchOn: false,
            boldDisabled: false,
            italicDisabled: false,
        }
    }
}
</script>
