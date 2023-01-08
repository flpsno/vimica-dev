// navigator.serviceWorker?.register('/service-worker.js').then(reg => {
// 	reg.addEventListener('updatefound', () => {
// 		let newWorker = reg.installing
// 		newWorker?.addEventListener('statechange', () => {
// 			console.log('Update Installed. Restarting...')
// 			if (newWorker.state == 'activated') location.reload(true)
// 		})
// 	})
// })


// *** PWA Functionality START ***

// skipWaiting() functions
function promptUserToRefresh(registration) {
	// this is just an example - don't use window.confirm in real life; it's terrible
	if (window.confirm("New version available! Refresh?")) {
	  registration.waiting.postMessage('skipWaiting')
	}
  }
function listenForWaitingServiceWorker(registration) {
console.log('listenForWaitingServiceWorker', registration)
function awaitStateChange() {
	registration.installing.addEventListener('statechange', function() {
	if (this.state === 'installed') promptUserToRefresh(registration)
	})
}
if (!registration) return
if (registration.waiting) return promptUserToRefresh(registration)
if (registration.installing) awaitStateChange()
registration.addEventListener('updatefound', awaitStateChange)
}
//**

const enableServiceWorker = true
const serviceWorkerAvailable = ('serviceWorker' in navigator) ? true : false
// Register service worker
if (enableServiceWorker && serviceWorkerAvailable) {
navigator.serviceWorker.register('/service-worker.js')
.then( (registration) => {
	console.log('Service worker registered', registration)
	listenForWaitingServiceWorker(registration) // ** skipWaiting() code
})
}else{
console.log('Service worker disabled - process.env.NODE_ENV', process.env.NODE_ENV)
}

// Install prompt event handler
export let deferredPrompt
window.addEventListener('beforeinstallprompt', (event) => {
// Prevent Chrome 76 and later from showing the mini-infobar
event.preventDefault()
deferredPrompt = event // Stash the event so it can be triggered later.
try{
	showInstallPromotion()
}catch(e){
	console.error('showInstallPromotion()', e)
}
})
window.addEventListener('appinstalled', (event) => {
console.log('a2hs installed')
})
// *** PWA Functionality END *