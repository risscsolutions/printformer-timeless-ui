import Vue from 'vue';
import Vuex from 'vuex';
import VueCropper from 'vue-cropperjs';
import EventEmitter from 'eventemitter3';
import makeStore from "./store";
import {ValidationProvider} from 'vee-validate/dist/vee-validate.full.esm';
import {configure, ValidationObserver} from 'vee-validate';
import VueAgile from "vue-agile";
import Connector from "@rissc/printformer-editor-client/dist/Connector";

import PagePreview from "./src/components/PagePreview";
import FormFields from "./src/components/FormFields";
import FormField from "./src/components/FormField";
import Variants from "./src/components/sidebar/right/Variants";
import Assets from "./src/components/sidebar/right/Assets";
import Shapes from "./src/components/sidebar/right/Shapes";
import Texts from "./src/components/sidebar/right/Texts";
import CroppingImage from "./src/components/CroppingImage";
import TopBarControls from "./src/components/TopBarControls";
import Controls from "./src/components/sidebar/right/Controls";
import Showroom from "./src/components/sidebar/left/Showroom";
import ViewSettings from "./src/components/sidebar/right/ViewSettings";
import ExtendedEdit from "./src/components/sidebar/right/ExtendedEdit";

Vue.prototype.$svg = require('./src/svg.js');
Vue.use(Vuex);
Vue.use(VueAgile);
Vue.component('form-fields', FormFields);
Vue.component('form-field', FormField);
Vue.component('variants', Variants);
Vue.component('assets', Assets);
Vue.component('texts', Texts);
Vue.component('shapes', Shapes);
Vue.component('cropping-image', CroppingImage);
Vue.component('top-bar-controls', TopBarControls);
Vue.component('controls', Controls);
Vue.component('showroom', Showroom);
Vue.component('view-settings', ViewSettings);
Vue.component('extended-edit', ExtendedEdit);

Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
Vue.component('VueCropper', VueCropper);

configure({
    classes: {
        valid: 'is-success',
        invalid: 'is-danger'
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
    editorIframe.src = window.pfURL;
    window.events = new EventEmitter();

    // mobile chrome ios fix
    if (navigator.userAgent.match('CriOS')) {
        document.body.style.height = innerHeight + 'px';
        document.body.style.position = 'relative';
    }

    const store = makeStore()

    connector.connect(editorIframe, window.events).then(editor => {
        Vue.prototype.$editor = editor;

        editor.getNotifications().onChange(notifications => store.commit('setNotifications', notifications));

        new Vue({
            store,
            render: createElement => createElement(TopBarControls)
        }).$mount("#top-bar-controls");

        new Vue({
                store,
                render: createElement => createElement(Showroom)
            }
        ).$mount("#showroom");

        new Vue({
            store,
            render: createElement => createElement(Controls)
        }).$mount("#controls");

        new Vue({
                store,
                render: createElement => createElement(PagePreview)
            }
        ).$mount("#pages");
    });
}
