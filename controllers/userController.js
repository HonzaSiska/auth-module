const User = require('../models/user')
const express = require('express') 
const router = new express.Router()
const bcrypt = require('bcryptjs')
const {formKeysTranslated,convertToFullDateFromIso } = require('../utils/miscellaneous')
const session = require('express-session')
const upload = require('../helpers/single-image')
const fs = require('fs')






//Render  REGISTER FORM layout
exports.registration = (req,res) => {
    res.render('register', {
        title: 'registrace',
        hideLoginBtn : true 
    })   
}

//Get LOGIN FORM
exports.loginForm = (req,res) => {
    console.log('session',req.session.userId)
    res.render('login', { 
        title: 'Login',
        hideLoginBtn : true 
    })
}

// Log USER IN
exports.login = async(req,res) => {
    const { email, password } = req.body
    const body = req.body
    const error = []
    console.log('session',req.session.userId)
    
    //ONE OF THE LOGIN FIELDS EMPTY
    if(email ===""|| password===""){
        console.log('body',body)

        // Add request body translated keys to error array
        for(const[key,value] of Object.entries(body)){
            if(value === '' || value === null){
                error.push(`Vyplň pole : ${formKeysTranslated[key]}`)
            } 
        }  
        console.log(error)
        return res.render('login',{ userEmail:email, password, error}) 
    }else{
        try{
            const user = await User.findByCredentials(body.email, body.password)
            console.log(user)
            //start session
            if(user){
                req.session.userId = user.id
                req.session.role = user.role
                req.session.username = user.username
                req.session.avatar = user.avatar
                return res.render('dashboard', { 
                    title:'Dashboard',
                    userId : req.session.userId,
                    userRole : req.session.role,
                    username : req.session.username,
                    isAdmin: req.session.role === 'admin',
                    avatar:req.session.avatar
                })
            }else{
                throw new Error('Tento email neexistuje !!')
            }
        } catch (e) {
        error.push(e.message) 
        return res.render('login', {title:'Login',email, password,error})
        }
        
    }  
    
}

//LOG USER OUT
exports.logout = async(req,res) => {
    req.session.destroy()
    return res.render('home', {title: 'Home'})
}

// add NEW USER 
exports.register = async (req,res) => {

    const {firstname, username, lastname, email, password } = req.body
        const body = req.body 
        const error = []

    //Checks if any field is empty
    if(username === "" || firstname==="" || lastname === "" || email ===""|| password===""){
        // Add request body translated keys to error array
        for(const[key,value] of Object.entries(body)){
            if(value === '' || value === null){
                error.push(`Vyplň pole : ${formKeysTranslated[key]}`)
            } 
        }  
        
        console.log(error)
        return res.render('register',{
            fName:firstname, 
            uName:username, 
            lName:lastname, 
            userEmail:email, 
            password, 
            avatar: undefined,
            error})  
    }else{

        try{

            //CHECK if user => Check if Email exists => IF NOT SAVE USER
            const existingUser = await User.findOne({email: body.email})
            console.log('existing user', existingUser)

            const user = new User(body)
            
            if(!existingUser){
            
                    const newUser = await user.save()
                    req.session.userId = newUser.id
                    req.session.role = newUser.role
                    req.session.username = newUser.username
                

                    return res.render('dashboard', { 
                        userId : req.session.userId,
                        userRole : req.session.role,
                        username : req.session.username,
                        isAdmin: req.session.role === 'admin',
                        title: 'Dashboard',
                    })
            }else {
                error.push('Tento email je zabraný')
                return res.status(400).render('register',{
                    title: 'Registrace', fName:firstname, 
                    uName:username, 
                    lName:lastname, 
                    userEmail:email, 
                    password, 
                    error,
                    avatar: undefined})
            }

        }catch(e){
            error.push('Registrace se nezdařila. Chyba serveru')
            return res.status(500).render('register')
        }
    }   
}
//Render HOME page

exports.dashboard = async (req,res) => {
    
    console.log(req.session.role)
    res.render('dashboard', {
        title:'Dashboard',
        userId : req.session.userId,
        userRole : req.session.role,
        username : req.session.username,
        avatar:req.session.avatar
    })
}



