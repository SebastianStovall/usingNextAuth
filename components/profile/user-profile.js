// to protect a route from unathenticated users (if you dont want a user to be able to navigate to a page when there is no longer an active session, we can use next-auth for this)
// for example, if an unathenticated user tries accessing the user profile page, we can redirect them back to /auth page component to the login form

// !!! NOTE: next-auth is AUTOMATICALLY CONFIGURED TO PUSH AN UNAUTHENTICATED USER BACK TO THE /auth PAGE WHEN A USER HITS THE LOGOUT ROUTE, BUT WE STILL NEED TO
// PROTECT AGAINST PEOPLE MANUALLY TRYING TO ACCESS PROTECTED COMPONENTS FROM THE URL WHEN THEY ARE UNAUTHENTICATED !!!

// !!! the getSession() import is needed here to send in a new request to get the current session when a user logs out, you cant use useSession() hook since apparently
// there's a bug when trying to re-direct users with it, so instead, we use a traditional useState and useEffect cycle based on the session data of getSession() hook
import { getSession } from "next-auth/react"
import { useState, useEffect } from 'react'


import ProfileForm from './profile-form';
import classes from './user-profile.module.css';

function UserProfile() {

  // look at profile.js file... all the code commented out here is no longer needed since we are using getServerSideProps() to get session data before this component mounts
  // test it out yourself, try to navigate to the profile page from the url when you are not logged in, instantly brought back to /auth page, doesnt even need to re-load
  // all possible due to SSR

  //----------------------------------------------------------------------------------------------------------------------------------------------------------------------//

  // // Redirect away if NOT authenticated
  // const [isLoading, setIsLoading] = useState(true)
  // const [loadedSession, setLoadedSession] = useState()

  // useEffect(() => {
  //   // use getSession() to see if we currently have an active session, if we dont, then re-direct away fro the UserProfile component
  //   getSession().then(session => {
  //     if (!session) {
  //       // here we use window.location.href to re-direct away, but i prefer to use just like a history.push()
  //       window.location.href = '/auth' // <---- dont use in our app
  //     } else {
  //       // if we do have a session, stay on the page, set loading to false so we dont render the <p>Loading</p> tag
  //       setIsLoading(false)
  //     }
  //   })
  // }, [])

  // if(isLoading) {
  //   return <p className={classes.profile}>...Loading</p>
  // }

  async function changePasswordHandler(passwordObjData) {
    const session = await getSession()
    passwordObjData["session"] = session
    const response = await fetch('/api/user/change-password', {
      method: 'PATCH',
      body: JSON.stringify(passwordObjData),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()
    // want to give the user more feedback, just using a console.log here just to see that it works
    console.log(data)
  }

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm onChangePassword={changePasswordHandler} />
    </section>
  );
}

// this is where your SSR code would go to prop in the data for this profile page component

export default UserProfile;
