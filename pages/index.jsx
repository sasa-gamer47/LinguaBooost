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
  
  if (user) {
    console.log({
      createdBy: user._id,
      createdAt: new Date(),
      questions: [
        {
          question: "Quanto fa 1 + 1",
          answers: [1, 2, 3, 4],
          correctAnswers: 1,
          answerType: "singleSelection",
        },
      ],
      usersWhoPlayed: ["63c3d2058bc04ccefe54b1f7"],
      results: [
        {
          user: "63c3d2058bc04ccefe54b1f7",
          answersGiven: 1,
          questionsCount: 1,
          correctAnswersCount: 0,
          correctAnswersPercentage: 0,
          corrections: [
            {
              question: "Quanto fa 1 + 1",
              answer: 2,
            },
          ],
        },
      ],
    });
  }

  return (
    <div className="w-full h-full m-0 p-0">
      {user && user.isAdmin && (
          <div className='absolute bottom-10 right-10 w-20 h-20 text-7xl drop-shadow-lg font-extrabold flex items-center justify-center cursor-pointer primary-theme btn rounded-full z-40'>+</div>
      )}
      {/* <div className='fixed top-24 bottom-10 left-5 right-5 rounded-lg drop-shadow-lg sm:left-1/4 sm:right-1/4 primary-theme z-40'></div> */}
    </div>
  )
}

export default Home

