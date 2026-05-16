const Place = require('../models/Place')
const User = require('../models/User')
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes');
const BadRequest = require('../errors/bad-request');
const cloudinary = require('../utils/cloudinary')

const createRequest = async (req, res) => {
  const { fullName, email, phoneNumber, placeName, placeAddress, category, price, proofOfOwnership,
    description, placePhoto, agreeToTerms, status } = req.body;
  const userId = req.user.userId;

  if(!fullName || !email || !phoneNumber || !placeName || !placeAddress || !category || !price || !description) {
    throw new CustomError.BadRequestError('Please provide all required values')
  }
  
  if(fullName.length < 3) {
    throw new CustomError.BadRequestError('Full name must be at least 3 characters')
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailRegex.test(email)) {
    throw new CustomError.BadRequestError('Please provide a valid email')
  }
  
  const phoneRegex = /^[0-9\-\+\(\)]{8,}$/;
  if(!phoneRegex.test(phoneNumber.toString())) {
    throw new CustomError.BadRequestError('Please provide a valid phone number')
  }
  
  if(placeName.length < 3 || placeName.length > 50) {
    throw new CustomError.BadRequestError('Place name must be between 3 and 50 characters')
  }
  
  if(placeAddress.length < 5) {
    throw new CustomError.BadRequestError('Please provide a complete address')
  }
  
  const validCategories = ['mini-footbal-pitches', 'basketball-courts', 'tenis-courts'];
  if(!validCategories.includes(category)) {
    throw new CustomError.BadRequestError('Invalid category')
  }
  
  if(isNaN(price) || price <= 0) {
    throw new CustomError.BadRequestError('Price must be a positive number')
  }
  
  if(description.length < 10 || description.length > 250) {
    throw new CustomError.BadRequestError('Description must be between 10 and 250 characters')
  }
  
  if(!agreeToTerms) {
    throw new CustomError.BadRequestError('You must agree to the terms')
  }

  const place = await Place.create({
    fullName,
    email,
    phoneNumber,
    placeName,
    placeAddress,
    category,
    price,
    proofOfOwnership,
    placePhoto,
    description,
    agreeToTerms,
    status,
    sentBy: userId,
  });
  await place.save();
  res.status(StatusCodes.CREATED).json({ place });
}
const getAllRequests = async (req, res) => {
  const applies = await Place.find({});
  res.status(StatusCodes.OK).json({ applies })
}
const deletePlaces = async (req, res) => {
  const places = await Place.findById(req.params.id)
  if (!places) {
    throw new CustomError.UnauthenticatedError('No place with this id')
  }
  await Place.findByIdAndDelete(req.params.id)
  res.status(StatusCodes.OK).status('Place is deleted')
}

const deleteRequests = async (req, res) => {
  const applies = await Place.findById(req.params.id)
  if (!applies) {
    throw new CustomError.BadRequestError("No place with this id")
  }
  if (applies.proofOfOwnership) {
    const publicId = applies.proofOfOwnership.split('/').slice(7,).join('/').replace(/\.[^/.]+$/, "");
    console.log('place ', publicId)
    try {
      await cloudinary.uploader.destroy(publicId)

    } catch (error) {
      console.log('error')
    }
  }

  if (applies.placePhoto && applies.placePhoto.length > 0) {
    for (const photo of applies.placePhoto) {
      const publicId = photo.split('/').slice(7,).join('/').replace(/\.[^/.]+$/, "");
      console.log('place photo', publicId)
      try {
        await cloudinary.uploader.destroy(publicId)
      } catch (error) {
        console.log('error')
      }
    }
  }
  await Place.findByIdAndDelete(req.params.id)
  res.status(StatusCodes.OK).send('Request is deleted')
}

const fetchByCategory = async (req, res) => {
  const { category } = req.params;
  const acceptReq = await Place.find({ category })

  res.status(StatusCodes.CREATED).json({ acceptReq });
}

const fetchRequestById = async (req, res) => {
  const { applyId } = req.params;
  const acceptReq = await Place.find({ _id: applyId }).populate("sentBy", "name email profilePic")
  res.status(StatusCodes.OK).json({ acceptReq })
}
const acceptRequest = async (req, res) => {
  const { requestId } = req.params;

  const acceptReq = await Place.findById(requestId)
  if (!acceptReq) {
    throw new CustomError.BadRequestError('No request with this id')
  }

  acceptReq.status = 'approved';
  await acceptReq.save();

  const applicant = await User.findById(acceptReq.sentBy);
  if (applicant && applicant.role === "user") {
    applicant.role = "owner";
    await applicant.save();
  }
  res.status(StatusCodes.OK).json({ acceptReq })
}

const getRequestsByStatus = async (req, res) => {
  const { status } = req.params;
  const { category } = req.params;
  console.log(category)
  const applies = await Place.find({ status, category })
  console.log("Applies controller ", applies)
  console.log("Category controller", category)
  res.status(StatusCodes.OK).json({ applies })
}

const fetchPlacesbyUserId = async (req, res) => {
  const userId = req.user.userId;
  console.log('Userid', userId)
  const places = await Place.find({ sentBy: userId })
  res.status(StatusCodes.OK).json({ places })
}


module.exports = {
  createRequest,
  getAllRequests,
  deleteRequests,
  fetchByCategory,
  fetchRequestById,
  acceptRequest,
  getRequestsByStatus,
  fetchPlacesbyUserId,
  deletePlaces,
}