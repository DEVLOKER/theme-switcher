// none | blur() | brightness() | contrast() | drop-shadow() | grayscale() | hue-rotate() |
// invert() | opacity() | saturate() | sepia() | url()
const filterTypes = {
    NONE: "NONE",
    BLUR: "BLUR",
    BRIGHTNESS: "BRIGHTNESS",
    CONTRAST: "CONTRAST",
    DROP_SHADOW: "DROP_SHADOW",
    GRAYSCALE: "GRAYSCALE",
    HUE_ROTATE: "HUE_ROTATE",
    INVERT: "INVERT",
    OPACITY: "OPACITY",
    SATURATE: "SATURATE",
    SEPIA: "SEPIA",
    URL: "URL",
} as const;

export type TFilterType = (typeof filterTypes)[keyof typeof filterTypes];

export type TFilter = {
    type: TFilterType;
    value: string;
};

export type TTheme = {
    dark: boolean;
    filter: TFilter;
};
