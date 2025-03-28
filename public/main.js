import { getDailyDeal, getRandomGame, formatPrice } from './helpers.js';

const urlToFetch = window.location.hostname === 'localhost' ? 'http://localhost:3000/steam-deals' : 'https://game-generator.onrender.com/steam-deals';



const h2 = document.createElement('h2')
const btn = document.getElementById('generate-btn');
const imgContainer = document.getElementById("img-container");
const gameInfo = document.getElementById('game-info');
const link = document.createElement('a');
link.target = '_blank'
const img = document.createElement("img");
const original_price = document.createElement('h3');
const discount = document.createElement('h3');
const final_price = document.createElement('h3');




async function getDeals() {
    try {
        const response = await fetch(urlToFetch);
        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log(error.message);
    }
}



getDeals()
.then(response => {
        const dailyDeal = getDailyDeal(response);
        return dailyDeal;
})
.then(response => {

    const dailyDeal = response[0];

    if(response.length > 0){
        h2.innerHTML = 'Today\'s Daily Deal...';
        h2.id = 'dailyDealH2'
        discount.id = 'dailyDealDiscount';
        original_price.id = 'original';
        final_price.id = 'final'

        original_price.innerHTML = `$${formatPrice(dailyDeal.original_price)}`;
        discount.innerHTML = `${dailyDeal.discount_percent}% OFF!`
        final_price.innerHTML = `Now $${formatPrice(dailyDeal.final_price)}`

        gameInfo.append(h2, original_price, discount, final_price)

        const href = `https://store.steampowered.com/app/${dailyDeal.id}`;
        link.href = `${href}`
        const imgSrc = dailyDeal.header_image;
        img.src = imgSrc
        img.style.maxHeight = '28vh';
        img.style.objectFit = 'contain'
        imgContainer.appendChild(link);
        link.appendChild(img)
    } else {
        h2.innerHTML = 'Sorry, no Daily Deal today!';
        gameInfo.append(h2)
    }
    
})

btn.addEventListener('click', () => {

    btn.style.color = 'white';
    btn.style.boxShadow = '0px 0px 30px 15px white';
    btn.style.scale = '.97';
    setTimeout(() => {
        btn.style.scale = '1'
    }, 105);
    setTimeout(() => {
        btn.style.color = 'cyan';
        btn.style.boxShadow = '0px 0px 20px 10px cyan'
    }, 1000);


getDeals().then(response => {
        

        let gamesArray = []

        // filters out Midweek/Daily Deals while looping through each game, adding a 'category' property and pushing it to the gamesArray
    
        Object.keys(response)
        .forEach(key => {
            if(response[key].items && response[key].items.length > 1){
                response[key].items.forEach(game => {
                    game.category = key
                })
            gamesArray.push(...response[key].items);
            }
        })


        const seenIds = new Set();

        // Filters out Steam Deck + duplicate games
        gamesArray = gamesArray.filter(game => {

            if(seenIds.has(game.id)){
                return false
            }
            if(game.id !== 1675200){
                seenIds.add(game.id)
                return true
            }
        })

        const randomGame = getRandomGame(gamesArray);
        console.log(gamesArray)
        return randomGame;
    })
    .then(randomGame => { 
        gameInfo.innerHTML = '';
        

        randomGame.original_price = formatPrice(randomGame.original_price);
        randomGame.final_price = formatPrice(randomGame.final_price)

        //   Sets the price of free games to "FREE" instead of "$0"

        if(randomGame.final_price === 0){
            final_price.innerHTML = 'Currently FREE!'
        } else {
            final_price.innerHTML = `Current price: $${randomGame.final_price}`
        }
        


        if(randomGame.category === 'specials'){
            h2.innerHTML = 'Special Offer!';
            original_price.innerHTML = `$${randomGame.original_price}`;
            discount.innerHTML = `${randomGame.discount_percent}% OFF!`
            final_price.innerHTML = `Now $${randomGame.final_price}`
            gameInfo.append(h2, original_price, discount, final_price)
        } 
        else if(randomGame.category === "coming_soon"){
            h2.innerHTML = 'Coming soon...';
            gameInfo.append(h2)
        } 
        else if(randomGame.category === 'top_sellers' && !randomGame.discounted){
            h2.innerHTML = 'One of Steam\'s top selling titles!';
            gameInfo.append(h2, final_price)
        } 
        else if(randomGame.category === "top_sellers" && randomGame.discounted){
            h2.innerHTML = "A discounted Top Seller!";
            original_price.innerHTML = `$${randomGame.original_price}`;
            discount.innerHTML = `${randomGame.discount_percent}% OFF!`
            final_price.innerHTML = `Now $${randomGame.final_price}`
            gameInfo.append(h2, original_price, discount, final_price)
        } 
        else if(randomGame.category === 'new_releases' && randomGame.discounted){
            h2.innerHTML = "Just released!";
            original_price.innerHTML = `$${randomGame.original_price}`;
            discount.innerHTML = `${randomGame.discount_percent}% OFF!`
            final_price.innerHTML = `Now $${randomGame.final_price}`
            gameInfo.append(h2, original_price, discount, final_price)
        } 
        else if(randomGame.category === 'new_releases' && !randomGame.discounted){
            h2.innerHTML = "Just released!";
            gameInfo.append(h2, final_price)
        }

        
        const href = `https://store.steampowered.com/app/${randomGame.id}`
        link.href = `${href}`
        const imgSrc = randomGame.large_capsule_image;
        img.src = imgSrc
        imgContainer.innerHTML = '';
        imgContainer.appendChild(link);
        link.appendChild(img)
    })
})

btn.addEventListener("mouseover", () => {
    btn.style.boxShadow = '0px 0px 20px 10px cyan';
    btn.style.color = 'rgba(0, 255, 255, 0.7)';
    btn.style.cursor = 'pointer';
})
