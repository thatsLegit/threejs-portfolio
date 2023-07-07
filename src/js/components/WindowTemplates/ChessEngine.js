import WindowTemplate from './WindowTemplate';
import back from '../../../assets/content/back.png';
import github from '../../../assets/content/github.png';
import xBoard from '../../../assets/content/projects/ai/x-board.png';
import c from '../../../assets/content/projects/ai/c.png';
import chess from '../../../assets/content/projects/ai/chess.png';

class ChessEngine extends WindowTemplate {
    constructor(window, parent) {
        super(window, parent, 'chess-engine');

        this.githubLink = 'https://github.com/thatsLegit/c-chess-engine';
        this.xBoardLink = 'https://www.gnu.org/software/xboard/';
    }

    htmlTemplate() {
        return `
            <img class="back-button" src=${back} alt="back">

            <div class="project-links-container">
                <a
                    class="github-link"
                    href=${this.githubLink}
                    target="_blank" rel="noopener noreferrer"
                >
                    <img src=${github} alt="github">
                </a>
            </div>

            <p class="projects-title">Chess engine written in the C language</p>

            <div class="projects-container">
                <div class="template-inner-container">
                    <a href=${this.xBoardLink} target="_blank" rel="noopener noreferrer">
                        <img
                            src=${xBoard}
                            alt="xBoard" width="125" height="100"
                        >
                    </a>
                    <img
                        src=${c}
                        alt="c" width="100" height="100"
                        style="margin: auto 25px"
                    >
                    <img
                        src=${chess}
                        alt="chess" width="100" height="100"
                    >
                </div>

                <div class="project-explanation">
                    Coding this chess engine was partly just a pastime and a project to get
                    back in touch with low level programming which I always liked.<br><br>
                    Chess boards have always fascinated me even though I never played it really seriously.
                    I think it's a game that anyone can appreciate at least for the beauty of its geometry, without
                    going too deep into theory and strategy/tactics of the game.<br><br>

                    The choice of the C language came as natural as performance is everything when it comes to
                    chess engines in general and I could not afford suboptimal performance simply due to the
                    programming language.<br><br>

                    <h3 style="text-decoration: underline">Development steps:</h3>
                    <ol>
                        <li>setting up the the board structure</li>
                        <li>create initializers for initial board position and FEN reader</li>
                        <li>setting up the structure and helper functions for pawns (bit board)</li>
                        <li>create some basic printing function for debugging</li>
                        <li>defining hashing function for position key</li>
                        <li>define pieces helpers arrays (such as in data.c)</li>
                        <li>create move generations functions for each type of movement (capture/quiet move, castling, sliding/non-sliding pieces, pawns)</li>
                        <li>proceed with the creation of move making functions</li>
                        <li>testing move generation precision up to depth 6</li>
                        <li>Implementing search with principal variation arrays and alpha-beta algorithm</li>
                        <li>Implement evaluation of a position</li>
                        <li>Implement move ordering</li>
                        <li>Further optimizations and improvements on the precision of the position evaluation</li>
                        <li>Testing the engine against other engines by implementing xboard and uci protocols</li>
                        <li>Making the game playable with just a console and have fun :)</li>
                    </ol>

                    I plan to give a try to WebAssembly and compile this C program to WebAssembly
                    and run it on this website directly :D !<br><br>

                    Making this engine was certainly not easy but I have a lot of fun coding it :p.<br><br>

                    <a href=${this.githubLink} target="_blank" rel="noopener noreferrer">
                        Give it a try and see if you can beat it!
                    </a>
                </div>
            </div>
        `;
    }

    generate() {
        super.generate(false);

        const backButton = document.querySelector(`#${this.id} .back-button`);
        backButton.addEventListener('click', () => {
            this.disable();
            this.parent.enable();
        });
    }
}

export default ChessEngine;
