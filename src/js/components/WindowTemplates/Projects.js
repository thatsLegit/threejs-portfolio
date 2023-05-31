import WindowTemplate from './WindowTemplate';

class Projects extends WindowTemplate {
    constructor(window) {
        super(window, 'projects');
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

        this.element = document.querySelector('#projects');

        const closeButton = document.querySelector('#projects .closeButton');
        closeButton.addEventListener('click', this.window.close.bind(this.window));
    }
}

export default Projects;
