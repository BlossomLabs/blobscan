import type { AppProps as NextAppProps } from "next/app";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/public-sans/400.css";
import "@fontsource/public-sans/500.css";
import Head from "next/head";

import AppLayout from "../components/AppLayout/AppLayout";
import { Chakra } from "../providers/Chakra";

interface AppProps extends NextAppProps {
  cookies: string;
}

function MyApp({ Component, pageProps, cookies }: AppProps) {
  return (
    <Chakra cookies={cookies}>
      <AppLayout>
        <Head>
          <title>Blobscan</title>
          <meta name="description" content="Blobscan is the first EIP-4844 Blob Data Explorer that helps to navigate and visualize those blobs, providing the necessary infrastructure to scale Ethereum" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Component {...pageProps} />
      </AppLayout>
    </Chakra>
  );
}

export { getServerSideProps } from "@/providers/Chakra";

export default MyApp;
