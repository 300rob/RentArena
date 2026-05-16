const path = require('path')
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes');
const fs = require('fs')
const multer = require('../middleware/multer')
const cloudinary = require('../utils/cloudinary')

const uploadPlaceImage = async(req,res) => {
    try {
        const file = req.file
        if(!file) {
            throw new CustomError.BadRequestError('No file uploaded')
        }
        const result = await cloudinary.uploader.upload(file.path, {
                 folder: 'uploads',
                use_filename: true,
                unique_filename: true
        })
            fs.unlinkSync(file.path)
        
        res.status(StatusCodes.OK).json({url: result.secure_url})
    } catch (error) {
        console.log(error)
    }
}
const uploadMultipleImages = async(req,res) => {
    try {
        const files = req.files;
        console.log(req.files)

        if(!files || !files.length === 0) {
            throw new CustomError.BadRequestError('No files uploaded')
        }
        const uploadedUrls = [];
        for(const file of files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'uploads',
                use_filename: true,
                unique_filename: true
            });
            uploadedUrls.push(result.secure_url);
            fs.unlinkSync(file.path)
        }
        res.status(StatusCodes.OK).json({urls: uploadedUrls})
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    uploadPlaceImage,
    uploadMultipleImages,
}