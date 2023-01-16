import React, { useEffect, useState, useRef } from 'react'
import { useSession } from "next-auth/react";

const quiz = ({ quizId }) => {
    // console.log('quizId: ', quizId);
    const [quiz, setQuiz] = useState(null)
    const [givenAnswers, setGivenAnswers] = useState([])
    const [quizFinished, setQuizFinished] = useState(false)
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0)
    const quizRef = useRef(null)
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
    const [usersWhoPlayed, setUsersWhoPlayed] = useState([])
    const [corrections, setCorrections] = useState([])

    async function getQuiz() {
        const res = await fetch(`/api/quiz/${quizId}`)

        const quiz = await res.json()

        setQuiz(quiz.data)
    }

    useEffect(() => {
        getQuiz()
    }, [])

    async function getUserByEmail(email) {
        const res = await fetch(`/api/user/email/${email}`);
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

    useEffect(() => {
        if (quiz) {
            setUsersWhoPlayed(quiz.usersWhoPlayed)
        }
    }, [quiz])

    // useEffect(() => {
    //     console.log('corrstate', corrections);
    //     setCorrections(corrections)
    // }, [corrections])


    return (
        <div>
            <div ref={quizRef} className='w-full flex flex-col mt-10 items-center justify-center gap-y-8'>
                {quiz && user && quiz.questions.map((question, index) => {
                    return (
                        <div key={index} className='w-11/12 rounded-lg drop-shadow-lg primary-theme flex flex-col items-center justify-center'>
                            <div className='text-3xl font-bold text-center'>{question.question}</div>
                            <div className='primary-theme p-4 dark h-full w-11/12 mt-4 grid grid-cols-2 grid-rows-2 gap-3 gap-y-4 rounded-lg mb-8'>
                                {question.answers.map((answer, index) => {
                                    return (
                                        <div key={index} onClick={(e) => {
                                            if (!quizFinished) {
                                                if (givenAnswers.find(answers => answers.question == question.question)) {
                                                    const currentIndex = givenAnswers.indexOf(givenAnswers.find(answers => answers.question == question.question))
                                                    givenAnswers[currentIndex].selectedAnswer = e.target.textContent
                                                } else {
                                                    setGivenAnswers([...givenAnswers, { question: question.question, selectedAnswer: e.target.textContent, correctAnswer: question.correctAnswer }])
                                                }
                                                e.target.parentElement.childNodes.forEach(answer => {
                                                    answer.classList.remove('answered')
                                                })
                                                e.target.classList.add('answered')

                                            }
                                        }} className='w-full h-full primary-theme btn p-2 px-4 rounded-lg drop-shadow-lg font-semibold text-xl text-center'>{answer}</div>
                                    )
                                })}
                            </div>
                        </div>
                        )
                })}
                <div onClick={() => {
                    if (givenAnswers.length === quiz.questions.length) {
                        const tempCorrections = [];
                        setQuizFinished(true);

                        console.log(givenAnswers);
                        givenAnswers.map((answer, index) => {
                            const correct = answer.selectedAnswer == answer.correctAnswer;

                            if (!correct) {
                                tempCorrections.push({ question: answer.question, correctAnswer: answer.correctAnswer, selectedAnswer: answer.selectedAnswer })
                            }


                            correct
                            ? setCorrectAnswersCount((prevState) => prevState + 1)
                            : "";

                            quizRef.current.childNodes[index].childNodes[1].childNodes.forEach((answerElement) => {
                            if (
                                answerElement.textContent == answer.correctAnswer
                            ) {
                                answerElement.classList.remove("answered");
                                answerElement.classList.add("correct");
                            } else {
                                answerElement.classList.remove("answered");
                                if (!correct) {
                                answerElement.classList.add("wrong");
                                }
                            }
                            });

                            // if (correct) {
                            //     quizRef.current.childNodes[index].classList.add('correct')
                            // } else {
                                //     quizRef.current.childNodes[index].classList.add('wrong')
                                // }
                        });
                        
                        // console.log(tempCorrections);
                        setCorrections([...corrections, ...tempCorrections])
                            // console.log('corrections: ', corrections);
                            // console.log('user found');

                        if(quiz.results.find(result => result.user == user._id)) {
                                const currentIndex = quiz.results.find(result => result.user == user._id)
                                quiz.results.splice(currentIndex, 1)
                            }
                        
                        if (usersWhoPlayed.indexOf(user._id) >= 0) {
                            async function updateQuizResults() {
                                const res = await fetch(`/api/quiz/${quizId}`, {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },

                                    
                                
                                    body: JSON.stringify({
                                        results: [...quiz.results, {
                                            user: user._id,
                                            questionsCount: quiz.questions.length,
                                            correctAnswersCount: quiz.questions.length - tempCorrections.length,
                                            correctAnswersPercentage: ((quiz.questions.length - tempCorrections.length) / quiz.questions.length * 100).toFixed(2),
                                            corrections: tempCorrections,
                                        }],
                                        usersWhoPlayed,
                                    }),
                                });
                                
                            }
                            
                            updateQuizResults()

                        } else {
                            async function updateQuizResults() {
                                const res = await fetch(`/api/quiz/${quizId}`, {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        results: [...quiz.results, {
                                            user: user._id,
                                            questionsCount: quiz.questions.length,
                                            correctAnswersCount: quiz.questions.length - tempCorrections.length,
                                            correctAnswersPercentage: ((quiz.questions.length - tempCorrections.length) / quiz.questions.length * 100).toFixed(2),
                                            corrections: tempCorrections,
                                        }],
                                        usersWhoPlayed: [...usersWhoPlayed, user._id]
                                    }),
                                });
                                
                            }
                        
                            updateQuizResults()
                        }
                    } else {
                        alert("Devi rispondere a tutte le domande per terminare il quiz");
                    }
                }} className='primary-theme btn drop-shadow-lg p-4 py-2 font-bold text-2xl rounded-lg mt-5 mb-4'>
                    {user && (
                        <>
                            {usersWhoPlayed.indexOf(user._id) >= 0 ? 'Ripeti il quiz' : 'Termina il quiz'}
                        </>
                    )}
                </div>
                {quizFinished && (
                    <div className='primary-theme w-11/12 p-2 mb-4 rounded-lg'>
                        <div className='text-xl font-semibold text-center'>Percentuale risposte corrette: {(correctAnswersCount / quiz.questions.length * 100).toFixed(2)}%</div>
                        <div className='text-xl font-semibold text-center'> Domande totali: {quiz.questions.length}</div>
                        {/* <div className='text-xl font-semibold text-center'> Risposte totali: {givenAnswers.length}</div> */}
                        <div className='text-xl font-semibold text-center'>  Risposte corrette: {correctAnswersCount}</div>
                        <p className='text-center'>Le risposte segnate in verde sono quelle corrette, ove presenti risposnte in rosso significa che la domanda è stata sbagliata.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export async function getServerSideProps(context) {
    // console.log('ctx', context.params.quiz);
    return {
        props: {
            quizId: context.params.quiz,
        },
    };
}

export default quiz