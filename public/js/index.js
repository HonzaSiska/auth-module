 
// import User from './User.js'
// import {test} from './functions.js'

const searchUserButton = document.querySelector('#search-user-btn')

const usersTable = document.querySelector('#users-table')

const error = document.querySelector('#error')

const menuBtn = document.querySelector("#hamburger-menu-wrapper")

const navigation = document.querySelector('#nav-left')

const closeNavButton = document.querySelector('#x-close-nav')



 const validatePasswordChange = () => {
    const currentPassword = document.querySelector('#current-password').value
        const newPassword = document.querySelector('#new-password').value
        const newPasswordConfirm = document.querySelector('#new-password-confirm').value

        //CHECK IF ALL FIELDS ARE FILLED OUT ON SUBMIT 

        if(!currentPassword|| !newPassword || !newPasswordConfirm){
            
            error.innerHTML = '<ul><li class="text-danger">Vyplň všechna pole</li></ul>'
           
            return false
        }else if(newPassword !== newPasswordConfirm ){
            error.innerHTML = '<ul><li class="text-danger">Nové heslo a potvrzení nového hesla se neshoduji</li></ul>'
            return false
        }else{ 
            document.change-password-form.submit()
            return true 
        }
        
 }

 const validateAvatar = () => {
    const file = document.querySelector('#avatar-register')
    const type = file.files[0].name.split('.').pop().trim()
    console.log(type)
    error.innerHTML= ""
    if(file.files.length === 0 ){
        console.log(file.files[0])
        error.innerHTML = '<ul><li class="text-danger">Vyber profilovou fotku</li></ul>'
        window.scrollTo(0, 200);
        return false
        
    }else if(file.files[0].size > 10000000){
        
        error.innerHTML = '<ul><li class="text-danger">Soubor musí mít méně než 10 mb</li></ul>'
        file.value=""
        window.scrollTo(0, 200);
        console.log(file.files[0].type)
        return false
    }else if(type != 'jpg' && type != 'jpeg' && type != 'png' ){
        console.log('type', typeof type)
        error.innerHTML = '<ul><li class="text-danger">Povolené formáty fotek: jpg, jpeg, png</li></ul>'
        file.value=""
        
        window.scrollTo(0, 200);
        return false
    }
    console.log(file)
  
    return document.avatar-form.submit()
    
}

//OPEN MOBILE NAV
menuBtn.addEventListener('click', () => {
    navigation.classList.add('open-menu')
    navigation.classList.remove('close-menu')
})
//CLOSE NAVE MOBILE
closeNavButton.addEventListener('click', () => {
    navigation.classList.add('close-menu')
    navigation.classList.remove('open-menu')
    
})

//EVENT DELEGETION CHANGE ROLE
window.addEventListener('click', (e) => {
    import('./User.js').then(({default: User, changeRole })=> {
        const user = new User()
        return user.changeRole(e)
    })
})




//  
// const validatePasswordChange = () => {
    
//     import('./User.js').then(({default: User,validatePasswordChange })=> {
//         const user = new User()
//         return user.validatePasswordChange()
//     })
// }

// const validateAvatar = () => {
    
//     import('./User.js').then(({default: User,validateAvatar})=> {
//         const user = new User()

//         return user.validateAvatar()

//     })
    
// }

//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

