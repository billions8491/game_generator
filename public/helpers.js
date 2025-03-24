
export const getDailyDeal = (response) => {
    return Object.keys(response)
    .filter(key => response[key].name === 'Daily Deal')
    .map(game => response[game].items[0])
}
export const getRandomGame = gamesArray => {
    const randomNumber = Math.floor(Math.random() * gamesArray.length);
    return gamesArray[randomNumber]
}

 export const formatPrice = price => {
    return (price / 100)
}

