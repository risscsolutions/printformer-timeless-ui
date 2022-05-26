<template>
    <div style="display: none" id="color-picker" class="columns is-flex-direction-column">
        <div class="column is-flex-grow-0">
            <div class="tabs is-centered">
                <ul id="color-space-tabs">
                    <li v-if="colorSpaces.includes('PANTONE')">
                        <a @click="setActiveContent('PANTONE', $event)">PANTONE</a>
                    </li>
                    <li v-if="colorSpaces.includes('HKS')">
                        <a @click="setActiveContent('HKS', $event)">HKS</a>
                    </li>
                    <li v-if="colorSpaces.some(s => ['CMYK', 'RGB'].includes(s))">
                        <a @click="setActiveContent('CMYK', $event)">RGB/CMYK</a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="column">
            <div class="columns">
                <div v-show="currentColorSpace ==='PANTONE'" class="column">
                    <div class="is-12">
                        <label for="pantone-color-select">PANTONE Code eingeben...</label>
                        <input id="pantone-color-select">
                    </div>
                    <div id="pantone-user-color-preview" class="user-color-preview"></div>
                </div>
                <div v-show="currentColorSpace ==='HKS'" class="column">
                    <div class="is-12">
                        <label for="hks-color-select">HKS Code eingeben...</label>
                        <input id="hks-color-select">
                    </div>
                    <div id="hks-user-color-preview" class="user-color-preview"></div>
                </div>
                <div v-show="['CMYK', 'RGB'].includes(currentColorSpace)" class="column"></div>
            </div>
        </div>
    </div>

</template>

<script>
import {mapState} from "vuex";

export default {
    name: "color-picker",
    computed: {
        ...mapState(['colorSpaces', 'managedColors']),
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
                height: 250,
                width: 384,
                modal: true,
            });
    },
    data() {
        return {
            currentColorSpace: undefined,
            currentValueForColorSpace: {},
            initializedPickers: {
                'PANTONE': false,
                'HKS': false,
                'CMYK/RGB': false,
            }
        }
    },
    methods: {
        setActiveContent(colorSpace, $event) {
            const tabs = document.querySelector('#color-space-tabs').children;
            for (let tab of tabs) {
                tab.classList.remove('is-active');
            }

            this.currentColorSpace = colorSpace;
            $event.target.parentElement.classList.add('is-active');
        },
        setColorByColorSpace(color) {

            this.currentValueForColorSpace[color.colorSpace] = color;
            $('#color-picker').dialog("close");
        },
        addPantoneColorPicker() {
            if (this.initializedPickers['PANTONE']) return;
            if (!this.colorSpaces.includes('PANTONE')) return;

            const selectPANTONEColor = (event, ui) => {
                const pantoneColor = ui.item.value
                if (!pantoneColor) return;

                document.querySelector('#pantone-user-color-preview').style.backgroundColor = pantoneColor.displayColor;
                this.setColorByColorSpace(pantoneColor);
            };
            $('#pantone-color-select').autocomplete({
                source: (query, callback) => {
                    this.$editor
                        .getColorService()
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
        }
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
