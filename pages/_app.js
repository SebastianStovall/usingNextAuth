import Layout from '../components/layout/layout';
import '../styles/globals.css';

// import session provider
import { SessionProvider } from "next-auth/react"

// !!! Version 4 makes using the SessionProvider mandatory.
// This means that you will have to wrap any part of your application using useSession in this provider !!!

// link to next-auth@v4 documentation ----> https://next-auth.js.org/getting-started/upgrade-v4

// ******************** IN SOME COMPONENTS (not all!) YOU MIGHT BE ABLE TO DIRECTLY GET THE SESSION DATA BYPASSING getSession() hook by keying into props.session ********
// this works since the SessionProvider is providing context to all our component files which includes session data

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    // `session` comes from `getServerSideProps` or `getInitialProps`.
    // Avoids flickering/session loading on first load.
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;
