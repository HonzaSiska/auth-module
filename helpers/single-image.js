const multer = require('multer')
const moment = require('moment')
const path = require('path')
const storage = multer.diskStorage({
    limits: {
        fileSize: 1000000
    },
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/avatar')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)

        //cb(null, file.originalname)
        
    }
})
const fileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){  
        cb(new Error('Files have to have jpeg, jpg or png extension'))
    }
    cb(undefined, true)
}

const upload = multer({ storage, fileFilter })

module.exports = { upload }