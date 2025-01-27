// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const initSentry = async () => {
  try {
    const request = await fetch("/api/env");
    const env = await request.json();

    const dns = env["PUBLIC_SENTRY_DSN_WEB"];
    const environment = env["PUBLIC_NETWORK_NAME"];

    Sentry.init({
      dsn: dns,
      environment,
      tracesSampleRate: 1,
      debug: false,
    });
  } catch (error) {
    console.error("Error during Sentry initialization", error);
  }
};

initSentry();
