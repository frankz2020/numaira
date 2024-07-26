from flask import request, jsonify, Blueprint
from config import app, db
from models.User import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from numairaAI.main import numberMappingFromExcelToWord
from concurrent.futures import ThreadPoolExecutor

aiRoutes = Blueprint("aiRoutes", __name__)


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

    results = []
    for i in range(len(oldExcelValues)):
        results.append(numberMappingFromExcelToWord(wordValue, oldExcelValues[i], newExcelValues[i]))

    # with ThreadPoolExecutor() as executor:
    #     futures = [
    #         executor.submit(process_mapping, wordValue, oldExcelValues[i], newExcelValues[i])
    #         for i in range(len(oldExcelValues))
    #     ]
    #     for future in futures:
    #         results.append(future.result())

    return jsonify({"results": results}), 200


def process_mapping(wordValue, oldExcelValue, newExcelValue):
    return numberMappingFromExcelToWord(wordValue, oldExcelValue, newExcelValue)
