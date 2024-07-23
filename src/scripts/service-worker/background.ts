import { TMessage } from "@/types/TMessage"; // Type definition for messages
import { TTheme } from "@/types/TTheme"; // Type definition for theme settings
import { loadTheme, saveTheme, sendMessageToContent } from "@/utils/helpers"; // Utility functions

// Listen for messages from the popup or content scripts
chrome.runtime.onMessage.addListener(
    (request: TMessage, sender, sendResponse) => {
        console.log(request, sender, sendResponse);
        const { action, theme } = request;
        switch (action) {
            case "INIT_THEME": {
                // Initialize the theme when the popup is first opened
                (async () => {
                    const loadedTheme = await loadTheme();
                    updateBadge(loadedTheme); // Update the badge based on the loaded theme
                    saveTheme(loadedTheme); // Save the loaded theme
                    sendResponse({ ...request, theme: loadedTheme }); // Respond with the loaded theme
                })();
                break;
            }
            case "APPLY_THEME": {
                // Apply the theme when the user changes it in the popup
                (async () => {
                    const response = await askContentToApplyTheme(theme);
                    updateBadge(theme); // Update the badge based on the new theme
                    saveTheme(theme); // Save the new theme
                    sendResponse(response); // Respond with the result of applying the theme
                })();
                break;
            }
            default: {
                // Default response for unknown actions
                sendResponse(request);
                break;
            }
        }

        return true; // Indicates that the response will be sent asynchronously
    }
);

// Function to ask the content script to apply the theme
const askContentToApplyTheme = async (
    theme: TTheme
): Promise<TMessage | Error> => {
    const contentResponse = await sendMessageToContent({
        action: "APPLY_THEME",
        theme: theme,
    });
    return contentResponse;
};

// Function to update the badge based on the current theme
const updateBadge = (theme: TTheme) => {
    if (theme.dark) {
        chrome.action.setBadgeText({ text: "D" }); // Set badge text to "D" for dark mode
        chrome.action.setBadgeBackgroundColor({ color: "#000000" }); // Set badge background color to black
    } else {
        chrome.action.setBadgeText({ text: "L" }); // Set badge text to "L" for light mode
        chrome.action.setBadgeBackgroundColor({ color: "#FFFFFF" }); // Set badge background color to white
    }
};
