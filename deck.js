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

        shuffleCount = setDefault(shuffleCount,15);
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

    this.handLimit = 6;

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
    
    this.drawCard = function(parentElement, card, animate)
    {
		animate = setDefault(animate, true);
        var cardContainer;
        if(typeof card == "undefined")
		{
			return -1;
		}
		else
		{
			cardContainer = $("<span></span").attr({ id : card.getId() });
			cardContainer.addClass("card").addClass(card.getSuit().toLowerCase());
			cardContainer.text(card.getRank());
			parentElement.append(cardContainer);
			if(animate)
			{
				cardContainer.hide().slideDown();
			}
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
			pickCount = this.d.cards.length;
		}
		
		if(pickCount == 0)
		{
			this.print("Out of cards!!");
			return false;
		}
		
        for(i = 0; i < pickCount; i++)
        {
            if (player.hand.length < this.handLimit)
            {
				drawnCard = this.d.getTopCard()
				player.hand.push(drawnCard);
				if(!player.isNPC)
				{
					this.drawCard(this.handContainer,drawnCard);
				}
            }
            else
            { 
				if(player.isNPC)
				{
					console.log(player.name + "'s hand is full.");
				}
				else
				{
					this.handContainer.css("border-color","red");
					timer = window.setTimeout(function() { document.getElementById("playerHand").style.borderColor = "black"; }, 1000);
					this.print(player.name + "'s hand is full.");
				}
            }
        }

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
				if(!this.isNPC)
				{
					$("#" + cardId).slideUp("normal", function() { $(this).remove() });
				}
                return this.hand.splice(card,1)[0]; 
            }
        }
		return false;
    }
	this.checkCardById = function(cardId)
    {
        for(card in this.hand)
        {
            if (this.hand[card].getId() == cardId)
            {
                return this.hand[card]
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
		
        this.game.pickCard(this.game.players[0], this.game.handLimit);
        this.game.pickCard(this.game.players[1], this.game.handLimit);
        this.checkHandForPairs(this.game.players[0]);
		this.checkHandForPairs(this.game.players[1]);

        this.game.print("Please pick a card");
    }
	
	this.endGame = function()
	{
		var winnerText;
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
		this.game.print("-  ");
		this.game.print("-------------------------------");
	}

	$("#playerHand p").on("click", ".card", function() {
		var card = game.game.players[0].checkCardById($(this).attr("id"));
		game.playerChooseCard(card);
	
	});
	
	this.drawPair = function(pair)
	{
		var pairElement;
		
		pairElement = $("<div></div>").addClass("pair").appendTo(this.playerPairStage);		
		for(card in pair)
		{
			this.game.drawCard(pairElement, pair[card]);
		}
	}
	
	this.moveCardMatch = function(winner, winnerCard, loser,loserCard)
	{
		    var pair = [];
			
            pair.push(loser.getCardById(loserCard.getId()));
			pair.push(winner.getCardById(winnerCard.getId()));
			winner.p.cardPairs.push(pair);
			if(!winner.isNPC)
				this.drawPair(pair);
			
			if(this.game.d.cards.length >= 2)
			{
            	this.game.pickCard(winner);
				this.game.pickCard(loser);
			}
			else if(winner.hand.length == 0 || loser.hand.length == 0)
			{
				this.endGame();
				return	
			}
			
			this.checkHandForPairs(winner);
			this.checkHandForPairs(loser);
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
        var pairList = [];
		var handCopy = [];
		
		handCopy = player.hand.slice();
		for(card1Index = handCopy.length -1; card1Index >= 0; card1Index--)
		{
			for(card2Index = card1Index -1; card2Index >= 0; card2Index--)
			{
				if(handCopy[card1Index].getRank(false,true) == handCopy[card2Index].getRank(false,true) && handCopy[card1Index].getRank(false,true) > 0 && handCopy[card2Index].getRank(false,true) > 0)
				{
					var pair = [];
					
					pair.push(player.getCardById(handCopy[card1Index].getId()));
					pair.push(player.getCardById(handCopy[card2Index].getId()));
					player.p.cardPairs.push(pair);
					pairList.push(pair);
					this.game.print(player.name + " drew a pair of " + pair[0].getRank(false) + "'s");
					handCopy[card1Index] = new Card(0,0); //  Replace matched card with a dummy card to prevent matching it again
					handCopy[card2Index] = new Card(0,0); 
					break; // break out of the inner loop because a match has been found
				}
			}
		}

		if(pairList.length > 0) // If player had a match, draw new cards then check hand for any new matches
		{
			var cardCount = 2 * pairList.length;
			if(!player.isNPC)
			{
				for (pair in pairList)
				{
					this.drawPair(pairList[pair]);
				}
			}
			if(this.game.pickCard(player, cardCount) == false)
			{
				return;
			}
			if(player.isNPC)
			{
				console.log(player.name + "'s Pairs: ");
				console.log(player.p.cardPairs);
			}
			else
			{
				//this.drawPairs();
			}

            if (this.game.d.cards.length < 2)
            {
                //this.endGame();   
            }
            else
            {
                this.checkHandForPairs(player);
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
