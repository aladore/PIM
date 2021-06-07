/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

workbox.core.setCacheNameDetails({ prefix: "send-up-app" });
workbox.skipWaiting();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

/**
 * https://swina.github.io/2019/02/vue-service-worker-for-webpush-notifications/
 * Web Push
 */
self.addEventListener("push", function(event) {
    let data = event.data ? event.data.json() : {},
        title = data.title ? data.title : "No Title",
        notificationOptions = {
            body: data.body ? data.body : "Message not decoded. Contact support to support@send-up.net",
            data: {},
            vibrate: [500, 100, 500],
        };

    if (data.hasOwnProperty("icon") && data.icon) {
        notificationOptions.icon = data.icon;
    } else {
        notificationOptions.icon = "./img/android-chrome-192x192.png";
    }

    if (data.hasOwnProperty("badge") && data.badge) {
        notificationOptions.badge = data.badge;
    } else {
        notificationOptions.badge = "./img/badge-96x96.png";
    }

    if (data.hasOwnProperty("image") && data.image) {
        notificationOptions.image = data.image;
    }

    if (data.hasOwnProperty("tag") && data.tag) {
        notificationOptions.tag = data.tag;
    }

    if (data.hasOwnProperty("url") && data.url) {
        notificationOptions.data.url = data.url;
    }

    event.waitUntil(self.registration.showNotification(title, notificationOptions));
});

self.addEventListener("notificationclick", function(event) {
    let url = event.notification.data.url;

    event.notification.close();
    if (url) {
        event.waitUntil(clients.openWindow(url));
    }
});
