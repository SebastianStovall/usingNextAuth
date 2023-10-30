import Link from 'next/link';
import classes from './main-navigation.module.css';

// !!! THIS HOOK ALLOWS US TO DETERMINE IF A USER IS CURRENTLY AUTHENTICATED !!! (if a token has been generated for them from login)
// this import has been changed from 'next-auth/client' to 'next-auth/react' in next-auth@v4
// when we use useSession hook, it would be the same as making a request call to /api/auth/session <--- possible due to config object set in [...nextauth].js file
// the signOut import is another route thats configuring from [...nextauth].js that will log out an authenticated user
import { useSession, signOut } from "next-auth/react"

function MainNavigation() {
  // useSession hook used to return an array, but in v4, it now returns an object
  // the data key holds the active session data (there will be session data only if login has been successful), if no authenticated user, the key's value will be null
  // the staus key is a e-num-like value that shows if the request to log in has been finished
  // its 3 values are --->   1.) "loading"       2.) "unathenticated"     3.) "authenticated"
  const { data: session, status } = useSession()
  const loading = status === "loading"

  // console.log(session)  //<------- holds data for the active session (null if no authenticated user)
  // console.log(status)   //<------- tells us explicity whether we are authenticated, not authenticated, or in the request process to be authenticated

  function logoutHandler() {
    // the reason why we dont even need an await here is because this function will alter the variables in useSession() hook, and re-render the component accordingly
    // !!! when you run this function, make sure that the session cookie is gone from the application tab !!!
    signOut()
  }

  return (
    <header className={classes.header}>
      <Link href="/">
        <div className={classes.logo}>Next Auth</div>
      </Link>
      <nav>
        <ul>
          {/* IF WE DONT HAVE AN ACTIVE SESSION (no authenticated user)... WE RENDER A LINK TO SIGN-IN/SIGN-UP FORM! */}
          {!session && status === "unauthenticated" && (
            <li>
              <Link href="/auth">Login</Link>
            </li>
          )}
          {/* ONLY IF WE HAVE AN ACTIVE SESSION... WE RENDER A LINK TO THE USER'S PROFILE PAGE! */}
          {session && (
            <li>
              <Link href="/profile">Profile</Link>
            </li> )}
            {/* ONLY IF WE HAVE AN ACTIVE SESSION... WE RENDER A LOG OUT BUTTON! */}
            {session && (
              <li>
                <button onClick={logoutHandler}>Logout</button>
              </li>
            )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