exports.users = async (req,res) => {

    // SEARCH VALUE FROM USER SEARCH FIELD
    const search = req.query.search
    const regex = new RegExp('.*'+search+'.*','i')
   
    // IF  SEARCH DATA EXISTS, COUNT ALL USERS THAT MATCH THE CRITERIA OTHERWISE COUNT ALL USERS
    const userCount = search ? await User.countDocuments({$or:[{username:{$regex: regex}},{email:{$regex: regex}}]}) : await User.countDocuments()

    //IF NO USERS FOUND ADD ERROR MESSAGE TO THE ARRAY
    const error = []
    if(userCount === 0)error.push('Bohužel žadný uživatel nebyl nalzen')


    //GET PAGE NUMBER AND NUMBER OF RECORDS TO BE DISPLAYED, IF NOT PROVIDED SET TO DEFAULT
    const page = parseInt(req.query.page) || 1
    const size = parseInt(req.query.size) || 3

    //CALCULATES HOW MANY USERS LEFT AFTER THE PAGE WE ARE CURRENTLY ON
    const usersLeft = Math.ceil(userCount - (size * page))
    
    //NUMBER OF RECORDS PER PAGE
    const limit = size 


    //NUMBER OF PAGES TO BE SKIPPED
    let skip

    if(page === 1){
        skip = 0
    }else{
        skip = (page - 1) * size
    }

    //FOR NEXT AND PREVIOUS BUTTONS
    const nextPage = page + 1
    const prevPage = page - 1

    //COUNTS NUMBER OF RECORDS ON NEXT PAGE
    let nextRecords
    if((usersLeft - size) >= 0){
        nextRecords = size
    }else{
        nextRecords = usersLeft
    }

    //IF SEARCH VALUE PROVIDED SEARCH FOR SPECIFIC STRING OTHERWISE SEARCH ALL
    let users
    if(search){
        users = await User.find({$or:[{username:{$regex: regex}},{email:{$regex: regex}}]}).limit(limit).skip(skip).exec()
    }else{
        users = await User.find().limit(limit).skip(skip)
    }
    
    //USE THE DATA TO BE INSERTED INTO HTML DOCUMENT
    let html = ``;
    users.forEach((user)=> {
        const date = convertToFullDateFromIso(user.createdAt)
        html+= `
        <tr>
            <th scope="row"></th>
            <td>${user.username}</td>
            <td>${user.firstname}</td>
            <td>${user.lastname}</td>
            <td>${user.email}</td>
            <td class="role-cell-flex">

                <div class="table-cell-items active" ><img src="/open-iconic-master/svg/key.svg" id="change-role-btn" class="iconic iconic-md" alt="key">
                </div>
                <div id="role-text-change" class="active table-cell-items">${user.role}
                </div>
                <div class="role-select-wrapper inactive" class="table-cell-items">
                    <select  name="role" id="role-input-change" data-role="${user.role}" data-id="${user._id}">
                        <option>-- role --</option>
                        <option value="admin">admin</option>
                        <option value="user">user</option>
                    </select>
                    <img src="/open-iconic-master/svg/circle-x.svg" id="cancel-role-btn" class="iconic iconic-md " alt="key">
                </div>
                
            </td>
            <td>${date}</td>
            <td>
                <a href="/user/confirmDelete?id=${user._id}&username=${user.username}" class="btn btn-danger">Smazat</a>
            </td>
        </tr>`

    })
    

    //IF SEARCH VALUE PROVIDED THEN ADD SEARCH PARAM TO PREV AND NEXT BUTTONS 
    let nextPageBtn
    let prevPageBtn

    if(search){
        nextPageBtn = usersLeft > 0 ? `<a href="/user/all?page=${nextPage}&size=${size}&search=${search}"  class="btn btn-primary">další ${nextRecords}</a>` : null

        prevPageBtn = page > 1 ? `<a href="/user/all?page=${prevPage}&size=${size}&search=${search}"  class="btn btn-primary">předchozí ${size}</a>` : null
    }else{
        nextPageBtn = usersLeft > 0 ? `<a href="/user/all?page=${nextPage}&size=${size}"  class="btn btn-primary">další ${nextRecords}</a>` : null

        prevPageBtn = page > 1 ? `<a href="/user/all?page=${prevPage}&size=${size}"  class="btn btn-primary">předchozí ${size}</a>` : null
    }
     
    res.render('allusers',{
        title:'Users',
        userId : req.session.userId,
        userRole : req.session.role,
        username : req.session.username,
        avatar:req.session.avatar,
        hideLoginBtn : true,
        isAdmin: req.session.role === 'admin',
        users: html,
        nextPage: nextPageBtn,
        prevPage:prevPageBtn,
        error
    })
}


//Get specific user by id
exports.profile = async (req, res) => {
    
    const id = req.params.id
    console.log(id)
    try{
        const existingUser = await User.findById(id)
        console.log('existinUser',existingUser)
        
        return res.status(200).render('profile', {
            fName: existingUser.firstname, 
            uName: existingUser.username, 
            lName: existingUser.lastname, 
            userEmail:existingUser.email,
            avatar:req.session.avatar,
            userId : req.session.userId,
            userRole : req.session.role,
            username : req.session.username,
            password: undefined,
            isAdmin: req.session.role === 'admin', 
            title: 'Profil',
            hidePassword : true,
            
               
        })
    }catch(err){
        res.status(400).redirect('/404')
    }
}

//CONFIRM DELETION OF USER

exports.confirmDelete = (req,res) => {
    

    return res.status(200).render('confirm-delete', {
        
        userId : req.session.userId,
        userRole : req.session.role,
        username : req.session.username,
        avatar:req.session.avatar,
        isAdmin: req.session.role === 'admin', 
        title: 'Smazat Uživatele',
        hidePassword : true,
        idToBeDeleted: req.query.id,
        deletedBySameUser: req.query.id === req.session.userId,
        usernameToBeDeleted: req.query.username
        
           
    })

}

