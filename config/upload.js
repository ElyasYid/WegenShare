const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const basename = path.basename(file.originalname, ext)
        cb(null, `${basename}-${Date.now()}${ext}`)
    }
})

const upload = multer({ storage })

module.exports = upload
