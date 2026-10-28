import { createApp, defineAsyncComponent } from 'vue'
import App from './App.vue'
import DesignPreview from './components/DesignPreview.vue'
import './styles/backgrounds.css'
import './styles/home.css'

const searchParams = new URLSearchParams(location.search)
const page = searchParams.get('page') === 'design'
  ? defineAsyncComponent(() => import('./components/DesignPage.vue'))
  : searchParams.get('preview') === '1' ? DesignPreview : App
createApp(page).mount('#app')
