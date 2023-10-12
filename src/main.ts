import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

import useStorage from './composables/useStorage'

const { storage, createKeyPair, createSymmetricKey } = useStorage()


// get storage if it exists
if (localStorage.getItem("storage") !== null) {
    console.log("storage exists, getting it")

    storage.value = JSON.parse(localStorage.getItem('storage') || '{}')
}else{ // else create storage
    console.log("storage doesn't exist, creating it")
    // generate new key pair
    const keyPair = createKeyPair()
    // generate symmetric key for personal use (save to cloud)
    const symmetricKey = createSymmetricKey()

    // save storage and key pair
    localStorage.setItem('storage', JSON.stringify( {
        "rooms": [],
        "personal_symmetric_key": symmetricKey,
        "personal_public_key": keyPair.publicKey,
        "personal_private_key": keyPair.privateKey,
        // Create a random username
        "username": "Anon" + Math.floor(Math.random() * 1000,).toString(),
        "contacts": [],
    }))
    storage.value = JSON.parse(localStorage.getItem('storage') || '{}')
}

// set router and mount app
const app = createApp(App)

app.use(router)

app.config.globalProperties.window = window

app.mount('#app')