import Vuex from 'vuex';

export default function makeStore() {
    return new Vuex.Store({
        state: {
            editorConfig: {},
            is3D: false,
            previewPages: [],
            fontSizes: null,
            fonts: []
        },
        mutations: {
            setEditorConfig(state, editorConfig) {
                state.editorConfig = editorConfig;
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
            }
        }
    });
}
