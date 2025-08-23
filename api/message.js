// /api/message.js
export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json({ message: "Salut depuis Node.js sur Vercel !" });
  } else if (req.method === "POST") {
    const { name } = req.body; // récupération des données envoyées par le client
    res.status(200).json({ message: `Salut ${name}, Node.js a bien reçu ta requête !` });
  } else {
    res.status(405).json({ error: "Méthode non autorisée" });
  }
}
