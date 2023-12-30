from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/get', methods=['GET'])
def get_method():
    # Logique pour la méthode GET
    print(dict(request.headers))
    return jsonify({"message": "Réponse de GET"}), 200

@app.route('/post', methods=['POST'])
def post_method():
    # Logique pour la méthode POST
    data = request.json
    return jsonify({"message": "Réponse de POST", "data": data}), 201

@app.route('/put', methods=['PUT'])
def put_method():
    # Logique pour la méthode PUT
    data = request.json
    return jsonify({"message": "Réponse de PUT", "data": data}), 200

@app.route('/patch', methods=['PATCH'])
def patch_method():
    # Logique pour la méthode PATCH
    data = request.json
    return jsonify({"message": "Réponse de PATCH", "data": data}), 200

@app.route('/delete', methods=['DELETE'])
def delete_method():
    # Logique pour la méthode DELETE
    return jsonify({"message": "Réponse de DELETE"}), 200

if __name__ == '__main__':
    app.run(debug=True)