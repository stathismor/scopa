import { Global } from "@emotion/core";

/**
 * https://theme-ui.com/guides/global-styles/
 */

export const GlobalStyle = () => (
  <Global
    styles={() => ({
      "body, html, #root": {
        height: "100%",
      },
    })}
  />
);
