<template>
    <div style="display: none" id="color-picker" class="columns is-flex-direction-column">
        <div class="column is-flex-grow-0">
            <div class="tabs is-centered">
                <ul id="color-space-tabs">
                    <li v-if="colorSpaces.includes('PANTONE')" :class="{'is-active': currentColorSpace === 'PANTONE'}">
                        <a @click="setCurrentColorSpace('PANTONE')">PANTONE</a>
                    </li>
                    <li v-if="colorSpaces.includes('HKS')" :class="{'is-active': currentColorSpace === 'HKS'}">
                        <a @click="setCurrentColorSpace('HKS')">HKS</a>
                    </li>
                    <li v-if="colorSpaces.includes('CMYK')"
                        :class="{'is-active': currentColorSpace === 'CMYK'}">
                        <a @click="setCurrentColorSpace('CMYK')">CMYK</a>
                    </li>
                    <li v-if="colorSpaces.includes('RGB')"
                        :class="{'is-active': currentColorSpace === 'RGB'}">
                        <a @click="setCurrentColorSpace('RGB')">RGB</a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="column">
            <div v-show="currentColorSpace ==='PANTONE'" class="columns p-3 mb-0">
                <div class="column">
                    <input id="pantone-color-select" style="width: 222px">
                </div>
                <div id="pantone-user-color-preview" class="column user-color-preview mr-3"></div>
            </div>
            <div v-show="currentColorSpace ==='HKS'" class="columns p-3 mb-0">
                <div class="column">
                    <input id="hks-color-select" style="width: 222px">
                </div>
                <div id="hks-user-color-preview" class="column user-color-preview mr-3"></div>
            </div>
            <div v-show="currentColorSpace ==='RGB'" class="columns p-3 mr-5">
                <div class="column">
                    <input id="spectre-rgb">
                </div>
                <div class="column">
                    <div class="columns is-justify-content-space-between">
                        <b class="mx-2">R</b>
                        <input v-model="R" @input="updateRGB" type="number" class="width-100" min="0" max="255">
                    </div>
                    <div class="columns is-justify-content-space-between">
                        <b class="mx-2">G</b>
                        <input v-model="G" @input="updateRGB" type="number" class="width-100" min="0" max="255">
                    </div>
                    <div class="columns is-justify-content-space-between">
                        <b class="mx-2">B</b>
                        <input v-model="B" @input="updateRGB" type="number" class="width-100" min="0" max="255">
                    </div>
                </div>
            </div>
            <div v-show="currentColorSpace ==='CMYK'" class="columns p-3 mr-5">
                <div class="column">
                    <input id="spectre-cmyk">
                </div>
                <div class="column">
                    <div class="columns is-justify-content-space-between">
                        <b class="mx-2">C</b>
                        <input v-model="C" @input="updateCMYK" type="number" class="width-100" min="0" max="100">
                    </div>
                    <div class="columns is-justify-content-space-between">
                        <b class="mx-2">M</b>
                        <input v-model="M" @input="updateCMYK" type="number" class="width-100" min="0" max="100">
                    </div>
                    <div class="columns is-justify-content-space-between">
                        <b class="mx-2">Y</b>
                        <input v-model="Y" @input="updateCMYK" type="number" class="width-100" min="0" max="100">
                    </div>
                    <div class="columns is-justify-content-space-between">
                        <b class="mx-2">K</b>
                        <input v-model="K" @input="updateCMYK" type="number" class="width-100" min="0" max="100">
                    </div>
                </div>
            </div>
        </div>
        <div class="has-text-centered content">
            <button class="button is-small is-info" @click="applyColor"
                    :disabled="!currentValueForColorSpace[currentColorSpace]">
                <span>ÜBERNEHMEN</span>
            </button>
        </div>
    </div>

</template>

<script>
import {mapMutations, mapState} from "vuex";

