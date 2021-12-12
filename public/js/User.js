

class User {

    constructor(){

    }

    changeRole(e){
        
        if(e.target.id === "role-input-change"){
            e.target.addEventListener('change',() => {
                if(e.target.dataset.role === e.target.value){
                    console.log(e.target.dataset.role, e.target.value)
                    return
                }else if(e.target.dataset.role ==='-- role --'){
                  return  
                }else{
                    //fetch POST
                    //IMPORT FUNCTION postData from functions
                    import('./functions.js').then(({ postData }) => {
                        postData('/user/role', {
                            id: e.target.dataset.id,
                            role: e.target.value
                        })
                        // .then(response => response.json())
                        .then(data => {

                            // AFTER USER ROLE UPDATE, DROP DOWN IS SET TO -- role --
                          
                            e.target.children[0].setAttribute('selected', 'selected')

                            // HIDE DROPDOWN AND CANCEL BUTTON
                            e.target.parentNode.classList.add('inactive')
                            e.target.parentNode.classList.remove('active')
                            e.target.parentNode.parentNode.firstElementChild.classList.remove('inactive')
                            e.target.parentNode.parentNode.firstElementChild.classList.add('active')
                            e.target.parentNode.parentNode.children[1].classList.remove('inactive')
                            e.target.parentNode.parentNode.children[1].classList.add('active')
                            // SET ROLE FIELD AND DATA ATTRIBUTE TO UPDATED ROLE 
                            e.target.parentNode.parentNode.children[1].innerText = data.role
                            e.target.dataset.role= data.role
                        })
                    })
                }
            }) 
        }else if(e.target.id === "change-role-btn"){
            console.log('key was clicked')
            e.target.parentNode.parentNode.lastElementChild.classList.add('active')
            e.target.parentNode.parentNode.lastElementChild.classList.remove('inactive')
            e.target.parentNode.classList.add('inactive')
            e.target.parentNode.classList.remove('active')
            e.target.parentNode.nextElementSibling.classList.add('inactive')
            e.target.parentNode.nextElementSibling.classList.remove('active')
        }else if(e.target.id ==="cancel-role-btn"){
            e.target.parentNode.classList.add('inactive')
            e.target.parentNode.classList.remove('active')
            e.target.parentNode.parentNode.firstElementChild.classList.remove('inactive')
            e.target.parentNode.parentNode.firstElementChild.classList.add('active')
            e.target.parentNode.parentNode.children[1].classList.remove('inactive')
            e.target.parentNode.parentNode.children[1].classList.add('active')
        }
    }
    
}

export default User