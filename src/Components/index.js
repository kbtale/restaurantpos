/* eslint-disable vue/multi-word-component-names */
import Vue from 'vue';
import Loading from '@/Components/loading-page';
import InputSwitch from '@/Components/input-switch';
import ImageInput from '@/Components/image-input';
import InputSelect from '@/Components/input-select';
import InputWysiwyg from '@/Components/input-wysiwyg';
import InputColor from '@/Components/input-color';
import NoContent from '@/Components/no-content';

import Attachment from '@/Components/attachment';
import Attachments from '@/Components/attachments';
import LanguageToggler from '@/Components/locale-switcher';

Vue.component('attachment', Attachment);
Vue.component('attachments', Attachments);

Vue.component('loading-page', Loading);
Vue.component('input-switch', InputSwitch);
Vue.component('image-input', ImageInput);
Vue.component('input-select', InputSelect);
Vue.component('input-wysiwyg', InputWysiwyg);
Vue.component('input-color', InputColor);
Vue.component('no-content', NoContent);
Vue.component('language-toggler', LanguageToggler);
