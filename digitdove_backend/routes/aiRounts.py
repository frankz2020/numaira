from flask import request, jsonify, Blueprint
from config import app, db
from models.User import User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from numairaAI.main import numberMappingFromExcelToWord
aiRoutes = Blueprint('aiRoutes', __name__)

@aiRoutes.route('/mapExcelNumberToWord', methods=['POST']) 
def mapExcelNumberToWord(): 
    # {oldExcelValue: number[], newExcelValue: number[], wordValue: string}
    data = request.get_json()
    print(data)
    if not data.get('oldExcelValue'):
        return jsonify({'message': 'no old excel value found'}), 400
    if not data.get('newExcelValue'):
        return jsonify({'message': 'no new excel value found'}), 400
    if not data['wordValue']: 
        return jsonify({'message': 'no word value found'}), 400

    oldExcelValue = data['oldExcelValue'][0]
    newExcelValue = data['newExcelValue'][0]
    wordValue = data['wordValue']
    result = numberMappingFromExcelToWord(wordValue, oldExcelValue, newExcelValue)
  
    return jsonify({'result': result}), 200