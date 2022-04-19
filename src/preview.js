import axios from 'axios';
import {parseSearchPath} from "./helper";

window.onload = () => {
  const query = parseSearchPath();

  let url;
  if (query.draft) {
    url = query.api_token
      ? `${window.location.origin}/api-editor/draft/${query['draft']}/preview?api_token=${query['api_token']}`
      : `${window.location.origin}/api-editor/draft/${query['draft']}/preview`;
  } else {
    url = '__REPLACE_ME_WITH_PFURL__'
      .replace('/editor/', '/api-editor/draft/')
      .replace('/embed', '/preview');
  }

  axios.get(url).then((response) => {
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
      } = response.data;
      console.warn(
        confirm,
        draftValidator,
        confirmationMessage,
        showLogoInToolbar,
        pdfUrl,
        confirmPreview,
        confirmText,
        downloadUrl,
        editorSteps
      );
      document.getElementById('preview').src = pdfUrl;

      const query = parseSearchPath();
      let action = `/editor/${query['draft']}/${editorSteps.next}`;
      if (query['api_token']) {
        action += '?' + encodeURIComponent('api_token') + '=' + query['api_token'];
      }

      const form = document.createElement('form');
      form.method = editorSteps.next.method;
      form.action = action;
      form.target = "_" + editorSteps.next.target;

      document.body.appendChild(form);

      form.submit();
    }
  );
}
