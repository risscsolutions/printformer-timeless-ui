import Vue from "vue";
import makeStore from "./store";
import Vuex from "vuex";
import TopBar from "./components/sidebar/preview/TopBar";
import Preview from "./components/sidebar/preview/Preview";
import {urlQueryObject} from "./helper";
import Connector from "@rissc/printformer-editor-client/dist/Connector";
import EventEmitter from "eventemitter3";

Vue.prototype.$svg = require('../src/svg.js');
Vue.use(Vuex);
Vue.component('top-bar', TopBar);

window.onload = () => {
    const connector = new Connector();
    const previewIframe = document.getElementById('previewFrame');
    const store = makeStore();

    let query = urlQueryObject().query;
    let url = urlQueryObject().url;

    if (process.env.NODE_ENV === 'development') {
        url = new URL(process.env.PF_URL);
        query = {draft: process.env.PF_DRAFT, api_token: process.env.PF_TOKEN};
        if (query.api_token) {
            previewIframe.src = `${url.origin}/editor/${query.draft}/preview?api_token=${query.api_token}&embedded=true`;
        } else {
            previewIframe.src = `${url.origin}/editor/${query.draft}/preview?embedded=true`;
        }
    } else {
        if (query.api_token) {
            previewIframe.src = `/editor/${query.draft}/preview?api_token=${query.api_token}&embedded=true`;
        } else {
            previewIframe.src = `/editor/${query.draft}/preview?embedded=true`;
        }
    }

    window.events = new EventEmitter();
    connector.preview(previewIframe, window.events).then(preview => {
        new Vue({
            store,
            render: createElement => createElement(TopBar)
        }).$mount("#top-bar");

        new Vue({
            store,
            render: createElement => createElement(Preview)
        }).$mount("#preview");
    });
}
