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
    
    this.getCardById = function(cardId)
    {
        for(card in this.cards)
        {
            if (this.cards[card].getId() == cardId)
            {
                console.log(this.cards[card].getId());
                return this.cards[card];
                
            }
        }
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
    
    this.onClick = function() {}
    
    this.drawOnClick = function ()
    {
        var cardElement = document.getElementById(this.getId());
        cardElement.addEventListener("click", this.onClick);        
    }
    
    this.setOnClick  = function(gameObject)
    {
         
        this.onClick = gameObject.handCardClickEvent;
    }
    
    this.getId = function()
    {
        return this.getRank() + this.suit;
    }
    
    this.getSuit = function() 
    {
        return this.suit;
    }
    
    this.getName = function()
    {
        return this.getRank(false) + " of " + this.getSuit();
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
    
    this.handCardClickEvent = function(event) 
    { 
        console.log(event.srcElement.id + " Clicked"); // Default click event
    }
    
    this.drawCard = function(parentElement, card)
    {
        var cardContainer = document.createElement("span");
        
        cardContainer.className = "card " + card.getSuit().toLowerCase();
        cardContainer.id = card.getId();
        cardContainer.innerText = card.getRank();
        parentElement.appendChild(cardContainer);
        //card.setOnClick(this.handCardClickEvent);
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
        this.screen.appendChild(textContainer);
        this.screen.scrollTop = this.screen.scrollHeight;
    }
    
    // Control Methods
    
    this.pickCard = function(player, draw)
    {
        if (player.hand.length < this.handLimit)
        {
            drawnCard = this.d.getTopCard()
            player.hand.push(drawnCard);
            if(draw)
                this.drawHand(player);
            //this.print(player.name + " got the " + drawnCard.getRank(false) + " of " + drawnCard.suit + ".");
        }
        else
        { 
            this.handContainer.style.borderColor = "red";
            timer = window.setTimeout(function() { document.getElementById("playerHand").style.borderColor = "black"; }, 1000);
            this.print(player.name + "'s hand is full.");
        }
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
    this.getCardById = function(cardId)
    {
        for(card in this.hand)
        {
            if (this.hand[card].getId() == cardId)
            {
                return this.hand[card];   
            }
        }
    }
}

function GoFish(gameCanvas)
{
        this.player = new Player(prompt("What's your name?"));
        this.playerCardPairs = [];
        this.computer = new Player("Computer");
        this.computerCardPairs = [];
        this.game = new GameBoard();
        this.game.init(gameCanvas);
    
        this.cardPairContainer = document.createElement("div");
        this.cardPairContainer.className = "cardPairs";
        this.game.canvas.appendChild(this.cardPairContainer);
        
        this.currentPlayer = this.player.name;
        
        this.handCardClickEvent = function(event)
        {
            var card = game.player.getCardById(event.srcElement.id);
            //alert(this.player.getCardById(event.srcElement.id));
            game.playerChooseCard(card);
        }      
        
        for(i = 0; i < this.game.handLimit; i++)
        {
            this.game.pickCard(this.player, true);
            this.game.pickCard(this.computer, false);
        }


    this.startGame = function()
    {
        var playing = true;
        
        this.game.print("Welcome to Go Fish!");
        this.game.print("Please pick a card");
    }
    
    this.initOnClick = function()
    {
        for(card in this.player.hand)
        {
            this.player.hand[card].setOnClick(this);
            this.player.hand[card].drawOnClick();
        }
    }
    this.initOnClick();
    this.playerChooseCard = function(pickedCard)
    {
        //if (this.currentPlayer == this.player.name)
        //    return 0;
        
        this.game.print(this.player.name + " asks for a " + pickedCard.getRank(false));
        matchedCard = this.askForCard(this.computer, pickedCard);
        if(matchedCard == false)
        {
            this.game.print(this.computer.name + ": Go fish!");
            this.currentPlayer = this.computer.name;
            this.computerChooseCard();
        }
        else
        {
            var pair = [];
            this.game.print(this.computer.name + " gave up the " + matchedCard.getName());
            pair.push(this.computer.hand.splice(this.computer.hand.indexOf(matchedCard),1)[0]);
            this.game.drawCard(this.cardPairContainer, matchedCard);

            
            pair.push(this.player.hand.splice(this.player.hand.indexOf(pickedCard),1)[0]);
            this.playerCardPairs.push(pair);
            this.game.drawCard(this.cardPairContainer, pickedCard);
            this.game.pickCard(this.player);
            this.game.drawHand(this.player);
            this.game.pickCard(this.computer);
            this.initOnClick();
            
        }
    }
    
    this.computerChooseCard = function()
    {
        var pickedCard = this.computer.hand[Math.floor(Math.random() * this.computer.hand.length)];
        this.game.print(this.computer.name + " asks for a " + pickedCard.getRank(false));
        matchedCard = this.askForCard(this.player, pickedCard);
        if(matchedCard == false)
        {
            this.game.print(this.player.name + ": Go fish!");
            this.currentPlayer = this.player.name;
        }
        else
        {
            var pair = [];
            this.game.print(this.player.name + " gave up the " + matchedCard.getName());
            pair.push(this.player.hand.splice(this.player.hand.indexOf(matchedCard),1)[0]);
            
            pair.push(this.computer.hand.splice(this.computer.hand.indexOf(pickedCard),1)[0]);
            this.computerCardPairs.push(pair);
            this.game.pickCard(this.player);
            this.game.pickCard(this.computer);
            this.game.drawHand(this.player);
            this.computerChooseCard();
            this.initOnClick();
            this.game.print("Computer has " + this.computerCardPairs.length + " pairs");
            console.log("Computer Card Pairs: ");
            console.log(this.computerCardPairs);
        }

    }
    
    this.askForCard = function(player, cardToMatch)
    {
        console.log(cardToMatch);
        for(card in player.hand)
        {
            if (player.hand[card].getRank() == cardToMatch.getRank())
            {
                return player.hand[card];
            }
        }
        return false;
    }
}
