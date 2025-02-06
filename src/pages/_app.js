import "@/styles/globals.css";
import MainLayout from "@/components/layout/MainLayout";
import AuthLayout from "@/components/layout/AuthLayout";
import { useState } from "react";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";
import { useRouter } from 'next/router';
import AuthGuard from "@/components/AuthGuard";

function AppContent({ Component, pageProps, disabled, setDisabled }) {
  const router = useRouter();
  const authPages = ['/login'];
  const isAuthPage = authPages.includes(router.pathname);

  if (isAuthPage) {
    return (
      <AuthLayout>
        <Component {...pageProps} disabled={disabled} setDisabled={setDisabled} />
      </AuthLayout>
    );
  }

  return (
    <AuthGuard>
      <MainLayout>
        <Component {...pageProps} disabled={disabled} setDisabled={setDisabled} />
      </MainLayout>
    </AuthGuard>
  );
}

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const [disabled, setDisabled] = useState(false);

  return (
    <SessionProvider session={session}>
      <Head>
        <title>Control Empleados</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AppContent
        Component={Component}
        pageProps={pageProps}
        disabled={disabled}
        setDisabled={setDisabled}
      />
    </SessionProvider>
  );
}