import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ViewUI from 'view-design';
import axios from 'axios'
import 'view-design/dist/styles/iview.css';
import {GlobalConfig} from './utils/env.js'
//markdown在线编辑器
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import 'codemirror/lib/codemirror.css'
import '@/assets/myfonts/iconfont.js'
import '@/assets/myfonts/iconfont.js'
import $ from 'jquery'
Vue.use(mavonEditor)
Vue.use(router);
Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$ = $
Vue.prototype.loadEditorContent=function(func){
  let dirName=this.$route.query.dirPath;
  let fileName=this.$route.query.fileName;
  let vueThis=this;
  this.$axios.get(this.$globalConfig.goServer+"file/query?fileDir=" + dirName + "&fileName=" + fileName).then((response) => {
    vueThis.content = response.data.data
    func(vueThis,response.data.data)
  })
}
Vue.prototype.$axios.interceptors.request.use(
    config => {
      if (config.method == 'get') {
        config.params = {
          _t: Date.parse(new Date()) / 1000,
          ...config.params
        }
      }
      return config
    }, function (error) {
      return Promise.reject(error)
    }
)
Vue.prototype.$axios.interceptors.response.use(
    function (response) {
        const status = response.status
        if (status === 200) {
            if(response.data.code==1){
                Vue.prototype.$Message.error(response.data.data)
                return Promise.reject(response.data.data);
            }
        }
        return response;
    }
)


Vue.prototype.$globalConfig= GlobalConfig

router.beforeEach((to, from, next)=>{
  if(!to.meta.title){
    document.title="文档管理系统"
  }
  next()
})
Vue.use(ViewUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')