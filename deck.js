/*
*
*   John Fadich
*   Code Fellows: Foundations 1
*   Created 6/11/2014
*
*   Deck of Cards
*   The purpose of this program is model a standard
*   deck of cards. The model can the used to make
*   card games.
*
*/

var setDefault = function(param, defaultValue)
{
    return (typeof param === "undefined" ? defaultValue : param);
}

function Deck()
{
    this.cards = [];
    this.allSuits = ["Hearts", "Diamonds", "Spades", "Clubs"];
    this.isInit = false;

    this.init = function(shuffled) 
    {
        shuffled = setDefault(shuffled, false);

        for (suit in this.allSuits)
        {
            for (rank = 1; rank <= 13; rank++)
            {
                this.cards.push(new Card(this.allSuits[suit], rank));
            }
        }
        this.isInit = true;
        if (shuffled)
            this.shuffle();
    }
    
    this.getTopCard = function()
    {
        return this.cards.pop();
    }
    
    this.peekTopCard = function()
    {
        return this.cards[this.cards.length -1];
    }
    
    this.shuffle = function(shuffleCount)
    {
        if (!this.isInit)
            this.init(false); // Must set to false to limtit shuffleCount

        shuffleCount = setDefault(shuffleCount,5);
        var temp, randIndex;

        for(i = 0; i < shuffleCount;i++)
        {
            for(j = 0, cardCount = this.cards.length; j < cardCount; j++)
            {
                randIndex = Math.floor(Math.random() * cardCount);
                temp = this.cards[j];
                this.cards[j] = this.cards[randIndex];
                this.cards[randIndex] = temp;
            }
        }
    }
}

function Card(suit, rank)
{
    this.suit = suit;
    this.rank = rank;
    this.color = (suit == "Hearts" || suit == "Diamonds") ? "Red" : "Black";

    this.getRank = function(shortName, numeric)
    {
        var rankReturn;
        shortName = setDefault(shortName, true);
        numeric = setDefault(numeric, false);

        if (numeric)
        {
            rankReturn = this.rank;
        }
        else
        {
            switch (this.rank)
            {
                case 1:
                    rankReturn = shortName ? "A" : "Ace";
                    break;
                case 11:
                    rankReturn = shortName ? "J" : "Jack";
                    break;
                case 12:
                    rankReturn = shortName ? "Q" : "Queen";
                    break;
                case 13:
                    rankReturn = shortName ? "K" : "King";
                    break;
                default:
                    rankReturn = this.rank;
                    break;
            }
        }
        return rankReturn;
    }
    
    this.getId = function()
    {
        return this.getRank() + this.suit;
    }
    
    this.getSuit = function() 
    {
        return this.suit;
    }
}

function GameBoard()
{

    this.handLimit = 5;

    this.init = function(canvas)
    {
        this.d = new Deck();
        this.d.init(true);
        
        this.canvas = canvas;
        this.canvas.innerHTML = ""; // reset canvas
        this.canvas.className = "canvas";

        // Create header
        this.headContainer = document.createElement("div");
        this.headContainer.className = "header";
        this.canvas.appendChild(this.headContainer);
        
        // Create element to display the players hand
        this.handContainer = document.createElement("div");
        this.handContainer.className = "playerHand";
        this.handContainer.id = "playerHand";
        this.headContainer.appendChild(this.handContainer);
        
        // Create screen
        this.screen = document.createElement("div");
        this.screen.className = "screen";
        this.headContainer.appendChild(this.screen);
        

    }

    // Display Methods
    
    this.drawCard = function(parentElement, card)
    {
        var cardContainer = document.createElement("span");
        
        cardContainer.className = "card " + card.getSuit().toLowerCase();
        cardContainer.id = card.getId();
        cardContainer.innerText = card.getRank();
        parentElement.appendChild(cardContainer);
        //parentElement.innerHTML += '<div class="card ' + card.suit.toLowerCase() + '">' + card.getRank() + '</div>';
    }
    
    this.drawDeck = function(deck) {}
    
    this.drawHand = function(player) 
    {
        hand = player.getHand();
        this.handContainer.innerHTML = ""; // Reset element to redraw
        for (card in hand)
        {
            this.drawCard(this.handContainer,hand[card]);
        }
        
    }
    
    this.print = function(printText)
    {
        var textContainer = document.createElement("p");
        textContainer.innerText = printText;
        this.screen.insertBefore(textContainer, this.screen.firstChild);
    }
    
    // Control Methods
    
    this.pickCard = function(player)
    {
        if (player.hand.length < this.handLimit)
        {
            drawnCard = this.d.getTopCard()
            player.hand.push(drawnCard);
            this.drawHand(player);
            this.print("You got the " + drawnCard.getRank(false) + " of " + drawnCard.suit + ".");
        }
        else
        { 
            this.handContainer.style.borderColor = "red";
            timer = window.setTimeout(function() { document.getElementById("playerHand").style.borderColor = "black"; }, 1000);
            this.print("Your hand is full.");
        }
    }
    
    this.setOnClick = function(onClick)
    {
        var cardElement
        
        //for (card in d.cards)
        //{
        //    cardElement = document.getElementById[d.cards.getId()];
        //    cardElement.onclick = onClick;
        //}
        
    }
}

function Player(name)
{
    this.hand = [];
    this.name = name;
    
    this.getHand = function()
    {
        return this.hand;
    }
}

function GoFish()
{
    this.init() = function(gameCanvas)
    {
        this.player = new Player(prompt("What's your name?"));
        this.computer = new Player("Computer");
        this.game = new GameBoard();
        this.game.init(gameCanvas);
        
    }
    
    this.checkPairs()
    {
        
    }
}
