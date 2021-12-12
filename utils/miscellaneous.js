const formKeysTranslated = {
    username: 'uživatelské jméno',
    firstname:'jméno',
    lastname: 'přijmení',
    email: 'email',
    password: 'heslo'
}

const objectHasValues = (object) => Object.values(object).every(x => (x !== null || x !== ''))

const convertToFullDateFromIso = (iso)=> {
    const date = new Date(iso)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    console.log('year',year)
    return `${day}-${month} ${year}`
}


module.exports = { formKeysTranslated, objectHasValues, convertToFullDateFromIso }