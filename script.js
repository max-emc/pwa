const searchButton = document.getElementById("searchButton");
const searchBar = document.getElementById("searchBar");
const container = document.getElementById("container");

const debugUrl = "https://example.com";

searchButton.addEventListener("click", async () => {
	const searchUrl = searchBar.value;
	
	if (searchUrl.trim()) {
		console.log(searchUrl);
	}

	try {
		console.log("extraction...")
		const res = await fetch("/api/scraper", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({url: debugUrl})
		});

		if (!res.ok) {
		const data = await res.json();
		const cleaned = DOMPurify.sanitize(data.content);
		} else {
			const data = await res.json();
			console.log("Réponse :", data);
		}
		container.innerHTML = cleaned;
	} catch (err) {
		console.error("Erreur lors de la requête :", err);
	}
})
