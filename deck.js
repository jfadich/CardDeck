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
		this.players = [];
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
	this.addElement = function(tagName, styleClass, parentElement)
	{
		var element;
		parentElement = setDefault(parentElement, this.canvas);
		element = document.createElement(tagName);
		element.className = styleClass;
		parentElement.appendChild(element);
		return element;
	}
	
    this.addPlayer = function(player)
	{
		this.players.push(player);
	}
	
    this.pickCard = function(player, pickCount)
    {
        pickCount = setDefault(pickCount, 1);
        
        for(i = 0; i < pickCount; i++)
        {
            if (player.hand.length < this.handLimit)
            {
                drawnCard = this.d.getTopCard()
                player.hand.push(drawnCard);

                //this.print(player.name + " got the " + drawnCard.getRank(false) + " of " + drawnCard.suit + ".");
            }
            else
            { 
				if(player.isNPC)
				{
					this.handContainer.style.borderColor = "red";
					timer = window.setTimeout(function() { document.getElementById("playerHand").style.borderColor = "black"; }, 1000);
					this.print(player.name + "'s hand is full.");
				}
				else
				{
					console.log(player.name + "'s hand is full.");
				}
            }
        }
		
        if(!player.isNPC)
            this.drawHand(player);
    }

}

function Player(name, isNPC)
{
    this.hand = [];
    this.name = name;
	this.isNPC = setDefault(isNPC,false);
    this.p = {}; // Extendable parameters
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

    this.startGame = function()
    {
        this.game = new GameBoard();
        this.game.init(gameCanvas);
		
		this.game.addPlayer(new Player(prompt("What's your name?"), false));
		this.game.addPlayer(new Player("Computer", true));
        this.game.players[0].p["cardPairs"] = [];
		this.game.players[1].p["cardPairs"] = [];
    
		this.playerPairStage = this.game.addElement("div", "cardPairList");
		
		this.game.print("Welcome to Go Fish!");
        this.game.pickCard(this.game.players[0], this.game.handLimit);
        this.game.pickCard(this.game.players[1], this.game.handLimit);
        this.checkHandForPairs(this.game.players[0]);
		this.checkHandForPairs(this.game.players[1]);
		this.initOnClick();
		
        this.game.print("Please pick a card");
    }
	
	this.handCardClickEvent = function(event)
        {
            var card = game.game.players[0].getCardById(event.srcElement.id);
            //alert(this.player.getCardById(event.srcElement.id));
            game.playerChooseCard(card);
        }   
		
    this.initOnClick = function()
    {
        for(card in this.game.players[0].hand)
        {
            this.game.players[0].hand[card].setOnClick(this);
            this.game.players[0].hand[card].drawOnClick();
        }
    }
	
	this.drawPairs = function()
	{
		var pairElement;
		this.playerPairStage.innerHTML = ""; // Reset for redraw
		
		for(pair in this.game.players[0].p["cardPairs"])
		{
			pairElement = this.game.addElement("div","pair", this.playerPairStage);
			this.game.drawCard(pairElement, this.game.players[0].p.cardPairs[pair][0]);
			this.game.drawCard(pairElement, this.game.players[0].p.cardPairs[pair][1]);
		}
	}
	
	this.moveCardMatch = function(winner, winnerCard, loser,loserCard)
	{
		    var pair = [];
			
            pair.push(loser.hand.splice(loser.hand.indexOf(loserCard),1)[0]);
			pair.push(winner.hand.splice(winner.hand.indexOf(winnerCard),1)[0]);
			winner.p.cardPairs.push(pair);
			
            this.game.pickCard(winner);
			this.game.pickCard(loser);
			
			this.drawPairs();
			this.game.drawHand(this.game.players[0]);
			this.initOnClick();

	}
	
    this.playerChooseCard = function(pickedCard)
    {       
        this.game.print(this.game.players[0].name + " asks for a " + pickedCard.getRank(false));
        matchedCard = this.askForCard(this.game.players[1], pickedCard);
        if(matchedCard == false)
        {
            this.game.print(this.game.players[1].name + ": Go fish!");
            this.computerChooseCard();
        }
        else
        {
			this.game.print(this.game.players[1].name + " gave up the " + matchedCard.getName());
            this.moveCardMatch(this.game.players[0],pickedCard,this.game.players[1],matchedCard);
        }
    }
    
    this.computerChooseCard = function()
    {
        var pickedCard = this.game.players[1].hand[Math.floor(Math.random() * this.game.players[1].hand.length)];
        this.game.print(this.game.players[1].name + " asks for a " + pickedCard.getRank(false));
        matchedCard = this.askForCard(this.game.players[0], pickedCard);
        if(matchedCard == false)
        {
            this.game.print(this.game.players[0].name + ": Go fish!");
        }
        else
        {
			this.game.print(this.game.players[0].name + " gave up the " + matchedCard.getName());
            this.moveCardMatch(this.game.players[1],pickedCard, this.game.players[0], matchedCard);
            this.game.print("Computer has " + this.game.players[1].p["cardPairs"].length + " pairs");
            console.log("Computer Card Pairs: ");
            console.log(this.game.players[1].p["cardPairs"]);
        }

    }
    
    this.checkHandForPairs = function(player)
    {
        var matchedCard, pairList, pair;
        pair = [];
		pairList = [];
        for (cardToMatch in player.hand)
        {
            for(card in player.hand)
            {
                if(player.hand[cardToMatch].getRank() == player.hand[card].getRank() && player.hand[cardToMatch].getSuit() != player.hand[card].getSuit())
                {
                    pair.push(player.hand.splice(player.hand.indexOf(player.hand[card]),1)[0]);
                    pair.push(player.hand.splice(player.hand.indexOf(player.hand[cardToMatch]),1)[0]);
                    player.p.cardPairs.push(pair);
                    pairList.push(pair);
                    this.game.print(player.name + " drew a pair of " + pair[0].getRank(false) + "'s"); 
					pair = [];
                }
            }
        }
		
		if(player.isNPC)
		{
			console.log(player.name + " Card Pairs: ");
            console.log(player.p.cardPairs);
		}
		else
		{
			this.drawPairs();
		}
		
		if(pairList.length > 0) // If player had a match, draw new cards then check hand for any new matches 
		{
			this.game.pickCard(player,2 * pairList.length);
			this.checkHandForPairs(player);
			this.initOnClick();
		}
    }
    
    this.askForCard = function(player, cardToMatch)
    {
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
