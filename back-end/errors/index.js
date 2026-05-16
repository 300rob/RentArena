const CustomAPIError = require('./custom-error')
const BadRequestError = require('./bad-request')
const UnauthenticatedError = require('./unauthenticated')
const UnauthorizedError = require('./unauthorized')
module.exports = {
    CustomAPIError,
    BadRequestError,
    UnauthenticatedError,
    UnauthorizedError
}