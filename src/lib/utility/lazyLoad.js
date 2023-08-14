// See how the options work here: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
let options = {
    root: null,
    rootMargin: "0px",
    threshold: 0
}

export const lazyLoad = (image, src) => {
    const loaded = () => {
        image.classList.add('visible')
    }
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            image.src = src                                     // replace placeholder src with the image src on observe
            if (image.complete) {                               // check if instantly loaded
                loaded()        
            } else {
                image.addEventListener('load', loaded)  
            }
        }
    }, options)
    observer.observe(image)                                     // intersection observer

    return {
        destroy() {
            image.removeEventListener('load', loaded)           // clean up the event listener
        }
    }
}