import React, { useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { setCookies } from "cookies-next";
import loginBg from '../img/loginBg.png'
import Image from 'next/image'

const login = (
    {
        /*pageVisited*/
    }
    ) => {
    const { data: session, status } = useSession();
    // console.log(session);
    // console.log(status);
    const router = useRouter();

  // useEffect(() => {
  //     if (!pageVisited) {
  //         setCookies("pageVisited", true);
  //     }
  // }, []);

    useEffect(() => {
        if (status === "authenticated") {
        // set mongodb connection and saving account, set a variable "isFirstTime", if yes then set bio, channel name,... else redirect the user
        // should e able to do such a thing with the fetch, passing the session (account) infos.
        // if (!pageVisited) {
        //     router.push('/new-user')
        // } else {
        //     router.push('/')
        // }

        router.push("/");
        }
    }, [status]);

    return (
        <div className="absolute flex justify-center items-center primary-theme light w-full top-20 bottom-0">
            <div className="sm:w-7/12 w-9/12 h-96 drop-shadow-xl primary-theme sm:grid sm:grid-cols-2 rounded-lg overflow-hidden">
                <div className="sm:w-full w-0 primary-theme dark relative">
                    <div className="h-full w-full absolute">
                        <Image alt="" src={loginBg} fill='resize' />
                    </div>
            </div>
            <div className="w-full h-full flex flex-col items-center justify-around">
                <button
                onClick={() => signIn()}
                className="primary-theme light px-8 text-4xl font-bold drop-shadow-lg py-2 rounded-full transition duration-300 hover:-translate-y-1"
                >
                <div className="flex items-center drop-shadow-lg">
                    <p className="text-blue-500">G</p>
                    <p className="text-red-500">o</p>
                    <p className="text-yellow-500">o</p>
                    <p className="text-blue-500">g</p>
                    <p className="text-green-500">l</p>
                    <p className="text-red-500">e</p>
                </div>
                </button>
            </div>
            </div>
        </div>
    );
    };

// export const getServerSideProps = async (ctx) => {
//     const { pageVisited } = ctx.req.cookies;

//     return { props: { pageVisited: pageVisited ?? null } };
// };

export default login;
