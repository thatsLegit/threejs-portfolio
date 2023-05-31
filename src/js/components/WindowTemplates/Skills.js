import WindowTemplate from './WindowTemplate';

class Skills extends WindowTemplate {
    constructor(window) {
        super(window, 'skills');
    }

    cssTemplate() {
        return ``;
    }

    htmlTemplate() {
        return ``;
    }

    enable() {
        this.element.style.display = 'block';
    }

    disable() {
        this.element.style.display = 'none';
    }

    generate() {
        // append css/html to index.html (into #cube-window)
        const style = document.createElement('style');
        document.head.append(style);
        style.textContent = this.cssTemplate();

        this.window.element.insertAdjacentElement('afterend', this.htmlTemplate());

        this.element = document.querySelector('#skills');

        const closeButton = document.querySelector('#skills .closeButton');
        closeButton.addEventListener('click', this.window.close.bind(this.window));
    }
}

export default Skills;
