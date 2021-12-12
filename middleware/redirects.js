const redirectLogin = (req,res, next) => {
    if(!req.session.userId){
        res.redirect('/user/login')
    }else{
        next()
    }
}

const redirectDashboard = (req, res, next) => {
    if(req.session.userId){
        res.redirect('/user/dashboard')
    }else{
        next()
    }
}
 const notAdminRedirectHome = (req, res, next) => {
    if(req.session.role !== 'admin'){
        console.log('session urole', req.session.role)
        res.redirect('/')
    }else{
        next()
    }
 }
 const notAuthorizedUserRedirect = (req, res, next) => {
    if(req.session.userId !== req.params.id){
        console.log('session user Id', req.session.userId)
        console.log('user param Id', req.param.id)
        return res.status(403).send('Forbidden')
    }else{
        next()
    }
 }
 const notAuthorizedPasswordChange = (req, res, next) => {
    if(req.session.userId !== req.body.id){
        console.log('session user Id', req.session.userId)
        console.log('user param Id', req.body.id)
        return res.status(403).send('Forbidden')
    }else{
        next()
    }
 }

 const notAuthorizedUserUpdateRedirect = (req, res, next) => {
    if(req.session.userId !== req.body.userId){
        console.log('session user Id', req.session.userId)
        console.log('user bodu userId', req.body.userId)
        return res.status(403).send('Forbidden')
    }else{
        next()
    }
 }

 const notAuthorizedUserOrAdmin = (req, res, next) => {
    if(req.session.role !== 'admin' && req.query.id === req.session.userId){
        console.log('role1:',req.session.role)
        console.log('sessionuserID:',req.session.userId)
        console.log('reqqueryuserID:',req.query.id)
        next()
    }else if(req.session.role === 'admin' && req.query.id !== req.session.userId){
        console.log('role2:',req.session.role)
        console.log('sessionuserID:',req.session.userId)
        console.log('reqqueryuserID:',req.query.id)
        next()
    }else if(req.session.role === 'admin' && req.query.id === req.session.userId){
        console.log('role3:',req.session.role)
        console.log('sessionuserID:',req.session.userId)
        console.log('reqqueryuserID:',req.query.id)
        next()
    }else{
        console.log('role4:',req.session.role)
        console.log('sessionuserID:',req.session.userId)
        console.log('reqqueryuserID:',req.query.id)
        
        return res.status(403).send('Forbidden')
    }
    
    
 }

module.exports = {
    redirectLogin, 
    redirectDashboard, 
    notAdminRedirectHome,
    notAuthorizedUserRedirect,
    notAuthorizedUserUpdateRedirect, 
    notAuthorizedUserOrAdmin, notAuthorizedPasswordChange
}