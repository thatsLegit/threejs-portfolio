import cancel from '../../../assets/content/cancel.png';

class WindowTemplate {
    constructor(window, parent, id) {
        this.window = window;
        this.parent = parent;
        this.id = id;
    }

    cssTemplate() {
        // some common css
        return `
            #${this.id} {
                display: none;
                overflow-y: scroll;
                overflow-x: hidden;
                height: 600px;
                width: 100%;
                box-shadow: 1px 1px 2px;
            }
        `;
    }

    htmlTemplate() {
        // some common html
        return `
            <div class="close-button">
                <img src=${cancel} alt="close" />
            </div>
        `;
    }

    enable() {
        const element = document.querySelector(`#${this.id}`);
        element.style.display = 'block';
    }

    disable() {
        const element = document.querySelector(`#${this.id}`);
        element.style.display = 'none';
    }

    generate(isClosable = true) {
        // append style
        const style = document.createElement('style');
        document.head.append(style);
        style.textContent = this.cssTemplate();

        // append html
        const html = document.createElement('div');
        html.id = this.id;
        html.className = 'template-container';
        html.innerHTML = this.htmlTemplate();
        this.window.element.insertAdjacentElement('beforeend', html);
        this.element = document.querySelector(`#${this.id}`);

        // add behavior to closeButton
        if (!isClosable) return;
        const closeButton = document.querySelector(`#${this.id} .close-button`);
        closeButton.addEventListener('click', this.window.close.bind(this.window));
    }
}

export default WindowTemplate;
