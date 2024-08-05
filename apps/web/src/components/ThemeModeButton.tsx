import React from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { useTheme } from "next-themes";

import { Button } from "~/components/Button";
import { useIsMounted } from "~/hooks/useIsMounted";

export function ThemeModeButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const isMounted = useIsMounted();

  if (!isMounted) {
    return <Button variant="icon" size="md-icon" />;
  }

  return (
    <Button
      variant="icon"
      size="md-icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {resolvedTheme === "dark" ? (
        <SunIcon aria-hidden="true" className="h-5 w-5" />
      ) : (
        <MoonIcon aria-hidden="true" className="h-5 w-5" />
      )}
    </Button>
  );
}
