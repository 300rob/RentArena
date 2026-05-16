const Header = ({title, subtitle}) => {
    return (
        <div className='mb-8'>
            <h1 className='text-3xl md:text-4xl font-bold text-black p-3 mb-2'>
                {title}
            </h1>
            {subtitle && (
                <p className='text-gray-600 text-lg p-3'>
                    {subtitle}
                </p>
            )}
        </div>
    )
}
export default Header