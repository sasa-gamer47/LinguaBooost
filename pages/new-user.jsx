import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const newUser = () => {
  const { data: session, status } = useSession();
  // console.log(session);
  // console.log(status);
  const router = useRouter();

  const inputStyle =
    "px-5 py-1 rounded-full bg-white outline-none w-7/12 shadow-inner primary-theme light";
  const textareaStyle = "shadow-inner px-2 py-1 bg-white outline-none w-7/12 rounded-sm primary-theme light";
  const labelStyle = "font-semibold text-2xl";

  async function getUserByEmail(email) {
    const res = await fetch(`http://localhost:3000/api/user/email/${email}`);
    const data = await res.json();

    return data.data[0];
  }

  useEffect(() => {
    if (status === "authenticated") {
      async function getUser() {
        const user = await getUserByEmail(session.user.email);
        if (user.hasCompletedLogin) {
          router.push("/");
        }
      }
      getUser();
    }
  }, [status]);

  const finishLogin = async (e) => {
    if (status === "authenticated") {
      e.preventDefault();
      // console.log(e)

      const name = e.target[0].value;
      const surname = e.target[1].value;
      const bio = e.target[2].value;

      // console.log(name, surname, youtubeChannelUrl, bio, hobby)

      const user = {
        name: session.user.name,
        image: session.user.image,
        email: session.user.email,
        realName: name,
        surname,
        bio,
        hasCompletedLogin: true,
      };

      const data = await getUserByEmail(session.user.email);

      // console.log(data)

      const res = await fetch(`http://localhost:3000/api/user/${data._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      setTimeout(() => router.push("/"), 100);

      // console.log(user)
    }
  };

  return (
    <>
      <div className="absolute primary-theme light w-full top-20 bottom-0"></div>
      <div className="absolute inset-5 sm:inset-24 sm:top-28 selection:text-white drop-shadow-xl primary-theme sm:grid sm:grid-cols-2">
        <div className="sm:w-full w-0 primary-theme dark"></div>
        <form
          className="w-full h-full flex flex-col items-center justify-around"
          onSubmit={(e) => finishLogin(e)}
        >
          <label htmlFor="name" className={labelStyle}>
            Nome
          </label>
          <input
            type="text"
            name="name"
            placeholder="Inserisci il tuo nome"
            className={inputStyle}
          />
          <label htmlFor="surname" className={labelStyle}>
            Cognome
          </label>
          <input
            type="text"
            name="surname"
            placeholder="Inserisci il tuo cognome"
            className={inputStyle}
          />
          <label htmlFor="bio" className={labelStyle}>
            Bio
          </label>
          <textarea
            name="bio"
            placeholder="Descriviti un po'..."
            className={textareaStyle}
          />
          <input
            type="submit"
            value="Termina il login"
            className="drop-shadow-xl px-5 py-1 rounded-full primary-theme light font-semibold text-white cursor-pointer transition duration-300 hover:-translate-y-1 text-lg mt-5"
          />
        </form>
      </div>
    </>
  );
};

export default newUser;
