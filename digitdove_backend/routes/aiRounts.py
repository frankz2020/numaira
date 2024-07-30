from flask import request, jsonify, Blueprint
from config import app, db
from models.User import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from numairaAI.main import numberMappingFromExcelToWord
from multiprocessing import Pool, cpu_count

aiRoutes = Blueprint("aiRoutes", __name__)

def process_mapping(args):
    wordValue, oldExcelValue, newExcelValue = args
    return numberMappingFromExcelToWord(wordValue, oldExcelValue, newExcelValue)

@aiRoutes.route("/mapExcelNumberToWord", methods=["POST"])
def mapExcelNumberToWord():
    data = request.get_json()
    print("sanity check --- ", "old values len:", len(data.get("oldExcelValue")), "new values len:", len(data.get("newExcelValue")))
    if not data.get("oldExcelValue"):
        return jsonify({"message": "no old excel value found"}), 400
    if not data.get("newExcelValue"):
        return jsonify({"message": "no new excel value found"}), 400
    if not data["wordValue"]:
        return jsonify({"message": "no word value found"}), 400

    oldExcelValues = data["oldExcelValue"]
    newExcelValues = data["newExcelValue"]
    wordValue = data["wordValue"]

    if len(oldExcelValues) != len(newExcelValues):
        return jsonify({"message": "Mismatch in the number of old and new Excel values"}), 400

    args = [(wordValue, oldExcelValues[i], newExcelValues[i]) for i in range(len(oldExcelValues))]
    
    num_processes = 4 #change this according to your 
    
    if len(args) > 1:
        with Pool(processes=num_processes) as pool:
            results = pool.map(process_mapping, args)
    else:
        results = [process_mapping(arg) for arg in args]

    return jsonify({"results": results}), 200

@aiRoutes.route("/mapJsonExcelNumberToWord", methods=["POST"])
def mapJsonExcelNumberToWord():
    return jsonify({"results": "fuck"}), 200
