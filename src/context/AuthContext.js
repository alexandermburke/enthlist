"use client"
import React, { useContext, useState, useEffect } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile } from 'firebase/auth'
import { auth, db } from '@/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'


const AuthContext = React.createContext()

export function useAuth() {
    // create a useAuth hook to access the context throughout our app
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    // create the auth wrapper component for our application
    // could optionally define a userData state and add to context
    const [currentUser, setCurrentUser] = useState(null)
    const [userDataObj, setUserDataObj] = useState({})
    const [loading, setLoading] = useState(true)

    const isPaid = userDataObj?.billing?.plan === 'Pro' && userDataObj?.billing?.status


    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password)
    }

    async function addUsername(user, username) {
        const usernameRef = doc(db, 'usernames', username);
        const res = await setDoc(usernameRef, {
            status: 'active',
            uid: user?.uid
        }, { merge: true });
        // const usernameRef = doc(db, 'meta', 'usernames');
        // const res = await setDoc(usernameRef, {
        //     [username]: 'active'
        // }, { merge: true });
        return updateProfile(user, { displayName: username })
    }

    function logout() {
        return signOut(auth)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async user => {

            // This is where you could fetch generic user data from firebase
            try {
                setLoading(true)
                console.log('CURRENT USER: ', user)

                // if last login not same as localstorage, read from db
                setCurrentUser(user)

                // if last login local storage matches last login on user, then read from localstorage
                if (!user) { return }
                let localUserData = localStorage.getItem('hyr')
                if (!localUserData) {
                    // fetch from database & set local data + local metadata
                    await fetchUserData()
                    return
                }
                localUserData = JSON.parse(localUserData)
                if (user?.metadata?.lastLoginAt === localUserData?.metadata?.lastLoginAt) {
                    // read from localstorage
                    console.log('Used local data')
                    setUserDataObj(localUserData)
                    return
                }
                // fetch from database & set local data + local metadata
                await fetchUserData()

                async function fetchUserData() {
                    try {
                        const docRef = doc(db, "users", user.uid)
                        const docSnap = await getDoc(docRef)
                        console.log('Fetching user data')
                        let firebaseData = {}
                        if (docSnap.exists()) {
                            console.log('Found user data')
                            firebaseData = docSnap.data()
                            setUserDataObj(firebaseData)
                            // set fetched data to local storage to cache it
                            localStorage.setItem('hyr', JSON.stringify({ ...firebaseData, metadata: user.metadata }))
                        }
                    } catch (err) {
                        console.log('Failed to fetch data')
                    }
                }
            } catch (err) {
                console.log(err.message)
            } finally {
                setLoading(false)
            }

        })
        return unsubscribe
    }, [])

    const value = {
        currentUser,
        signup,
        logout,
        login,
        addUsername,
        loading,
        userDataObj,
        setUserDataObj,
        isPaid
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}