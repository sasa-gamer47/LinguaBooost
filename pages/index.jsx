import { useState, useEffect } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import { useSession, signOut } from "next-auth/react";

const Home = () => {

  const { data: session, status } = useSession();
  const [user, setUser] = useState(null)

  async function getUserByEmail(email) {
        const res = await fetch(`api/user/email/${email}`);
        const data = await res.json();

        return data.data[0];
  }
  
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

  return (
    <div className="w-full h-full m-0 p-0">
      <div className='absolute bottom-10 right-10 w-20 h-20 text-7xl drop-shadow-lg font-extrabold flex items-center justify-center cursor-pointer primary-theme btn rounded-full'>+</div>
    </div>
  )
}

export default Home

