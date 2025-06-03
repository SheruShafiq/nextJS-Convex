
export const useServiceWorker = () => {
    if ('serviceWorker' in navigator && window?.serwist === undefined) {
      navigator.serviceWorker.register('/sw.js')
    }
}
