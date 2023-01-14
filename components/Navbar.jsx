import React, { useRef, useState } from 'react'
import Image from 'next/image'
import icon from '../img/icon.png'

const Navbar = () => {

    const burger = useRef(null)
    const [isActive, setIsActive] = useState(false);

    return (
        <div className='w-full h-20 bg-sky-400 drop-shadow-lg relative flex items-center'>
            <div className=' w-1/12 h-full flex justify-center items-center relative'>
                <button className={`burger-button ${isActive ? 'is-active': ''}`} onClick={() => setIsActive(!isActive)}>
                    <span className="burger-line"></span>
                    <span className="burger-line"></span>
                    <span className="burger-line"></span>
                </button>

            </div>
            <div className='w-1/12 h-full flex justify-center items-center'>
                <div className='relative w-full h-4/6'>
                    <Image src={icon} fill='responsive' className='drop-shadow-lg' />
                </div>
            </div>
        </div>
    )
}

export default Navbar