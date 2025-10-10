const text;

async function loadText() {
	const url = "https://raw.githubusercontent.com/Adlern/public-defaults/refs/heads/main/default.css";

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 10_000);

	try {
		const res = await fetch(url, { signal: controller.signal, cache: "no-cache" });
		if (!res.ok) throw new Error(`HTTP ${res.status} – ${res.statusText}`);
		const text = await res.text();
	} catch (err) {
		console.error("Failed to load text:", err);
	} finally {
		clearTimeout(timeout);
	}
}
loadText();

const sheet = new CSSStyleSheet();
sheet.replaceSync(text);
document.adoptedStyleSheets.push(sheet);
