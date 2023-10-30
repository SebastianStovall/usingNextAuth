// FOR PROTECTED COMPONENTS, WE NEED TO USE getServerSideProps() function (NOT getStaticProps) WHEN PRE-RENDERING DATA FOR THAT COMPONENT
// THE REASON FOR THIS IS BECAUSE WE NEED TO GET OUR getSession() DATA FOR "EACH INCOMING REQUEST" TO DETERMINE WHETHER OR NOT TO RE-DIRECT
// ... SINCE WE ARE USING USE-EFFECT WITH getSession() STATE, (client side code), getServerSideProps() IS THE ONLY OPTION FOR PRE-RENDERING
// PROTECTED COMPONENTS SINCE getStaticProps() WILL ONLY REQUEST DATA SOMETIMES DUE TO REVALIDATE KEY... BUT WE ALWAYS NEED ACCESS TO SESSION STATE
// FOR RE-DIRECT TO WORK... EVEN THOUGH getSession() IS A CLIENT SIDE METHOD, YOU ARE NOT LIMITED IN USING IT IN THE getServerSideProps() FUNCTION

//BY IMPLENTING THE LOGIC TO LOOK FOR SESSION DATA BEFORE THE COMPONENT RENDERS, WE CAN "INSTANTEOUSLY RE-DIRECT THE USER BACK TO THE /auth PAGE"
// WITHOUT THIS LOGIC, THE CLIENT SIDE CODE WITH THE useEffect() WOULD NEED TO WAIT FOR THE COMPONENT TO MOUNT, AND ITS "A LOT" MORE CODE TO WRITE

// KEEP IN MIND THIS WILL ONLY WORK IF YOU HAVE A PAGE THATS DISPLAYING THE ACTUAL REACT COMPONENT INSIDE OF THE RETURN JSX, CAUSE IN ORDER TO RENDER THE
// <UserProfile /> COMPONENT, IT MUST FIRST DETERMINE THE SESSION DATA

import { getSession } from "next-auth/react"

import UserProfile from '../components/profile/user-profile';

function ProfilePage() {
  return <UserProfile />;
}

// use getServerSideProps() to pre-render data for the UserProfile component
export async function getServerSideProps(context) {
  // black magic for instanly looking into the session data
  const session = await getSession({req: context.req})
  // if no session, redirect
  if(!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false
      }
    }
  }

  // is session, prop in session data to the UserProfle component
  // ***!!! BY RETURNING HERE, ALL THE LOGIC FOR THE REDIRECTING IN THE USERPROFILE PAGE IS NO LONGER NEEDED, WE ALREADY DETERMINED THAT THERE IS AN ACTIVE SESSION !!!***
  // ^^^ ^^^ ^^^ ^^   ^^^ ^^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^  ^^ ^ ^  ^ ^ ^^^ ^ ^^ ^ ^^ ^
  return {
    props: { session }
  }

}

export default ProfilePage;
