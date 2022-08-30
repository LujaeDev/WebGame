import { Player } from "./player.js";
import { Computer } from "./computer.js";
import { Deck } from "./deck.js";

class GameManager {
  constructor() {
    this.player = new Player();
    this.computer = new Computer();
    this.deck = new Deck();
    this.currentTurn = this.computer;

    for (let i = 0; i < 2; ++i) {
      this.computer.cards.push(this.deck.pop("white"));
      this.computer.cards.push(this.deck.pop("black"));
    }

    for (let i = 0; i < this.computer.cards.length; ++i) {
      if (this.computer.cards[i].number === 13)
        this.computer.selectBestJockerPos(i);
    }
  }

  check(card, submit) {
    if (card.number === submit) {
      card.open = true;
    } else {
      if (this.currentTurn.LastPickedCard !== null)
        this.currentTurn.LastPickedCard.open = true;
    }
  }

  sortCards(cards) {
    cards.sort(function (a, b) {
      const diff = a.number - b.number;

      if (diff != 0) return diff;

      if (a.color === "black") return -1;
      else return 1;
    });
  }

  renderCards() {
    this.sortCards(this.player.cards);
    this.sortCards(this.computer.cards);

    const strs = ["player-cards", "computer-cards"];
    const obj = [this.player, this.computer];

    for (let i = 0; i < 2; ++i) {
      let img = document.querySelector("." + strs[i]).firstElementChild;

      if (img === null) img = document.createElement("img");

      for (let j = 0; j < obj[i].cards.length; ++j) {
        const color = obj[i].cards[j].color;
        let number = obj[i].cards[j].number;

        if (obj[i] === this.computer) number = "back";

        img.src = "../images/" + color[0] + number + ".jpg";

        img = img.nextElementSibling;
      }
    }
  }

  initGame() {
    const $deckContainer = document.querySelector(".deck");
    const $computerCards = document.querySelector(".computer-cards");
    let arrowF;

    for (let i = 0; i < 4; ++i) {
      const img = document.createElement("img");
      $computerCards.appendChild(img);
    }

    this.renderCards();

    $deckContainer.addEventListener(
      "click",
      (arrowF = (e) => {
        const targetId = e.target.id;
        const $playerCards = document.querySelector(".player-cards");

        if (e.target.nodeName === "IMG") {
          const color = targetId === "whiteRemainImg" ? "white" : "black";

          this.player.pick(color, this.deck);

          const $img = document.createElement("img");
          $playerCards.appendChild($img);
          this.renderCards();
        }

        if (this.player.cards.length === 4) {
          $deckContainer.removeEventListener("click", arrowF);
        }
      })
    );
  }

  gameStart() {}
}

const gm = new GameManager();

gm.initGame();
