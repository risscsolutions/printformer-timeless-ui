/**
 * @param url URL
 * @returns {{}}
 */
import {urlQueryObject} from "./helper";

/**
 * @param step EditorStep
 * @param draftHash string
 * @returns {string}
 */
export function buildStepURL(step, draftHash) {
    const query = urlQueryObject().query;
    let action = `/editor/${draftHash}/${step.action}`;
    if (query.api_token) {
        action += '?' + encodeURIComponent('api_token') + '=' + query.api_token;
    }
    return action;
}

/**
 * @param step EditorStep
 * @param draftHash string
 * @returns {string}
 */
export function goToStep(step, draftHash) {
    const action = buildStepURL(step, draftHash);

    if (step.method === 'POST') {
        const form = document.createElement('form');
        form.method = step.method;
        form.action = action;
        form.target = "_" + step.target;

        document.body.appendChild(form);

        form.submit();
    } else {
        window.location.assign(action);
    }
}
