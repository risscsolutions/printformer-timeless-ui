import Vuex from 'vuex';

export default function makeStore() {
    return new Vuex.Store({
        state: {
            editorConfig: {},
            previewConfig: {},
            is3D: false,
            previewPages: [],
            notifications: [],
            fontSizes: null,
            fonts: [],
            openControlTab: null,
            showroomIsOpen: true,
        },
        getters: {
            allowAddShapes(state) {
                return ((state.editorConfig || {}).configuration|| {}).allowAddShapes;
            },
            allowAddAssets(state) {
                return ((state.editorConfig || {}).configuration|| {}).allowAddAssets;
            },
            allowAddTexts(state) {
                return ((state.editorConfig || {}).configuration|| {}).allowAddTexts;
            }
        },
        mutations: {
            setEditorConfig(state, editorConfig) {
                state.editorConfig = editorConfig;
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
            }
        }
    });
}
