
export default function ImageCard({children, imgSrc, ...props}) {
    return (
        <div {...props} className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl shadow-xl group cursor-pointer border border-secondary-100">
            {imgSrc ? (
                <img src={imgSrc} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
            ) : (
                <div className="w-full h-full bg-linear-to-br from-primary-600 to-secondary-900 flex flex-col items-center justify-center p-6 text-center">
                   <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 transform group-hover:rotate-12 transition-transform duration-500">
                       <span className="text-4xl text-white"></span>
                   </div>
                   <span className="text-white/40 text-xl font-display font-bold tracking-wider uppercase">RentArena</span>
                </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 flex items-end p-6">
                <div className="text-white w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {children}
                </div>
            </div>
        </div>
    )
}