from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api/message')
def message():
    return jsonify({"text": "Salut depuis Python !"})


if __name__ == "__main__":
    app.run(debug=True)
