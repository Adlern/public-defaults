/* load CSS */
(async () => {
	const url = "https://cdn.jsdelivr.net/gh/Adlern/public-defaults/main.css";
	try {
		const res = await fetch(url, { cache: "no-cache", signal: AbortSignal.timeout(10_000) });
		if (!res.ok) throw new Error(`HTTP ${res.status} – ${res.statusText}`);

		const css = await res.text();
		const sheet = new CSSStyleSheet();
		await sheet.replace(css);

		document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
	} catch (err) {
		console.error("Failed to load styles:", err);
	}
})();

/* prevent dc */

document.ondblclick = function (e) {
	e.preventDefault();
}

/*overflow in landscape*/
(() => {
            // Das Element mit overflow (hier: <body>) und dein eigentlicher Inhalt
            const scroller = document.body;
            const content = document.getElementById('content');

            // Toggelt overflow abhängig davon, ob gescrollt werden *könnte*
            function updateOverflow() {
                // Body ist 100dvh hoch -> clientHeight ~ Sichtfensterhöhe
                const viewportH = scroller.clientHeight;
                // „Auto würde scrollen“, wenn content höher ist als das Sichtfenster
                const needsScroll = content && content.scrollHeight > viewportH + 0.5; // +0.5 gegen Rundungsfehler
                scroller.style.overflow = needsScroll ? 'auto' : 'hidden';
            }

            // Reagiere auf Größenänderungen
            window.addEventListener('load', updateOverflow);
            window.addEventListener('resize', () => requestAnimationFrame(updateOverflow));

            // Wenn sich #content in der Größe ändert (z.B. dynamisch geladen)
            if (window.ResizeObserver && content) {
                new ResizeObserver(() => requestAnimationFrame(updateOverflow)).observe(content);
            } else {
                // Fallback: DOM-Änderungen beobachten
                new MutationObserver(() => requestAnimationFrame(updateOverflow)).observe(
                    content || document.body,
                    { childList: true, subtree: true, attributes: true, characterData: true }
                );
            }

            // Initial einmal nach dem ersten Layout prüfen
            requestAnimationFrame(updateOverflow);
        })();
