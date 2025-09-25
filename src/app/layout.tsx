import "flowbite";
import './globals.css';
import { Metadata } from 'next';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import BackToTopButton from "../../components/BackToTop/BackToTop";




export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    // <html lang="en" suppressHydrationWarning>
    <html lang="en">

      {/* <Head>
        <meta charSet='utf-8' />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/image/logo.png" />

      </Head> */}
      {/* <body suppressHydrationWarning> */}
      <body >

        {/* <ClientHeader />
        <ClientBanner /> */}
        <Header />
        {children}
        <BackToTopButton />
        <Footer />
      </body>
    </html>
  );
}