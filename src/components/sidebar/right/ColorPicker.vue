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
                    <li v-if="colorSpaces.some(s => ['CMYK', 'RGB'].includes(s))"
                        :class="{'is-active': currentColorSpace === 'CMYK'}">
                        <a @click="setCurrentColorSpace('CMYK')">RGB/CMYK</a>
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
            <div v-show="['CMYK', 'RGB'].includes(currentColorSpace)" class="column">
                <input id="spectre"/>
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
        const spectre = $('#spectre').spectrum({
            flat: true,
            showInput: false,
            showButtons: false,
            change: (color) => {
                color.toHexString(); // #ff0000
            }
        })

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
        setColorByColorSpace(color) {
            this.currentValueForColorSpace[color.colorSpace] = color;
        },
        applyColor() {
            this.colorClosure(this.currentValueForColorSpace[this.currentColorSpace]);

            this.currentValueForColorSpace = {
                'PANTONE': null,
                'HKS': null,
                'CMYK/RGB': null,
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
        ...mapMutations(['setCurrentColorSpace']),
    },
    watch: {
        colorSpaces(spaces) {
            console.log(spaces)
            this.addPantoneColorPicker();
            this.addHKSColorPicker();
        }

    }
}
</script>

<style scoped>
</style>
