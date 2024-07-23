import { ChangeEvent, CSSProperties, useEffect, useState } from "react";
import { TTheme } from "@/types/TTheme"; // Import type definitions for theme
import { isTMessage, sendMessage } from "@/utils/helpers"; // Utility functions for message handling and validation
import { defaultTheme } from "./constants/theme"; // Default theme configuration

const Popup = () => {
    const [theme, setTheme] = useState<TTheme>(defaultTheme); // State to manage the current theme

    // Handle theme change based on user input
    const handleChangeTheme = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        switch (value) {
            case "Dark": {
                const newTheme: TTheme = {
                    dark: true,
                    filter: { type: "INVERT", value: "invert(1)" },
                };
                setTheme(newTheme);
                sendMessage({
                    action: "APPLY_THEME",
                    theme: newTheme,
                });
                break;
            }
            case "Light": {
                const newTheme: TTheme = { ...defaultTheme };
                setTheme(newTheme);
                sendMessage({
                    action: "APPLY_THEME",
                    theme: newTheme,
                });
                break;
            }
        }
    };

    // Load the initial theme when the popup is opened
    const loadInitialTheme = async () => {
        const response = await sendMessage({
            action: "INIT_THEME",
        });
        if (isTMessage(response) && response.theme) setTheme(response.theme);
    };

    useEffect(() => {
        loadInitialTheme();
    }, []);

    // Apply the current theme to the popup body
    useEffect(() => {
        document.body.style.filter = theme.filter.value;
    }, [theme.dark]);

    return (
        <div style={popupContainerStyle}>
            <h2 style={textHeaderStyle}>Dark Light Mode Switcher</h2>
            <div style={switcherContainerStyle}>
                <div>
                    <div>
                        <input
                            type="radio"
                            name="dark"
                            id="dark"
                            value="Dark"
                            checked={theme.dark}
                            onChange={handleChangeTheme}
                        />
                        <label htmlFor="dark">Dark</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            name="dark"
                            id="light"
                            value="Light"
                            checked={!theme.dark}
                            onChange={handleChangeTheme}
                        />
                        <label htmlFor="light">Light</label>
                    </div>
                </div>
                <pre>{JSON.stringify(theme, null, 4)}</pre>
            </div>
        </div>
    );
};

export default Popup;

// Styles for the popup container and elements
const popupContainerStyle: CSSProperties = {
    textWrap: "wrap",
    padding: 10,
};
const switcherContainerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    background: "#f4f4f4",
    gap: 20,
    padding: 10,
    borderRadius: 10,
};

const textHeaderStyle: CSSProperties = {
    textShadow: "0 0 10px #f0f0f0",
    marginTop: 0,
};
