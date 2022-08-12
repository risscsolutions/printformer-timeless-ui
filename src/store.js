import Vuex from 'vuex';

export default function makeStore() {
    return new Vuex.Store({
        state: {
            editorLoaded: false,
            editorConfig: {},
            previewConfig: {},
            is3D: false,
            previewPages: [],
            notifications: [],
            fontSizes: null,
            fonts: [],
            openControlTab: null,
            showroomIsOpen: true,
            traceControlsIsOpen: false,
            managedColors: [],
            colorSpaces: [],
            currentColorSpace: undefined,
            currentValueForColorSpace: {
                'PANTONE': null,
                'HKS': null,
                'MANAGED': null,
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
            },
            colorClosure: (lel) => {
            },
            colorAssignerClosure: (lel) => {
            },
            userColors: [],
            fullScreenLoaderVisible: true,
            zoom: 0,
            variants: [],
            pageContainsAssets: false,
            pageContainsTexts: false,
            pageContainsShapes: false,
        },
        getters: {
            allowAddShapes(state) {
                return ((state.editorConfig || {}).configuration || {}).allowAddShapes;
            },
            allowAddAssets(state) {
                return ((state.editorConfig || {}).configuration || {}).allowAddAssets;
            },
            allowAddTexts(state) {
                return ((state.editorConfig || {}).configuration || {}).allowAddTexts;
            },
            hasVariants(state) {
                return state.variants.length > 0;
            }
        },
        mutations: {
            setEditorConfig(state, editorConfig) {
                state.editorConfig = editorConfig;
                state.editorLoaded = true;
                state.fullScreenLoaderVisible = false;
            },
            setPreviewConfig(state, previewConfig) {
                state.previewConfig = previewConfig;
            },
            setIs3D(state, is3D) {
                state.is3D = is3D;
            },
            setPreviewPages(state, previewPages) {
                state.previewPages = previewPages;
            },
            setFontSizes(state, fontSizes) {
                state.fontSizes = fontSizes;
            },
            setFonts(state, fonts) {
                state.fonts = fonts;
            },
            setOpenControlTab(state, tab) {
                state.openControlTab = tab;
            },
            setNotifications(state, notifications) {
                notifications.forEach(notification => {
                    if (!state.notifications.find(({id}) => id === notification.id)) {
                        state.notifications.push(notification);
                    }
                });
                state.notifications.reverse().forEach((notification, idx) => {
                    if (!notifications.find(({id}) => id === notification.id)) {
                        state.notifications.splice(idx, 1);
                    }
                })
            },
            openShowroom(state) {
                state.showroomIsOpen = true;
            },
            closeShowroom(state) {
                state.showroomIsOpen = false;
            },
            openTraceControls(state) {
                state.traceControlsIsOpen = true;
            },
            closeTraceControls(state) {
                state.traceControlsIsOpen = false;
            },
            setManagedColors(state, colors) {
                state.managedColors = colors;
            },
            setColorSpaces(state, colorSpaces) {
                state.colorSpaces = colorSpaces;
            },
            setCurrentColorSpace(state, colorSpace) {
                state.currentColorSpace = colorSpace;
            },
            setColorByColorSpace(state, color) {
                state.currentValueForColorSpace[color.colorSpace] = color;
            },
            resetColorSpaces(state) {
                state.currentValueForColorSpace = {
                    'PANTONE': null,
                    'HKS': null,
                    'MANAGED': null,
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
            },
            setColorClosure(state, closure) {
                state.colorClosure = closure;
            },
            showFullScreenLoader(state) {
                state.fullScreenLoaderVisible = true;
            },
            hideFullScreenLoader(state) {
                state.fullScreenLoaderVisible = false;
            },
            setColorAssignerClosure(state, closure) {
                state.colorAssignerClosure = closure;
            },
            setUserColors(state, userColors) {
                state.userColors = userColors;
            },
            setZoom(state, zoom) {
                state.zoom = zoom;
            },
            setVariants(state, variants) {
                state.variants = variants;
            },
            setPageContainsTexts(state, bool) {
                state.pageContainsTexts = bool;
            },
            setPageContainsAssets(state, bool) {
                state.pageContainsAssets = bool;
            },
            setPageContainsShapes(state, bool) {
                state.pageContainsShapes = bool;
            }
        }
    });
}