//DELETE USER

exports.delete = async (req, res) => {
    try{

        const id = req.query.id
        console.log(req.query.id)

        // USER ACCOUNT IS DELETED BY USER HIMSELF
        if(id === req.session.userId){
            req.session.destroy()
            const user = await User.findOneAndDelete({_id: req.query.id})
            return res.render('home', {title: 'Home'})
        }else{
        //ANY USER ACCOUNT CAN BE DELETED BY ADMIN    
            const user = await User.findOneAndDelete({_id: req.query.id})
            res.render('dashboard', {
                title:'Dashboard',
                userId : req.session.userId,
                userRole : req.session.role,
                username : req.session.username,
                avatar:req.session.avatar,
                isAdmin: req.session.role === 'admin'
            })
        }
        
    }catch(e){
        res.status(500).send('Internal Server Error')
    }
    
    
}

//UPDATE USER
exports.update = async (req, res) => {
    console.log('body',req.body)
    console.log('user id on update',req.session.userId)

    const error = []
    const body = req.body
    const {username,firstname, lastname, email} = body
    if(username === "" || firstname==="" || lastname === "" || email ===""){

        // Add request body translated keys to error array
        for(const[key,value] of Object.entries(body)){
            if(value === '' || value === null){
                error.push(`Vyplň pole : ${formKeysTranslated[key]}`)
            } 
        }  
        
        console.log(error)
        return res.render('profile',{
            fName:firstname, 
            uName:username, 
            lName:lastname, 
            userEmail:email,
            
            isAdmin: req.session.role === 'admin', 
            title: 'Profil',
            hidePassword : true,
            userId : req.session.userId,
            userRole : req.session.role,
            username : req.session.username,
            avatar:req.session.avatar,
            error}) 

    }else{
        try{
            console.log(body)
            const updatedUser = await User.findOneAndUpdate({_id: body.userId}, {$set:{
                username,
                firstname,
                lastname,
                email
            }},{new: true},)

            console.log(updatedUser)

            
            //BACK TO PROFILE WITH UPDATED DATA

            return res.status(200).render('profile', {
                fName:updatedUser.firstname, 
                uName:updatedUser.username, 
                lName:updatedUser.lastname, 
                userEmail:updatedUser.email,
                avatar: updatedUser.avatar,
                isAdmin: req.session.role === 'admin', 
                title: 'Profil',
                hidePassword : true,
                userId: updatedUser._id, 
                userRole : req.session.role,
                username : req.session.username,
                avatar:req.session.avatar,
            })
        }catch(e){
            res.send(`Stala se chyba`)
        }
    }
  
}

exports.changePasswordForm = (req, res) => {
    return res.status(200).render('change-password', {
        
        userId : req.session.userId,
        userRole : req.session.role,
        username : req.session.username,
        avatar:req.session.avatar,
        isAdmin: req.session.role === 'admin', 
        title: 'Změna hesla',
        //hidePassword : true,
        id: req.params.id,
        hideLoginBtn : true,
              
    })
}
exports.changePassword = async (req, res) => {
    try{
       
        const hashedPassword = await bcrypt.hash(req.body.newpassword, 8)
        const user = await User.findOneAndUpdate({_id: req.body.id}, {$set:{
            password: hashedPassword
        }},{new: true},)
        return res.status(200).render('profile', {
            fName: user.firstname, 
            uName: user.username, 
            lName: user.lastname, 
            userEmail:user.email,
            userId : req.session.userId,
            userRole : req.session.role,
            username : req.session.username,
            avatar:req.session.avatar,
            password: undefined,
            isAdmin: req.session.role === 'admin', 
            title: 'Profil',
            hidePassword : true,
               
        })

    }catch(e){
        res.status(500).send('Internal Server Error')
    }
}

exports.uploadAvatar = async (req, res) => {
    error=[]
    try{
        const user = await User.findOne({_id: req.params.id}) 
        if(req.file.filename !== ''){
            
            const file = req.file.filename
            const user = await User.findOne({_id: req.params.id}) 
            if(user.avatar){
                fs.unlinkSync(`public/uploads/avatar/${user.avatar}`)
                
            }
            // const updatedUser = await User.updateOne({_id: req.params.id}, 
            //     {$set:{avatar: file}},{new: true})
             
            const updatedUser = await User.findOneAndUpdate({_id: req.params.id}, {$set:{
                avatar: req.file.filename
            }},{new: true})

            console.log('updated user', updatedUser)
            console.log('avatar updated',updatedUser.avatar)
            req.session.avatar = updatedUser.avatar
            return res.redirect(`/user/${updatedUser._id}`)  
        }

    }catch(e){
        error.push('Neslo nahrat fotku')
    }
}
exports.role = async ( req, res ) => {
    console.log(req.body)
    try{
        const updatedUser = await User.findOneAndUpdate({_id: req.body.id}, {$set:{
            role:req.body.role
        }},{new: true},)
        return res.json(updatedUser)
    }catch(e){
        throw new Error(e)
    }  
}



