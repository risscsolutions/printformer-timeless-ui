<template>
    <div>
        <div class="columns is-multiline is-centered">
            <div class="column is-24">
                <div class="box columns is-flex-direction-column is-centered is-vcentered gray-background" style="cursor: pointer" @click="addTextBlock">
                    <span>Neue Textbox</span>
                    <span class="svg-20 m-1" v-html="icon('HinzufuegenPlus')"></span>
                </div>
            </div>
            <div v-if="isTextAsset && allFontsFlat" class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div v-if="isTextAsset && allFontsFlat" class="column is-24">
                <div class="field has-addons">
                    <div class="control">
                        <button type="submit" class="button is-info">Schriftart</button>
                    </div>
                    <div class="control is-expanded">
                        <div class="select is-fullwidth">
                            <select name="fonts" @change="changeFont(currentFont)" v-model="currentFont">
                                <option v-for="font in allFontsFlat" :value="font.postscript_name">
                                    {{ font.postscript_name }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="isTextAsset && allFontSizes" class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div v-if="isTextAsset && allFontSizes" class="column is-24">
                <div class="field has-addons">
                    <div class="control">
                        <button type="submit" class="button is-info">Schriftgröße</button>
                    </div>
                    <div class="control is-expanded">
                        <div class="select is-fullwidth">
                            <select name="fontSizes" @change="changeFontSize(currentFontSize)" v-model="currentFontSize">
                                <option v-for="(fontSize, index) in allFontSizes" :key="index" :value="fontSize">
                                    {{ fontSize }} pt
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="isTextAsset" class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div v-if="isTextAsset" class="column is-24">
                <div class="columns is-vcentered is-multiline is-gapless">
                    <div class="column is-11">
                        <span>Schriftschnitt</span>
                    </div>
                    <div class="column is-5">
                        <button @click="textStyle('bold')" class="button" ref="boldButton">
                            <b>B</b>
                        </button>
                    </div>
                    <div class="column is-4">
                        <button @click="textStyle('italic')" class="button" ref="italicButton">
                            <i>I</i>
                        </button>
                    </div>
                    <div class="column is-4">
                        <button @click="textStyle('underline')" class="button" ref="underlineButton" disabled>
                            <u>u</u>
                        </button>
                    </div>
                </div>
            </div>
            <div v-if="isTextAsset" class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div v-if="isTextAsset" class="column is-24">
                <div class="columns is-multiline">
                    <div class="column is-flex is-justify-content-space-between">
                        <span>Schriftfarbe</span>
                        <input type="color" class="mobile-input-faker" v-model="currentColor" :name="'Farbe ' + currentColor + ' gewählt'">
                    </div>
                </div>
            </div>
            <div v-if="isTextAsset" class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div v-if="isTextAsset" class="column is-24">
                <div class="columns is-multiline is-vcentered is-gapless">
                    <div class="column is-12">
                        <span>Ausrichtung Text</span>
                    </div>
                    <div class="column is-3" style="cursor: pointer" @click="textAlign('justify')">
                        <span class="svg-20"  v-html="icon('Blocksatz2')"></span>
                    </div>
                    <div class="column is-3" style="cursor: pointer" @click="textAlign('left')">
                        <span class="svg-20" v-html="icon('Linksbuendig2')"></span>
                    </div>
                    <div class="column is-3" style="cursor: pointer" @click="textAlign('center')">
                        <span class="svg-20" v-html="icon('zentriert2')"></span>
                    </div>
                    <div class="column is-3" style="cursor: pointer" @click="textAlign('')">
                        <span class="svg-20" v-html="icon('rechtsbuendig2')"></span>
                    </div>
                </div>
            </div>
            <div v-if="isTextAsset" class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div v-if="isTextAsset" class="column is-24">
                <div class="columns is-multiline">
                    <div class="column is-12">
                        <span>Aufzählung</span>
                    </div>
                    <div class="column is-4" style="cursor: pointer" @click="textBulletPoints('alphabetic')">
                        <span class="svg-20" v-html="icon('AufzaehlungPunkte2')"></span>
                    </div>
                    <div class="column is-4" style="cursor: pointer" @click="textBulletPoints('bullet')">
                        <span class="svg-20" v-html="icon('AufzaehlungPunkte2')"></span>
                    </div>
                    <div class="column is-4" style="cursor: pointer" @click="textBulletPoints('number')">
                        <span class="svg-20" v-html="icon('AufzaehlungZahlen2')"></span>
                    </div>
                </div>
            </div>
            <div v-if="isTextAsset" class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div v-if="isTextAsset" class="column is-24">
                <div class="columns is-multiline">
                    <div class="column is-flex is-justify-content-space-between">
                        <span>Textbox löschen</span>
                        <span @click="deleteTextBox" style="cursor: pointer" class="svg-20" v-html="icon('Loeschen')">></span>
                    </div>
                </div>
            </div>
            <div v-if="isTextAsset" class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div v-if="isTextAsset" class="column is-24">
                <div class="columns is-multiline">
                    <div class="column">
                        <div class="field">
                            <input id="extendedEditSwitch" :checked="extendedEditSwitchOn" @click="enableExtendedEdit" class="switch is-info"
                                   name="extendedEditSwitch" type="checkbox">
                            <label for="extendedEditSwitch">Erweiterte Bearbeitung</label>
                        </div>
                    </div>
                </div>
            </div>
            <extended-edit v-if="extendedEditSwitchOn" :active-object="activeObject" :opacity="opacity"
                           :has-alignment="true" :has-background-color="true"
                           :has-layer="true" :has-opacity="true" :has-line-height="true">
            </extended-edit>
        </div>
    </div>
</template>

<script>
import CroppingImage from "../../CroppingImage";
import {BulmaAccordion} from 'vue-bulma-accordion';
import {mapMutations, mapState} from "vuex";
import convert from "color-convert";
import {Text} from "@rissc/printformer-editor-client/dist/Objects/Blocks"
import EditorObject from "@rissc/printformer-editor-client/dist/Objects";
import ExtendedEdit from "./ExtendedEdit";

export default {
    name: "texts",
    components: {CroppingImage, BulmaAccordion, ExtendedEdit},
    ...mapMutations(['setFontSizes', 'setFonts']),
    ...mapState(['fonts', 'fontSizes', 'editorConfig']),
    props: {
        activeObject: EditorObject
    },
    computed: {
        currentColor: {
            get() {
                return this.isTextAsset
                    ? this.activeObject.color.displayColor
                    : this.activeObject.fill.displayColor;
            },
            set(color) {
                const parsedColor = {
                    displayColor: color,
                    colorSpace: 'RGB',
                    values: convert.hex.rgb(color)
                }
                this.isTextAsset
                    ? this.activeObject.setFontColor(parsedColor)
                    : this.activeObject.setFillColor(parsedColor);
            }
        },
        isTextAsset() {
            return this.activeObject && Text.isText(this.activeObject);
        }
    },
    async updated() {
        if (this.activeObject) {
            if (this.activeObject.font.indexOf('Bold') !== -1) {
                let currentFontByName = await this.$editor.getFontService().getFontByPostScriptName(this.currentFont);
                if (currentFontByName.styles.length === 1 && currentFontByName.styles[0] === 'bold') {
                    // set button disabled if current font is already bold
                    this.$refs.boldButton.disabled = true;
                } else if(currentFontByName.styles.length === 1 && currentFontByName.styles[0] !== 'bold') {
                    // set button disabled if current font has no bold family member
                    this.$refs.boldButton.disabled = true;
                }
            } else {
                this.$refs.boldButton.disabled = false;
            }

            if (this.activeObject.font.indexOf('Italic') !== -1) {
                let currentFontByName = await this.$editor.getFontService().getFontByPostScriptName(this.currentFont);
                if (currentFontByName.styles.length === 1 && currentFontByName.styles[0] === 'italic') {
                    // set button disabled if current font is already italic
                    this.$refs.italicButton.disabled = true;
                } else if(currentFontByName.styles.length === 1 && currentFontByName.styles[0] !== 'italic') {
                    // set button disabled if current font has no italic family member
                    this.$refs.italicButton.disabled = true;
                }
            } else {
                this.$refs.italicButton.disabled = false;
            }

            this.currentFont = this.activeObject.font;
        }
    },
    mounted() {
        // load default texblock values
        if (this.activeObject) {
            this.currentFont = this.activeObject.font;
        }

        this.$editor.getFontService().getSizes().then((sizes) => {
            this.$store.commit('setFontSizes', sizes);

            if (sizes.length > 1) {
                this.allFontSizes = sizes;
            } else {
                this.allFontSizes = [4, 8, 10, 12, 16]
            }
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
        });
    },
    methods: {
        async addTextBlock() {
            let textBlock = await this.$editor.addTextBlock(this.allFontsFlat[0].postscript_name, 16);
            await textBlock.setContent('Test');
        },
        async changeFont(postscriptName) {
            this.currentFont = postscriptName;
            await this.activeObject.setFont(postscriptName);
        },
        async changeFontSize(fontSize) {
            this.currentFontSize = fontSize;
            await this.activeObject.setFontSize(fontSize);
        },
        async deleteTextBox() {
            await this.activeObject.delete();
        },
        async textAlign(position) {
            await this.activeObject.setFontAlign(position)
        },
        async textStyle(type) {
            // bold, italic, undeline
            let currentFontByName = await this.$editor.getFontService().getFontByPostScriptName(this.currentFont);
            const postscriptName = currentFontByName.postscript_name;

            if (type === 'bold') {
                // check if current selected font is already bold
                if (currentFontByName.styles.length === 1 && currentFontByName.styles[0] === 'bold') {
                    // enable Bold button
                    this.$refs.boldButton.disabled = false;
                } else {
                    // get Bold font by family name
                    let familyMembers = await this.$editor.getFontService().getOtherFontFamilyMembers(postscriptName);

                    const boldFamilyMembers = familyMembers.filter(familyMember =>
                        familyMember.styles.length === 1 &&
                        familyMember.styles[0] === 'bold'
                    )

                    if (boldFamilyMembers.length === 1) {
                        // enable bold font
                        await this.activeObject.setFont(boldFamilyMembers[0].postscript_name);
                        this.$refs.boldButton.disabled = false;
                    } else {
                        // disable button if no bold font in family
                        this.$refs.boldButton.disabled = true;
                    }
                }
            }

            if (type === 'italic') {
                // check if current selected font is already italic
                if (currentFontByName.styles.length === 1 && currentFontByName.styles[0] === 'italic') {
                    // enable italic button
                    this.$refs.italicButton.disabled = false;
                } else {
                    // get italic font by family name
                    let familyMembers = await this.$editor.getFontService().getOtherFontFamilyMembers(postscriptName);

                    const boldFamilyMembers = familyMembers.filter(familyMember =>
                        familyMember.styles.length === 1 &&
                        familyMember.styles[0] === 'italic'
                    )

                    if (boldFamilyMembers.length === 1) {
                        // enable italic font
                        await this.activeObject.setFont(boldFamilyMembers[0].postscript_name);
                        this.$refs.italicButton.disabled = false;
                    } else {
                        // disable button if no italic font in family
                        this.$refs.italicButton.disabled = true;
                    }
                }
            }
        },
        icon(name) {
            return this.$svg(name, 'text-and-icons-dark');
        },
        textBulletPoints(type) {
            // bullet, number, alphabetic
            this.activeObject.addBulletPoint(type)
        },
        enableExtendedEdit() {
            this.opacity = (this.activeObject.opacity * 100);
            this.extendedEditSwitchOn = !this.extendedEditSwitchOn;
        },
    },
    data() {
        return {
            allFontsFlat: null,
            allFontSizes: null,
            currentFont: null,
            currentFontSize: null,
            extendedEditSwitchOn: false,
            opacity: 0
        }
    }
}
</script>
