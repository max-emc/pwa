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
		const res = await fetch("/api/scraper", {
			method: "POST",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({url: debugUrl})
		});

		const data = await res.json();
		// container.content = data.
		console.log(data);
	} catch (err) {
		console.error("Erreur lors de la requête :", err);
	}

})
