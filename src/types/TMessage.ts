import { TTheme } from "@/types/TTheme";

export type TMessage =
    | {
          action: "APPLY_THEME";
          theme: TTheme;
          tabId?: number;
      }
    | {
          action: "INIT_THEME";
          theme?: TTheme;
          tabId?: number;
      };
