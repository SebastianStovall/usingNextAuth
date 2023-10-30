// !!!!!!! we can use getServerSideProps() function to protect our signin/signup form when users are already logged in... they should NOT be allowed to access this page
// if they have already been authenticated by the session !!!!!!

import AuthForm from '../components/auth/auth-form';

import { getSession } from "next-auth/react"

function AuthPage() {
  return <AuthForm />;
}

export async function getServerSideProps(context) {
  const session = await getSession({req: context.req})
  // if active session, redirect to home page
  if(session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  // if no active session, you are allowed to see the sign in page
  return {
    props: { session }
  }

}

export default AuthPage;


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//ALTERNATIVELY, IF YOU WANTED TO ACHEIVE THIS WITH A USE EFFECT (its much slower this way, dont... and a lot more code)

// import AuthForm from '../components/auth/auth-form';
// import { useRouter } from 'next/router';
// import { getSession } from 'next-auth/react';
// import { useEffect } from 'react';

// function AuthPage() {
//   const [isLoading, setIsLoading] = useState(true)
//   const router = useRouter()

//   useEffect(() => {
//     getSession().then(session => {
//       if(session) {
//         router.replace("/")
//       } else {
//         setIsLoading(false)
//       }
//     })
//   }, [router])

//   if (isLoading) return <p>...Loading</p>

//   return <AuthForm />;
// }

// export default AuthPage;
