export const gray = [
    '#FAFAFA',
    '#F5F5F5',
    '#EEEEEE',
    '#E0E0E0',
    '#BDBDBD',
    '#9E9E9E',
    '#757575',
    '#616161',
    '#424242',
    '#212121'
]

export const brown = [
    '#EFEBE9',
    '#D7CCC8',
    '#BCAAA4',
    '#A1887F',
    '#8D6E63',
    '#795548',
    '#6D4C41',
    '#5D4037',
    '#4E342E',
    '#3E2723'
]

export const lime = [
    '#F9FBE7',
    '#F0F4C3',
    '#E6EE9C',
    '#DCE775',
    '#D4E157',
    '#CDDC39',
    '#C0CA33',
    '#AFB42B',
    '#9E9D24',
    '#827717',
    '#F4FF81',
    '#EEFF41',
    '#C6FF00',
    '#AEEA00'
]

export const primary = (a) => a ? `#604204${a}` : '#604204'
export const secondary = (a) => a ? `#ADD857${a}` : '#ADD857'
export const secMin = (a) => a ? `#D1E9A0${a}` : '#D1E9A0'

export const basicLoreHeading = "Welcome seeker"
export const basicLore = `You have been wandering for far faaar too long, so considering your more or less overwhelming tallents we offer you the chance to watch over a newborn world. Become a watcher and guide the people to a brighter future.`
export const hasAcceptedLore = (worldName) => `After wandering for a long time you have decided too watch over the newborn world of ${worldName} you will lead the people we have assigned to you`
export const onAcceptLore = "Truly wonderfull - we are delighted that you have accepted our offer - see to the right we have provided you with an interface to act in your role as Watcher search for a new world and fulfill your job as a guide to the lost people we will assign to you - we wish you luck!"
export const onDeclineLore = "How unfortunate - our offer stands however, take your time to consider it well"

export const imageList = [
    'https://wallup.net/wp-content/uploads/2018/09/26/170987-fantasy_art.jpg',
    'https://wallup.net/wp-content/uploads/2018/09/26/193004-fantasy_art-forest-trees-birds.jpg',
    'https://wallup.net/wp-content/uploads/2018/09/26/165273-fantasy_art-field-clouds.jpg',
    'https://wallup.net/wp-content/uploads/2018/09/25/570599-warrior-fantasy_art-samurai-sword.jpg',
    'https://wallup.net/wp-content/uploads/2018/03/19/590424-original_characters-elven-Sakimichan-women-looking_at_viewer-blonde-pointed_ears-platinum_blonde-blue_eyes-white_hair-fantasy_art-digital_art-artwork-illustration-anime-necklace.jpg',
    'https://wallup.net/wp-content/uploads/2017/11/23/505568-warrior-archer-fantasy_art.jpg',
    'https://wallup.net/wp-content/uploads/2017/11/23/524776-anime_girls-fantasy_girl-fantasy_art-Legend_of_the_Five_Rings.jpg',
    'https://wallup.net/wp-content/uploads/2017/11/23/509214-fantasy_art-forest-deer-fawns.jpg',
    'https://wallup.net/wp-content/uploads/2016/01/259711-river-fantasy_art-nature-video_games.jpg',
    'https://wallpapercave.com/wp/v29iuWR.jpg',
    'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.9_xkmDngAgltHckaB9DNKQHaEK%26pid%3DApi&f=1&ipt=801c26dd435fe53b6ae5845d6f036eafd2b4247092f4b2f52b86a9c576eca4b5&ipo=images'
]

export const cityClass = (n) => n <= 0 ? 'Deserted' : n < 100 ? 'Village' : n < 100 ? 'Town' : n < 10000 ? 'City' : 'Metropolis';