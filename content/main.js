document.querySelector('#strCheck').value = "0";
document.querySelector('#conCheck').value = "0";
document.querySelector('#costCheck').value = "0";
document.querySelector('#qCost').checked = true;
document.querySelector('#teamZombies').checked = true;

document.querySelector('#percentOutput').hide;


// Begin the query
document.querySelector("#qButton").addEventListener('click', e => {

    // first finds which radio is clicked
    let teamRL = document.getElementsByName('team');
    let chosenList = "";
    for (i = 0; i < teamRL.length; i++) {
        if (teamRL[i].checked){
            // take the value of the checked radio ("teamPlants" or "teamZombies")
            chosenList = teamRL[i].value;
            break;
        }
    }

    // sets chosen list equal to the team chosen from the radio
    // then filters only the plants/zombies (because those are the only cards that can be leaped)
    let unitList = [];
    if(chosenList === "teamPlants"){
        unitList = plantCards.filter(card => card.type === "Plant");
    }
    else{
        unitList = zombieCards.filter(card => card.type === "Zombie");
    }


    // if either of the effective check boxes are checked, replace str/health with efStr/efHealth
    // if not, replace str/health with ogStrength/ogHealth
    if(document.querySelector('#useEfStr').checked == true){
        for(let i = 0; i < unitList.length; i++){
            if('effectiveStrength' in unitList[i]){
                unitList[i].strength = unitList[i].effectiveStrength;
            }
        }
    }
    else {
        for(let i = 0; i < unitList.length; i++){
            if('ogStrength' in unitList[i]){
                unitList[i].strength = unitList[i].ogStrength;
            }
        }
    }

    if(document.querySelector('#useEfCon').checked == true){
        for(let i = 0; i < unitList.length; i++){
            if('effectiveHealth' in unitList[i]){
                unitList[i].health = unitList[i].effectiveHealth;
            }
        }
    }
    else {
        for(let i = 0; i < unitList.length; i++){
            if('ogHealth' in unitList[i]){
                unitList[i].health = unitList[i].ogHealth;
            }
        }
    }

    
    

    // filter through the queries the user inputted
    // default values are set to 0
    let qList = unitList;
    let cardCost = document.querySelector('#costCheck').valueAsNumber;
    qList = qList.filter(card => card.cost == cardCost);
    let minStr = document.querySelector('#strCheck').valueAsNumber;
    if(minStr > 0){
        qList = qList.filter(card => card.strength >= minStr);
    }
    let minCon = document.querySelector('#conCheck').valueAsNumber
    if(minCon > 0){
        qList = qList.filter(card => card.health >= minCon);
    }



    // sends chosenList to updateCardVisual, creating the list on the right side
    updateCardVisual(qList);


    

    // run through the same procedure as finding the team radio
    // this one is used to find which filter the percent of viable card should be ran against
    let queryRL = document.getElementsByName('percentQuery');
    let queryRLOut = "";
    for (i = 0; i < queryRL.length; i++) {
        if (queryRL[i].checked){
            queryRLOut = parseInt(queryRL[i].value);
            break;
        }
    }

    // creates the innerHTML for showing the percentage of cards that meet the query based on one chosen filter
    let pOut = "Percentage of ";
    let qListDenom = 0;
    if(queryRLOut == 0){ // cost
        qListDenom = unitList.filter(card => card.cost == cardCost);

        pOut += cardCost + "-cost cards: ";
        pOut += (qList.length / qListDenom.length * 100).toFixed(2) + "%";
        document.querySelector('#percentOutput').innerText = pOut;
        document.querySelector('#percentOutput').show;
    }
    else if(queryRLOut == 1){ // strength
        qListDenom = unitList.filter(card => card.strength >= minStr);
        
        pOut += minStr + "+ strength cards: ";
        pOut += (qList.length / qListDenom.length * 100).toFixed(2) + "%";
        document.querySelector('#percentOutput').innerText = pOut;
        document.querySelector('#percentOutput').show;
    }
    else if(queryRLOut == 2){ // health
        qListDenom = unitList.filter(card => card.health >= minCon);
        
        pOut += minCon + "+ health cards: ";
        pOut += (qList.length / qListDenom.length * 100).toFixed(2) + "%";
        document.querySelector('#percentOutput').innerText = pOut;
        document.querySelector('#percentOutput').show;
    }
    else{
        document.querySelector('#percentOutput').hide;
    }

});

// adds all cards found with the query to the right side of the page
function updateCardVisual(queriedList){
    // remove the innerHTML of card-list
    // ie delete the visual list of any previous query
    document.querySelector("#card-list").innerHTML = '';

    // then rebuild the list
    for(let i = 0; i < queriedList.length; i++){
        document.querySelector('#card-list').appendChild(createCardVisual(queriedList[i]));
    }
}

// creates the element to add to the list of query results
// this should have the image of the card in the center 
// and a coorsponding backbround color based on its rarity
function createCardVisual(chosenCard){
    // create the element to add to the list
    let frame = document.createElement('div');
    frame.setAttribute('class', 'card-container ' + chosenCard.rarity);

    // creates and adds the inner HTML to the div object, namely the image and alt text
    // ex. <img src="images/sorkin75.jpg" alt="Andrew Ross Sorkin photo">
    let htmlData = '<img src="';
    htmlData += chosenCard.image;
    htmlData += '" alt="';
    htmlData += chosenCard.name;
    htmlData += '">';
    frame.innerHTML = htmlData;

    return frame;
}

