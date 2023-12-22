import Vue from 'vue';
import VueHtmlToPaper from 'vue-html-to-paper';

const options = {
  name: '_blank',
  specs: ['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes'],
  styles: [window.app.url + '/css/app.css'],
  timeout: 1000, // default timeout before the print window appears
  autoClose: true, // if false, the window will not close after printing
  windowTitle: window.document.title, // override the window title
};

Vue.use(VueHtmlToPaper, options);

// or, using the defaults with no stylesheet
Vue.use(VueHtmlToPaper);
