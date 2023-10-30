import { useState, useRef } from 'react';
import classes from './auth-form.module.css';

// call signIn function to validate credentials (setup for this provider is found in [...nextauth].js file)
import { signIn } from 'next-auth/react';

// used to re-direct is successfully logging in
import { useRouter } from 'next/router';

// helper function used in the submitHandler() function for registering a user
async function createUser(email, password) {
  const response = await fetch('api/auth/signup', {
    method: 'POST',
    body: JSON.stringify( {email, password} ),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const data = await response.json()
  if(!response.ok) {
    throw new Error(data.message || 'Something went wrong attempting to register user!')
  }

  return data
}

function AuthForm() {
  // useState variable to conditionally render whether you want a log-in form or a signup form
  // there is a button that has an onClick which changes the status of isLogin boolean to decide which form to render on the page
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter()

  // we are using useRef() hook in this example ONLY for quick and easy access, you should NEVER use this hook inside our actual apps, instead
  // you should manage these with useState() with onChange={} events
  const emailInputRef = useRef()
  const passwordInputRef = useRef()

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(e) {
    e.preventDefault()

    const enteredEmail = emailInputRef.current.value
    const enteredPassword = passwordInputRef.current.value

    // optional ---> Add Frontend Validations before making the fetch call

    if(isLogin) {
      // if we are looking at the LOGIN form
      const res = await signIn( 'credentials', { redirect: false, email: enteredEmail, password: enteredPassword} )
      console.log("RESULT FROM LOGIN", res)

      // if login was successful, should get an object back like this ------>  {error: null, status: 200, ok: true, url: 'http://localhost:3000/auth'}
      // since error key is null on successful login, can use a conditional
      if(!res.error) {
        // IF WE HAVE SUCCESSFULLY LOGGED IN, redirect to the home page
        router.replace('/profile')
      }

    } else {
      // if we are looking at the SIGNUP form
      try {
        const res = await createUser(enteredEmail, enteredPassword)
        console.log(res)
        // once user created, can re-direct or do whatever you need to do...
      } catch(e) {
        console.log(e)
      }
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef} />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
