import React, { useRef, useState, useEffect, use } from 'react'
import Image from 'next/image'
import { useSession, signOut } from "next-auth/react";
import icon from '../img/icon.png'
import { useRouter } from 'next/router';

const Navbar = () => {
    const [isMobile, setIsMobile] = useState(false)
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null)
    const [showDropdown, setShowDropdown] = useState(false)
    const [showSidebar, setShowSidebar] = useState(false)

    function isMobileFunction() {
        if (typeof window !== "undefined")
            window.addEventListener('resize', () => {
                window.innerWidth <= 768 ? setIsMobile(true) : setIsMobile(false)
        })
    }

    async function getUserByEmail(email) {
        const res = await fetch(`api/user/email/${email}`);
        const data = await res.json();

        return data.data[0];
    }

    useEffect(() => {
        isMobileFunction()
    }, [])

    useEffect(() => {
        if (user) {
            if (!user.hasCompletedLogin) {
                router.push('/new-user')
            }
        }
    }, [user])

    useEffect(() => {
        if (status === "authenticated") {
            async function getUser() {
            const user = await getUserByEmail(session.user.email);
            // console.log(user);
            setUser(user);
            }
            getUser();
        }
    }, [status]);

    const burger = useRef(null)
    const [isActive, setIsActive] = useState(false);
    const router = useRouter()

    return (
        <nav>
            <div className='navbar z-50 w-full h-20 primary-theme drop-shadow-lg relative grid items-center'>
                <div className='w-full h-full flex justify-center items-center relative'>
                    <button className={`burger-button ${isActive ? 'is-active' : ''}`} onClick={() => { setIsActive(!isActive); setShowSidebar(!showSidebar) }}>
                        <span className="burger-line"></span>
                        <span className="burger-line"></span>
                        <span className="burger-line"></span>
                    </button>

                </div>
                <div className='w-full h-full flex justify-center items-center'>
                    <div className='relative w-full h-4/6'>
                        <Image alt='logo' src={icon} fill='responsive' className='drop-shadow-lg' />
                    </div>
                </div>
                {!isMobile && (
                    <>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </>
                )}
                <div className='w-full h-full relative flex justify-center items-center'>
                    <div onClick={() => setShowDropdown(!showDropdown)} className='absolute w-16 h-16 rounded-full overflow-hidden cursor-pointer transition duration-300'>
                        {session && (
                            <Image src={session.user.image} alt='user logo' fill='responsive' />
                        )}
                    </div>
                    {showDropdown && (
                        <div className='w-full primary-theme top-20 right-0 absolute flex flex-col justify-center items-center gap-y-2 font-semibold text-lg cursor-pointer'>
                            <div className='primary-theme btn w-full h-full text-center'>Profilo</div>
                            <div className='primary-theme btn w-full h-full text-center'>Impostazioni</div>
                            <div className='primary-theme btn w-full h-full text-center'>Tutorial</div>
                            <div onClick={() => signOut()} className='primary-theme btn w-full h-full text-center'>Log Out</div>                            
                        </div>

                    )}
                </div>
            </div>
            <div className={`${showSidebar ? '' : 'translate'} absolute primary-theme top-20 bottom-0 w-3/12 flex flex-col items-center justify-center text-center`}>
                <div className='w-full h-full primary-theme btn flex items-center justify-center font-bold text-3xl'>Dashboard</div>
            </div>    
        </nav>
    )
}

export default Navbar