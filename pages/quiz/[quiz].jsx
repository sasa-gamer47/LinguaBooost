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
    const [currentQuestion, setCurrentQuestion] = useState(null)
    const [previousQuestion, setPreviousQuestion] = useState(null)
    // let currentSelectedAnswers = []
    const [currentSelectedAnswers, setCurrentSelectedAnswers] = useState([]);
    const [tempSelectedAnswers, setTempSelectedAnswers] = useState([]);
    const [tempCorrectAnswersCount, setTempCorrectAnswersCount] = useState(0)

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

    useEffect(() => {
        // console.log('current: ', currentQuestion);
        // console.log('previous: ', previousQuestion);

        if (currentQuestion !== previousQuestion) {
            // console.log('resetted');
            setPreviousQuestion(currentQuestion)
        } else {
            setTempSelectedAnswers([])
            

        }
        // currentSelectedAnswers = []
    }, [currentQuestion])

    useEffect(() => {
        // console.log('answers: ', tempSelectedAnswers);
        setCurrentSelectedAnswers(tempSelectedAnswers)
    }, [tempSelectedAnswers])


    return (
        <div>
            <div ref={quizRef} className='w-full flex flex-col mt-10 items-center justify-center gap-y-8'>
                {quiz && user && quiz.questions.map((question, indexKey) => {
                    return (
                        <div key={indexKey} className='w-11/12 rounded-lg drop-shadow-lg primary-theme flex flex-col items-center justify-center'>
                            <div className='text-3xl font-bold text-center'>{question.question}</div>
                            <div className='primary-theme p-4 dark h-full w-11/12 mt-4 grid grid-cols-2 grid-rows-2 gap-3 gap-y-4 rounded-lg mb-8'>
                                {question.answers.map((answer, index) => {
                                    return (
                                        <div key={index} onClick={(e) => {


                                            if (!quizFinished) {
                                                setCurrentQuestion(question.question)
                                                if (question.answerType === 'singleSelection') {
                                                    if (givenAnswers.find(answers => answers.question == question.question)) {
                                                        const currentIndex = givenAnswers.indexOf(givenAnswers.find(answers => answers.question == question.question))
                                                        givenAnswers[currentIndex].selectedAnswer = e.target.textContent
                                                    } else {
                                                        setGivenAnswers([...givenAnswers, { question: question.question, selectedAnswer: e.target.textContent, correctAnswer: question.correctAnswer, answerType: question.answerType, index: indexKey }])
                                                    }
                                                    e.target.parentElement.childNodes.forEach(answer => {
                                                        answer.classList.remove('answered')
                                                    })
                                                    e.target.classList.add('answered')
                                                } else if (question.answerType === 'multipleSelection') {
                                                    setCurrentSelectedAnswers(tempSelectedAnswers)
                                                    // console.log(currentSelectedAnswers.length, question.correctAnswers.length);
                                                    // console.log(currentSelectedAnswers.length >= question.correctAnswers.length);
                                                    
                                                    if (tempSelectedAnswers.length < question.correctAnswers.length) {
                                                        e.target.classList.add('answered')
                                                        // currentSelectedAnswers.push(e.target.textContent)
                                                        setTempSelectedAnswers([...tempSelectedAnswers, e.target.textContent])
                                                    } else {
                                                        if (e.target.classList.contains('answered')) {
                                                            e.target.classList.remove('answered')
                                                            // console.log('splicing');
                                                            // console.log(tempSelectedAnswers);
                                                            tempSelectedAnswers.splice(tempSelectedAnswers.indexOf(e.target.textContent), 1)
                                                            // console.log('splicing 1');
                                                            // console.log(tempSelectedAnswers);

                                                            // setTempSelectedAnswers([...tempSelectedAnswers, tempSelectedAnswers.splice(0, 1, e.target.textContent)])

                                                        }
                                                    }

                                                    if (givenAnswers.find(answers => answers.question == question.question)) {
                                                        const currentIndex = givenAnswers.indexOf(givenAnswers.find(answers => answers.question == question.question))
                                                        givenAnswers[currentIndex].selectedAnswers = [...tempSelectedAnswers, e.target.textContent]
                                                    } else {
                                                        setGivenAnswers([...givenAnswers, { question: question.question, selectedAnswers: [...tempSelectedAnswers, e.target.textContent], correctAnswers: question.correctAnswers, answerType: question.answerType, index: indexKey }])
                                                    }
                                                    
                                                    // console.log(tempSelectedAnswers);
                                                }

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
                            if (answer.answerType === 'singleSelection') {
                                

                                const correct = answer.selectedAnswer == answer.correctAnswer;

                                if (!correct) {
                                        tempCorrections.push({ question: answer.question, correctAnswer: answer.correctAnswer, selectedAnswer: answer.selectedAnswer, answerType: answer.answerType })
                                    
                                }


                                correct
                                    ? setCorrectAnswersCount((prevState) => prevState + 1)
                                    : "";

                                quizRef.current.childNodes[answer.index].childNodes[1].childNodes.forEach((answerElement) => {
                                    if (answerElement.textContent == answer.correctAnswer) {
                                        answerElement.classList.remove("answered");
                                        answerElement.classList.add("correct");
                                    } else {
                                        answerElement.classList.remove("answered");
                                        if (!correct) {
                                        answerElement.classList.add("wrong");
                                        }
                                    }
                                });
                            } else if (answer.answerType === 'multipleSelection') {
                                let isQuestionCorrect = false
                                let currentCorrectsAnswers = []
                                
                                

                                for (let index = 0; index < answer.selectedAnswers.length; index++) {
                                    const selectedAnswer = answer.selectedAnswers[index];
                                    
                                    answer.selectedAnswers.sort()
                                    answer.correctAnswers.sort()
                                    
                                    for (let i = 0; i < answer.correctAnswers.length; i++) {
                                        const correctAnswer = answer.correctAnswers[i];
                                        
                                        // console.log('1: ', answer.selectedAnswers);
                                        // console.log('2: ', answer.correctAnswers);
    
                                        const correct = selectedAnswer == correctAnswer
    
                                        // console.log(selectedAnswer, correctAnswer);
    
    
                                        if (correct) {
                                            // setTempCorrectAnswersCount(prevState => prevState + 1)
                                            // currentCorrectsAnswers.indexOf(correctAnswer) ? currentCorrectsAnswers.splice(currentCorrectsAnswers.indexOf(correctAnswer), 1) : ''
                                            currentCorrectsAnswers.push(correctAnswer)
                                            // console.log('updating');
                                        } else {
                                            // console.log('failed');
                                            // if (!tempCorrections.find(correction => correction.question == answer.question)) {
                                            //     tempCorrections.push({ question: answer.question, correctAnswers: answer.correctAnswers, selectedAnswer: answer.selectedAnswers, answerType: answer.answerType })

                                            // }
                                            // continue
                                        }
                                        // console.log('corrects: ', currentCorrectsAnswers);
                                        // console.log(tempCorrectAnswersCount);
    
                                        

                                    }

                                    if (currentCorrectsAnswers.length >= answer.selectedAnswers.length) {
                                        isQuestionCorrect = true
                                    }

                                    if (isQuestionCorrect) {
                                        // console.log('right');
                                        setCorrectAnswersCount((prevState) => prevState + 1)
                                    } else {
                                        // console.log('question wrong');
                                        

                                    }
                                    
                                }

                                for (let index = 0; index < answer.correctAnswers.length; index++) { 
                                    quizRef.current.childNodes[answer.index].childNodes[1].childNodes.forEach((answerElement) => {
                                            if (answerElement.textContent == answer.correctAnswers[index]) {
                                                answerElement.classList.remove("answered");
                                                answerElement.classList.add("correct");
                                            } else {
                                                answerElement.classList.remove("answered");
                                                // console.log('length: ', isQuestionCorrect);
                                                if (!isQuestionCorrect) {
                                                    answerElement.classList.add("wrong");
                                                }
                                            }
                                    });
                                    
                                    if (!isQuestionCorrect) {
                                        if (!tempCorrections.find(correction => correction.question == answer.question)) {
                                            tempCorrections.push({ question: answer.question, correctAnswers: answer.correctAnswers, selectedAnswer: answer.selectedAnswers, answerType: answer.answerType })
                                        }
                                    }
                                }

                            }


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