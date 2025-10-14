/* load CSS */
(async () => {
	const url = "https://raw.githubusercontent.com/Adlern/public-defaults/refs/heads/main/main.css";
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