import Events from "@rissc/printformer-editor-client/dist/Events";

window.jQuery = window.$ = require('./src/vendor/jquery-ui-1.13.1.custom/external/jquery/jquery');
require('./src/vendor/jquery-ui-1.13.1.custom/jquery-ui');
require('./src/vendor/spectrum/spectrum');

import Vue from 'vue';
import Vuex from 'vuex';
import EventEmitter from 'eventemitter3';
import makeStore from "./src/store";
import {ValidationProvider} from 'vee-validate/dist/vee-validate.full.esm';
import {configure, ValidationObserver} from 'vee-validate';
import VueAgile from "vue-agile";
import Connector from "@rissc/printformer-editor-client/dist/Connector";

import PagePreview from "./src/components/PagePreview";
import Variants from "./src/components/sidebar/right/Variants";
import Assets from "./src/components/sidebar/right/Assets";
import Shapes from "./src/components/sidebar/right/Shapes";
import Texts from "./src/components/sidebar/right/Texts";
import TopBarControls from "./src/components/TopBarControls";
import Controls from "./src/components/sidebar/right/Controls";
import Showroom from "./src/components/sidebar/left/Showroom";
import ViewSettings from "./src/components/sidebar/right/ViewSettings";
import ExtendedEdit from "./src/components/sidebar/right/ExtendedEdit";
import {urlQueryObject} from "./src/helper";
import TraceControls from "./src/components/TraceControls";
import ColorPicker from "./src/components/sidebar/right/ColorPicker";
import FullScreenLoader from "./src/components/FullScreenLoader";
import ColorAssigner from "./src/components/sidebar/right/ColorAssigner";
import Preflight from "./src/components/preflight/Preflight";

Vue.prototype.$svg = require('./src/svg.js');
Vue.use(Vuex);
Vue.use(VueAgile);
Vue.component('variants', Variants);
Vue.component('assets', Assets);
Vue.component('texts', Texts);
Vue.component('shapes', Shapes);
Vue.component('top-bar-controls', TopBarControls);
Vue.component('controls', Controls);
Vue.component('showroom', Showroom);
Vue.component('view-settings', ViewSettings);
Vue.component('extended-edit', ExtendedEdit);

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

configure({
    classes: {
        valid: 'is-success', invalid: 'is-danger'
    }
});

Vue.prototype.$catch = (promise) => promise.catch(e => {
    const data = JSON.parse(e.message);
    if (!data || !data.message) return;
    console.warn(data);
    alert(data.message);
});

window.onload = () => {
    const connector = new Connector();
    const editorIframe = document.getElementById('editor-iframe');

    let query = urlQueryObject().query
    let url = urlQueryObject().url

    if (process.env.NODE_ENV === 'development') {
        if (query.api_token) {
            editorIframe.src = `${url.origin}/editor/${query.draft}/embed?api_token=${query.api_token}`;
        } else {
            editorIframe.src = `${url.origin}/editor/${query.draft}/embed`;
        }
    } else {
        if (query.api_token) {
            editorIframe.src = `/editor/${query.draft}/embed?api_token=${query.api_token}`;
        } else {
            editorIframe.src = `/editor/${query.draft}/embed`;
        }
    }
    window.events = new EventEmitter();

    window.events.on(Events.EDITOR_LOADED, async (config) => {
        document.body.style.opacity = '100%';
    });

    // mobile chrome ios fix
    if (navigator.userAgent.match('CriOS')) {
        document.body.style.height = innerHeight + 'px';
        document.body.style.position = 'relative';
    }

    const store = makeStore()

    Vue.prototype.$translate = (k, r) => k;

    new Vue({
        store, render: createElement => createElement(FullScreenLoader)
    }).$mount("#full-screen-loader");

    connector.editor(editorIframe, window.events).then(editor => {
        Vue.prototype.$editor = editor;

        editor.getNotifications().onChange(notifications => store.commit('setNotifications', notifications));
        window.events.on(Events.EDITOR_COLOR_SET_CHANGED, ({colorSet}) => {
            store.commit('setManagedColors', colorSet.colors);
            store.commit('setColorSpaces', colorSet.colorSpaces);
        });
        let isFormal = false;
        window.events.on(Events.EDITOR_LOADED, (config) => {
            editor.getFormEditor().resolveDataKey('pf-ca-Anrede').then(dkv => isFormal = dkv?.value?.text === 'Sie');
        });

        editor.getTranslations().then(i18n => {
            Vue.prototype.$translate = (key, r) => {
                if (isFormal) {
                    const formalKey = `FORMAL_${key}`;
                    const translated = i18n.translate(formalKey, r);
                    if (translated && translated !== formalKey) return translated.replace('\n', "<br>");
                }
                return i18n.translate(key, r).replace('\n', "<br>");
            }
            Vue.prototype.$translateMultiple = (keys, r) => {
                for (const key of keys) {
                    const translated = i18n.translate(key, r).replace('\n', "<br>");
                    if (translated && translated !== key) return translated;
                }
                return keys[0];
            }

            new Vue({
                store, render: createElement => createElement(Controls)
            }).$mount("#controls");

            new Vue({
                store, render: createElement => createElement(TopBarControls)
            }).$mount("#top-bar-controls");

            new Vue({
                store, render: createElement => createElement(Showroom)
            }).$mount("#showroom");

            new Vue({
                store, render: createElement => createElement(PagePreview)
            }).$mount("#pages");

            new Vue({
                store, render: createElement => createElement(TraceControls)
            }).$mount("#trace-controls");

            new Vue({
                store, render: createElement => createElement(ColorPicker)
            }).$mount("#color-picker");

            new Vue({
                store, render: createElement => createElement(ColorAssigner)
            }).$mount("#color-assigner");

            new Vue({
                store, render: createElement => createElement(Preflight)
            }).$mount("#preflight");
        });
    });
}
