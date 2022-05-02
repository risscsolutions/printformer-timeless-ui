import {parseSearchPath} from "./helper";
import Connector from "@rissc/printformer-editor-client/dist/Connector";
import EventEmitter from "eventemitter3";
import Events from "@rissc/printformer-editor-client/dist/Events";

window.onload = () => {
    const connector = new Connector();
    const previewIframe = document.getElementById('preview');

    let url = new URL(location.href);
    let query = parseSearchPath(url);

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
    window.events.on(Events.PREVIEW_LOADED, (event) => {
        const {
            confirm,
            draftValidator,
            confirmationMessage,
            showLogoInToolbar,
            pdfUrl,
            confirmPreview,
            confirmText,
            downloadUrl,
            editorSteps
        } = event;
    })
    connector.preview(previewIframe, window.events).then(preview => {

    });
}
