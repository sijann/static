// Create views-count-component element
var viewsCountComponent = document.createElement('views-count-component');
viewsCountComponent.setAttribute('data-storeid', 'dev-test-sijan.myshopify.com');
viewsCountComponent.setAttribute('data-productid', '8933018206498');
viewsCountComponent.setAttribute('data-id', 'views_count_views_count_xhNY7R');
viewsCountComponent.setAttribute('data-producthandle', 'gift-card');
viewsCountComponent.setAttribute('id', 'views_count_views_count_xhNY7R');

// Create views-count div
var viewsCountDiv = document.createElement('div');
viewsCountDiv.setAttribute('class', 'views-count');

// Create SVG element
var svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
svgElement.setAttribute('fill', 'none');
svgElement.setAttribute('viewBox', '0 0 24 24');
svgElement.setAttribute('stroke-width', '1.5');
svgElement.setAttribute('stroke', 'currentColor');

// Create path elements for SVG
var path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
path1.setAttribute('stroke-linecap', 'round');
path1.setAttribute('stroke-linejoin', 'round');
path1.setAttribute('d', 'M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z');

var path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
path2.setAttribute('stroke-linecap', 'round');
path2.setAttribute('stroke-linejoin', 'round');
path2.setAttribute('d', 'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z');

// Append path elements to SVG
svgElement.appendChild(path1);
svgElement.appendChild(path2);

// Append SVG to views-count div
viewsCountDiv.appendChild(svgElement);

// Create views-count span
var viewsCountSpan = document.createElement('span');
viewsCountSpan.setAttribute('id', 'views-count-views_count_views_count_xhNY7R');

// Create views-count text node
var viewsCountText = document.createTextNode('1');
viewsCountSpan.appendChild(viewsCountText);

// Append views-count span to views-count div
viewsCountDiv.appendChild(viewsCountSpan);

// Create views span
var viewsSpan = document.createElement('span');
viewsSpan.textContent = ' views';

// Append views span to views-count div
viewsCountDiv.appendChild(viewsSpan);

// Append views-count div to views-count-component
viewsCountComponent.appendChild(viewsCountDiv);


var addInput = document.querySelector('input[name="add"]');

// If the input element is found, insert the views-count-component before it
if (addInput) {
    addInput.parentNode.insertBefore(viewsCountComponent, addInput);
}

if (!customElements.get('views-count-component')) {


    customElements.define('views-count-component', class CustomViewsCountComponent extends HTMLElement {
        constructor() {
            super();
            this.storeId = this.dataset.storeid;
            this.productId = this.dataset.productid;
            this.id = this.dataset.id;
            this.handle = this.dataset.producthandle;

            // Create a shared variable to track request status and count
            if (!CustomViewsCountComponent.requestSent) {
                CustomViewsCountComponent.requestSent = false;
                CustomViewsCountComponent.viewsCount = null;
            }

            this.requestDebounce = this.debounce(this.sendViewsCountRequest.bind(this), 100);
        }

        debounce(func, wait) {
            let timeoutId;
            return (...args) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => func(...args), wait);
            };
        }

        async sendViewsCountRequest() {
            if (!CustomViewsCountComponent.requestSent) {
                CustomViewsCountComponent.requestSent = true;

                try {
                    const response = await fetch(`https://dev-test-sijan.myshopify.com/apps/views-count-dev/product`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                        },
                        body: JSON.stringify({ storeId: this.storeId, productId: this.productId, productHandle: this.handle }),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch views count');
                    }

                    const data = await response.json();
                    CustomViewsCountComponent.viewsCount = data.count; // Update shared count
                    this.updateViewsCount(); // Update for this component
                } catch (error) {
                    console.error('Error fetching views count:', error);
                } finally {
                    CustomViewsCountComponent.requestSent = false; // Allow future requests
                }
            }
        }

        connectedCallback() {
            this.requestDebounce(); // Initiate the request
        }

        updateViewsCount() {
            // Check if count is available (fetched or null)
            if (CustomViewsCountComponent.viewsCount !== null) {
                const viewsCountElements = document.querySelectorAll('views-count') || this.querySelector('views-count');
                if (viewsCountElements && viewsCountElements[0]) {
                    viewsCountElements.forEach((element) => {
                        element.textContent = CustomViewsCountComponent.viewsCount;

                    })
                }

            } else {
                // Display loading indicator or placeholder (optional)
                console.log('Views count not yet available'); // Or display a message
            }
        }
    });
}
