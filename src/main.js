import { createApp } from 'vue'
import App from './App.vue'
import DesignPreview from './components/DesignPreview.vue'
import './styles/backgrounds.css'
import './styles/home.css'

const previewMode = new URLSearchParams(location.search).get('preview') === '1'
createApp(previewMode ? DesignPreview : App).mount('#app')
