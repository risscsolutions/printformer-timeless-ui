import Vue from "vue";
import makeStore from "./store";
import Vuex from "vuex";
import TopBar from "./components/sidebar/preview/TopBar";
import Preview from "./components/sidebar/preview/Preview";
import Connector from "@rissc/printformer-editor-client/dist/Connector";

Vue.prototype.$svg = require('../src/svg.js');
Vue.use(Vuex);
Vue.component('top-bar', TopBar);

window.onload = () => {
    document.getElementById('previewFrame').src = "";
    const store = makeStore();

    const connector = new Connector();
    const editorIframe = document.getElementById('previewFrame');

    // window.events = new EventEmitter();
    // connector.connect(editorIframe, window.events).then(editor => {
    //     Vue.prototype.$editor = editor;

        new Vue({
            store,
            render: createElement => createElement(Preview)
        }).$mount("#preview");
    // });
}