export default {
    name: "color-picker",
    computed: {
        ...mapState(['colorSpaces', 'managedColors', 'colorClosure', 'currentColorSpace']),
    },
    mounted() {
        const dialog = $('#color-picker');
        dialog
            .dialog({
                classes: {
                    "ui-dialog": 'p-0',
                    "ui-dialog-titlebar": "is-hidden",
                },
                autoOpen: false,
                resizable: false,
                height: 'auto',
                width: 384,
                modal: true,
            });
    },
    data() {
        return {
            R: 255,
            G: 0,
            B: 0,
            C: 0,
            M: 100,
            Y: 100,
            K: 0,
            currentValueForColorSpace: {
                'PANTONE': null,
                'HKS': null,
                'CMYK/RGB': null,
            },
            initializedPickers: {
                'PANTONE': false,
                'HKS': false,
                'CMYK/RGB': false,
            }
        }
    },
    methods: {
        updateRGB() {
            $('#spectre-rgb').spectrum("set", {r: this.R, g: this.G, b: this.B})
        },
        updateCMYK() {
            $('#spectre-cmyk').spectrum("set", {c: this.C, m: this.M, y: this.Y, k: this.K})
        },
        setColorByColorSpace(color) {
            this.currentValueForColorSpace[color.colorSpace] = color;
        },
        applyColor() {
            this.colorClosure(this.currentValueForColorSpace[this.currentColorSpace]);

            this.currentValueForColorSpace = {
                'PANTONE': null,
                'HKS': null,
                'CMYK': {
                    displayColor: '#ff0000',
                    values: [0, 100, 100, 0],
                    colorSpace: 'CMYK'
                },
                'RGB': {
                    displayColor: '#ff0000',
                    values: [255, 0, 0],
                    colorSpace: 'RGB'
                },
            };
            $('#pantone-color-select').val(null)
            document.querySelector('#pantone-user-color-preview').style.backgroundColor = null;
            document.querySelector('#hks-user-color-preview').style.backgroundColor = null;

            $('#hks-color-select').val(null)
            $('#color-picker').dialog("close");

        },
        addPantoneColorPicker() {
            if (this.initializedPickers['PANTONE']) return;
            if (!this.colorSpaces.includes('PANTONE')) return;

            const selectPANTONEColor = (event, ui) => {
                const pantoneColor = ui.item.value
                if (!pantoneColor) return;
                event.preventDefault();
                $('#pantone-color-select').val(ui.item.label)

                document.querySelector('#pantone-user-color-preview').style.backgroundColor = pantoneColor.displayColor;
                this.setColorByColorSpace(pantoneColor);
            };
            $('#pantone-color-select').autocomplete({
                source: (query, callback) => {
                    this.$editor
                        .getColorService()
                        // .pantone(query.term.replace('PANTONE: ', ''))
                        .pantone(query.term)
                        .then(({colors}) => {
                            console.log(colors)
                            callback(colors.map(color => {
                                return {label: color.name, value: color}
                            }));
                        })
                        .catch(error => {
                            callback();
                        });
                },
                select: selectPANTONEColor,
                minLength: 2,
            });
            this.initializedPickers['PANTONE'] = true;
        },
        addHKSColorPicker() {
            if (this.initializedPickers['HKS']) return;
            if (!this.colorSpaces.includes('HKS')) return;

            const selectHKSColor = (event, ui) => {
                const hksColor = ui.item.value
                if (!hksColor) return;
                event.preventDefault();
                $('#hks-color-select').val(ui.item.label)

                document.querySelector('#hks-user-color-preview').style.backgroundColor = hksColor.displayColor;
                this.setColorByColorSpace(hksColor);
            };
            $('#hks-color-select').autocomplete({
                source: (query, callback) => {
                    this.$editor
                        .getColorService()
                        .hks(query.term)
                        .then(({colors}) => {
                            callback(colors.map(color => {
                                return {label: color.name, value: color}
                            }));
                        })
                        .catch(error => {
                            callback();
                        });
                },
                select: selectHKSColor,
                minLength: 1,
            });
            this.initializedPickers['HKS'] = true;
        },
        addCMYKColorPicker() {
            if (this.initializedPickers['CMYK']) return;
            if (!this.colorSpaces.includes('CMYK')) return;
            const change = (color) => {
                const cmyk = color.toCMYK();
                const hex = color.toHexString();
                this.currentValueForColorSpace['CMYK'] = {
                    displayColor: hex,
                    values: [cmyk.c, cmyk.m, cmyk.y, cmyk.k],
                    colorSpace: 'CMYK'
                };
            };
            $('#spectre-cmyk').spectrum({
                flat: true,
                showInput: false,
                showButtons: false,
                move: (color) => {
                    const cmyk = color.toCMYK();
                    this.C = parseInt(cmyk.c);
                    this.M = parseInt(cmyk.m);
                    this.Y = parseInt(cmyk.y);
                    this.K = parseInt(cmyk.k);
                    change(color);
                },
                change
            });
            this.initializedPickers['CMYK'] = true;
        },
        addRGBColorPicker() {
            if (this.initializedPickers['RGB']) return;
            if (!this.colorSpaces.includes('RGB')) return;
            const change = (color) => {
                const rgb = color.toRgb();
                const hex = color.toHexString();
                this.currentValueForColorSpace['RGB'] = {
                    displayColor: hex,
                    values: [rgb.r, rgb.g, rgb.b],
                    colorSpace: 'RGB'
                };
            }
            $('#spectre-rgb').spectrum({
                flat: true,
                showInput: false,
                showButtons: false,
                move: (color) => {
                    const rgb = color.toRgb();
                    this.R = rgb.r;
                    this.G = rgb.g;
                    this.B = rgb.b;
                    change(color);
                },
                change
            })
            this.initializedPickers['RGB'] = true;
        },
        ...mapMutations(['setCurrentColorSpace']),
    },
    watch: {
        colorSpaces(spaces) {
            console.log(spaces)
            this.addPantoneColorPicker();
            this.addHKSColorPicker();
            this.addCMYKColorPicker();
            this.addRGBColorPicker();
        }

    }
}
</script>

<style scoped>
</style>
