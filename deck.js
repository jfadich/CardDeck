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
		if(this.cards.length > 0)
		{
        	return this.cards.pop();
		}
		else
		{
			return false;
		}
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

    this.handLimit = 7;

    this.init = function(canvas)
    {
		this.players = [];
        this.d = new Deck();
        this.d.init(true);
        
        // Create header
		this.leftContainer = $("#left");
		this.handContainer = $("#playerHand p");
		this.screen = $("#screen");
    }

    // Display Methods
    
    this.drawCard = function(parentElement, card)
    {
        var cardContainer;
        if(typeof card == "undefined")
		{
			return -1;
		}
		else
		{
			cardContainer = $("<span></span");
			cardContainer.attr({ id : card.getId() });
			cardContainer.addClass("card");
			cardContainer.text(card.getRank());
			cardContainer.addClass(card.getSuit().toLowerCase());
			parentElement.append(cardContainer);
		}
    }
    
    this.drawDeck = function(deck) {}
    
    this.drawHand = function(player) 
    {
        hand = player.getHand();
        this.handContainer.empty(); // Reset element to redraw
        for (card in hand)
        {
            this.drawCard(this.handContainer,hand[card]);
        }
        
    }
    
    this.print = function(printText)
    {
        var textContainer = $("<li></li>");
        textContainer.text(printText);
        textContainer.appendTo(this.screen).hide().slideDown();
        this.screen.animate({ scrollTop: this.screen.prop("scrollHeight") });
    }
    
    // Control Methods
	
    this.addPlayer = function(player)
	{
		this.players.push(player);
	}
	
    this.pickCard = function(player, pickCount)
    {
        pickCount = setDefault(pickCount, 1);
        if(this.d.cards.length < pickCount)
		{
			pickCount = pickCount - this.d.cards.length;
		}
		
		if(pickCount <= 0)
		{
			this.print("Out of cards!!");
			//this.endGame();
			return;
		}
		
        for(i = 0; i < pickCount; i++)
        {
            if (player.hand.length < this.handLimit)
            {
				drawnCard = this.d.getTopCard();
				player.hand.push(drawnCard);
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
	
	this.endGame = function() { } ;

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
                return this.hand.splice(this.hand.indexOf(card),1)[0]; 
            }
        }
    }
	this.checkCardById = function(cardId)
    {
        for(card in this.hand)
        {
            if (this.hand[card].getId() == cardId)
            {
                return this.hand[card];   // loser.hand.splice(loser.hand.indexOf(loserCard),1)[0]
            }
        }
		return false;
    }
}

function GoFish()
{      

    this.startGame = function()
    {
        this.game = new GameBoard();
        this.game.init();
		
		this.game.addPlayer(new Player(prompt("What's your name?"), false));
		this.game.addPlayer(new Player("Computer", true));
        this.game.players[0].p["cardPairs"] = [];
		this.game.players[1].p["cardPairs"] = [];
		this.game.endGame = this.endGame;
    
		this.playerPairStage = $("<div></div>").addClass("cardPaisrList").appendTo(this.game.leftContainer);
		
		this.game.print("Welcome to Go Fish!");
        this.game.pickCard(this.game.players[0], this.game.handLimit);
        this.game.pickCard(this.game.players[1], this.game.handLimit);
        this.checkHandForPairs(this.game.players[0]);
		this.checkHandForPairs(this.game.players[1]);

        this.game.print("Please pick a card");
    }
	
	this.endGame = function()
	{
		var winnerText;
		console.log(this);
		var pairCountPlayer1 = this.game.players[0].p.cardPairs.length;
		var pairCountPlayer2 = this.game.players[1].p.cardPairs.length;
		
		if(pairCountPlayer1 == pairCountPlayer2)
		{
			winnerText =  "It was a tie!";
		}
		else if(pairCountPlayer1 > pairCountPlayer2)
		{
			winnerText =  this.game.players[0].name + " wins!!";
		}
		else
		{
			winnerText =  this.game.players[1].name + " wins!!";
		}		
		this.game.print("-------------------------------");
		this.game.print("-  ");
		this.game.print("- " + this.game.players[0].name + " has " + pairCountPlayer1 + " pairs.");
		this.game.print("- " + this.game.players[1].name + " has " + pairCountPlayer2 + " pairs.");
		this.game.print("-  ");
		this.game.print("-  " + winnerText);
		this.game.print("-------------------------------");
		this.game.handContainer.innerHTML = "<h1>Game Over</h1>";
	}

	$("#playerHand").on("click", ".card", function() {
		var card = game.game.players[0].checkCardById($(this).attr("id"));
		alert(card.getId());
		game.playerChooseCard(card);
	
	});
	
	this.drawPairs = function()
	{
		var pairElement;
		this.playerPairStage.empty(); // Reset for redraw
		
		for(pair in this.game.players[0].p.cardPairs)
		{
			pairElement = $("<div></div>").addClass("pair").appendTo(this.playerPairStage);
            console.log(this.game.players[0].p.cardPairs);
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
			this.checkHandForPairs(winner);
			this.checkHandForPairs(loser);
			this.game.drawHand(this.game.players[0]);
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
        var matchedCard, pairList;
		pairList = [];
		
        for (cardToMatch in player.hand)
        {
            for(card in player.hand)
            {
                if(player.hand[cardToMatch].getRank() == player.hand[card].getRank() && player.hand[cardToMatch].getSuit() != player.hand[card].getSuit())
                {
					var pair = [];
                    pair.push(player.getCardById(player.hand[card].getId()));
                    pair.push(player.getCardById(player.hand[cardToMatch].getId()));
                    pairList.push(pair);
                    player.p.cardPairs.push(pair);
                    this.game.print(player.name + " drew a pair of " + pair[0].getRank(false) + "'s"); 
                }
            }
        }

		if(pairList.length > 0) // If player had a match, check hand for any new matches 
		{
			var cardCount = 2 * pairList.length;
			if( this.game.d.cards.length > cardCount)
			{
				this.game.pickCard(player, cardCount);
			}
			else if(cardCount == 0)
            {
                console.log("out of cards. Can't draw hand back up to limit");
            }
            else
			{
				this.game.pickCard(player, cardCount - this.game.d.cards.length)
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
			//player.p.cardPairs.push(pairList);
            //console.log(pairList)
                        console.log(this.game.d.cards.length);
            if (this.game.d.cards.length < 2)
            {
                this.endGame();   
            }
            else
            {
                //this.checkHandForPairs(player);
            }
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
