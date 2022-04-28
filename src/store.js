import Vuex from 'vuex';

export default function makeStore() {
    return new Vuex.Store({
        state: {
            editorConfig: {},
            is3D: false,
            previewPages: [],
            notifications: [],
            fontSizes: null,
            fonts: [],
            openControlTab: null,
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
            }
        }
    });
}
