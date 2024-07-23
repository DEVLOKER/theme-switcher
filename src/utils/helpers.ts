// helpers.ts: Helper functions for Chrome extension

import { defaultTheme } from "@/constants/theme";
import { TMessage } from "@/types/TMessage";
import { TTheme } from "@/types/TTheme";

/**
 * Retrieves the currently active tab in Chrome.
 * @returns {Promise<chrome.tabs.Tab | undefined>} A promise that resolves to the active tab or undefined if an error occurs.
 */
export const getActiveTab = async (): Promise<chrome.tabs.Tab | undefined> => {
    return new Promise((resolve, reject) => {
        try {
            chrome.tabs.query({ active: true }, (tabs) => {
                if (chrome.runtime.lastError)
                    throw new Error(chrome.runtime.lastError.toString());
                const tab = tabs.at(0);
                if (!tab)
                    throw new Error(
                        "An error occurred when getting the active tab"
                    );
                resolve(tab);
            });
        } catch (error) {
            reject(undefined);
        }
    });
};

/**
 * Sends a message to the background script.
 * @param {TMessage} request - The message to send.
 * @returns {Promise<TMessage | Error>} A promise that resolves to the response message or an error.
 */
export const sendMessage = async (
    request: TMessage
): Promise<TMessage | Error> => {
    try {
        const response = await chrome.runtime.sendMessage<TMessage, TMessage>(
            request
        );
        return Promise.resolve(response);
    } catch (error) {
        return Promise.reject(error as Error);
    }
};

/**
 * Sends a message to the content script of a specified or active tab.
 * @param {TMessage} request - The message to send.
 * @param {number} [tabId] - Optional tab ID to send the message to.
 * @returns {Promise<TMessage | Error>} A promise that resolves to the response message or an error.
 */
export const sendMessageToContent = async (
    request: TMessage,
    tabId?: number
): Promise<TMessage | Error> => {
    try {
        tabId = tabId ?? Number((await getActiveTab())?.id);
        if (!tabId || tabId <= 0) {
            throw Error("Can't get the active tab");
        }
        const contentResponse = await chrome.tabs.sendMessage<
            TMessage,
            TMessage
        >(tabId, { ...request, tabId });
        return Promise.resolve(contentResponse);
    } catch (error) {
        return Promise.reject(error as Error);
    }
};

/**
 * Saves the given theme to local storage.
 * @param {TTheme} theme - The theme to save.
 * @returns {Promise<TTheme | Error>} A promise that resolves to the saved theme or an error.
 */
export const saveTheme = (theme: TTheme) => {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.set({ theme: theme }, () => {
                if (chrome.runtime.lastError)
                    throw new Error("Error setting data");
                resolve(theme);
            });
        } catch (error) {
            console.log("saveTheme", error);
            reject(error as Error);
        }
    });
};

/**
 * Loads the theme from local storage.
 * @returns {Promise<TTheme>} A promise that resolves to the loaded theme or the default theme if an error occurs.
 */
export const loadTheme = (): Promise<TTheme> => {
    return new Promise((resolve) => {
        try {
            chrome.storage.local.get(["theme"], ({ theme }) => {
                if (chrome.runtime.lastError)
                    throw new Error(
                        "An error occurred while retrieving values from local storage"
                    );
                resolve(theme as TTheme);
            });
        } catch (error) {
            console.log("loadTheme", error);
            // Resolve default theme when an error occurs
            resolve(defaultTheme);
        }
    });
};

/**
 * Type guard to check if a response is of type TMessage.
 * @param {any} response - The response to check.
 * @returns {response is TMessage} True if the response is of type TMessage, false otherwise.
 */
export const isTMessage = (response: any): response is TMessage => {
    return response && typeof response.action === "string";
};
