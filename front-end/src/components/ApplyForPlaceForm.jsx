import { useState } from "react";
import { useApplyStore } from "../stores/usePlaceStore";
import { Loader, PlusCircle, AlertCircle } from "lucide-react";
import { applySchema } from "../lib/validation";
import toast from "react-hot-toast";

const ApplyForPlaceForm = () => {
    const [addNewApply, setAddNewApply] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        placeName: "",
        placeAddress: "",
        category: "",
        price: "",
        proofOfOwnership: "",
        description: "",
        agreeToTerms: false,
    });
    const [files, setFiles] = useState([]);
    const [errors, setErrors] = useState({});

    const categories = [
        { id: 1, name: "mini-footbal-pitches" },
        { id: 2, name: "basketball-courts" },
        { id: 3, name: "tenis-courts" },
    ];

    const { createApply, loading, uploadImages, uploadImage } = useApplyStore();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAddNewApply(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const result = applySchema.safeParse(addNewApply);
        if (!result.success) {
            const formattedErrors = {};
            result.error.issues.forEach((issue) => {
                formattedErrors[issue.path[0]] = issue.message;
            });
            setErrors(formattedErrors);
            toast.error("Please fix the errors in the form");
            return;
        }

        if (!addNewApply.proofOfOwnership) {
            toast.error("Please upload proof of ownership");
            return;
        }

        try {
            let uploadedUrls = [];
            if (files.length > 0) {
                uploadedUrls = await uploadImages(files);
            }
            const applyData = {
                ...addNewApply,
                placePhoto: uploadedUrls,
            };
            await createApply(applyData);

            setAddNewApply({
                fullName: "",
                email: "",
                phoneNumber: "",
                placeName: "",
                placeAddress: "",
                category: "",
                price: "",
                proofOfOwnership: "",
                description: "",
                agreeToTerms: false,
            });
            setFiles([]);
            setErrors({});
        } catch (error) {
            console.log(error);
        }
    };

    const handleImageChangeforPOO = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const uploadedUrls = await uploadImage(file);
            if (uploadedUrls && uploadedUrls.length > 0) {
                setAddNewApply({
                    ...addNewApply,
                    proofOfOwnership: uploadedUrls[0],
                });
            }
        } catch (error) {
            console.log(error);
        }
    };

    const inputClasses = (name) => `w-full px-4 py-2 border-2 ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:border-black focus:outline-none transition text-gray-700`;
    const labelClasses = 'block text-black font-semibold mb-2';

    return (
        <div className='min-h-screen bg-white py-12 px-4'>
            <div className='max-w-2xl mx-auto bg-white border-2 border-gray-300 rounded-lg p-8 shadow-sm'>
                <h2 className="text-4xl font-bold text-black mb-8 text-center">Submit Your Facility</h2>

                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div>
                        <label htmlFor="fullName" className={labelClasses}>Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={addNewApply.fullName}
                            onChange={handleChange}
                            className={inputClasses('fullName')}
                            placeholder='Enter your full name'
                        />
                        {errors.fullName && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.fullName}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className={labelClasses}>Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={addNewApply.email}
                            onChange={handleChange}
                            className={inputClasses('email')}
                            placeholder='Enter your email'
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="phoneNumber" className={labelClasses}>Phone Number</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={addNewApply.phoneNumber}
                            onChange={handleChange}
                            className={inputClasses('phoneNumber')}
                            placeholder='Enter your phone number'
                        />
                        {errors.phoneNumber && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.phoneNumber}</p>}
                    </div>


                    <div>
                        <label htmlFor="placeName" className={labelClasses}>Facility Name</label>
                        <input
                            type="text"
                            id="placeName"
                            name="placeName"
                            value={addNewApply.placeName}
                            onChange={handleChange}
                            className={inputClasses('placeName')}
                            placeholder='e.g., Downtown Sports Complex'
                        />
                        {errors.placeName && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.placeName}</p>}
                    </div>


                    <div>
                        <label htmlFor="placeAddress" className={labelClasses}>Address</label>
                        <input
                            type="text"
                            id="placeAddress"
                            name="placeAddress"
                            value={addNewApply.placeAddress}
                            onChange={handleChange}
                            className={inputClasses('placeAddress')}
                            placeholder='Enter facility address'
                        />
                        {errors.placeAddress && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.placeAddress}</p>}
                    </div>


                    <div>
                        <label htmlFor="description" className={labelClasses}>Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={addNewApply.description}
                            onChange={handleChange}
                            className={inputClasses('description') + ' min-h-24 resize-none'}
                            placeholder='Describe your facility features, amenities, etc.'
                        />
                        {errors.description && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.description}</p>}
                    </div>


                    <div>
                        <label htmlFor="category" className={labelClasses}>Facility Type</label>
                        <select
                            id="category"
                            name="category"
                            value={addNewApply.category}
                            onChange={handleChange}
                            className={inputClasses('category')}
                        >
                            <option value=''>Select a Facility Type</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.name}>{category.name}</option>
                            ))}
                        </select>
                        {errors.category && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.category}</p>}
                    </div>


                    <div>
                        <label htmlFor="price" className={labelClasses}>Price ($ per hour)</label>
                        <input
                            type="text"
                            id="price"
                            name="price"
                            value={addNewApply.price}
                            onChange={handleChange}
                            className={inputClasses('price')}
                            placeholder='0.00'
                        />
                        {errors.price && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.price}</p>}
                    </div>


                    <div>
                        <label htmlFor="placePhoto" className={labelClasses}>Facility Photos</label>
                        <input
                            type="file"
                            id="placePhoto"
                            accept="image/*"
                            multiple
                            onChange={(e) => setFiles(Array.from(e.target.files))}
                            className={inputClasses('placePhoto')}
                        />
                        {files.length > 0 && <p className='text-green-600 text-sm mt-2 font-bold'>{files.length} image(s) selected</p>}
                    </div>


                    <div>
                        <label htmlFor="proofOfOwnership" className={labelClasses}>Proof of Ownership</label>
                        <input
                            type="file"
                            id="proofOfOwnership"
                            accept="image/*"
                            onChange={handleImageChangeforPOO}
                            className={inputClasses('proofOfOwnership')}
                        />
                        {addNewApply.proofOfOwnership && <p className='text-green-600 text-sm mt-2 font-bold'>Document uploaded</p>}
                    </div>


                    <div className='py-2'>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="agreeToTerms"
                                name="agreeToTerms"
                                checked={addNewApply.agreeToTerms}
                                onChange={handleChange}
                                className='w-4 h-4 cursor-pointer'
                            />
                            <label htmlFor="agreeToTerms" className='text-gray-700 cursor-pointer font-medium'>
                                I agree to the terms and conditions
                            </label>
                        </div>
                        {errors.agreeToTerms && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.agreeToTerms}</p>}
                    </div>


                    <button
                        type="submit"
                        disabled={loading}
                        className='w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition flex items-center justify-center gap-2 mt-8'
                    >
                        {loading ? (
                            <>
                                <Loader size={20} className='animate-spin' />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <PlusCircle size={20} />
                                Submit Facility
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ApplyForPlaceForm;