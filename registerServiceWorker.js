/* eslint-disable no-console */

import { register } from "register-service-worker";

export default {
    init: function() {
        if (process.env.NODE_ENV === "production") {
            register(`${process.env.BASE_URL}service-worker.js`, {
                registrationOptions: {
                    scope: `${process.env.BASE_URL}`,
                },
                ready() {
                    console.log("App is being served from cache by a service worker.");
                },
                registered() {
                    console.log("Service worker has been registered.");
                },
                cached() {
                    console.log("Content has been cached for offline use.");
                },
                updatefound() {
                    console.log("New content is downloading.");
                },
                updated(registration) {
                    console.log("New content is available; please refresh.");
                    const PwaUpdatedEvent = new CustomEvent("PwaUpdated", { detail: registration });
                    document.dispatchEvent(PwaUpdatedEvent);
                },
                offline() {
                    console.log("No internet connection found. App is running in offline mode.");
                },
                error(error) {
                    console.error("Error during service worker registration:", error);
                },
            });
        }
    },
    permissionNotification: function() {
        return new Promise(function(resolve, reject) {
            const permissionResult = Notification.requestPermission(function(result) {
                resolve(result);
            });

            if (permissionResult) {
                permissionResult.then(resolve, reject);
            }
        }).then(function(permissionResult) {
            if (permissionResult !== "granted") {
                throw new Error("We weren't granted permission.");
            }
        });
    },
};
