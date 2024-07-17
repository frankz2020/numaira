from datetime import datetime
from flask import request, jsonify, Blueprint
from config import app, db
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from models.Template import Template
from utils.sqlLiteArrayToText import sqlLite_convertArrayToText

templateRoutes = Blueprint('templateRoutes', __name__)

# get all templates
@templateRoutes.route('/getTemplates', methods=['GET'])
@login_required
def get_templates():
    templates = Template.query.filter_by(user_id=current_user.id).all()
    summarized_templates = [
        {
            'id': template.id,
            'name': template.name,
            'last_edited': template.last_edited.isoformat()
        } for template in templates
    ]
    return jsonify(summarized_templates), 200

# get a template by id
@templateRoutes.route('/getTemplate/<int:template_id>', methods=['GET'])
@login_required
def get_template(template_id):
    template = Template.query.filter_by(id=template_id, user_id=current_user.id).first()
    if not template:
        return jsonify({'message': 'Template not found'}), 404
    return jsonify(template.serialize()), 200

# create a template 
@templateRoutes.route('/createTemplate', methods=['POST'])
@login_required
def create_template():
    print("hit create tempalte endpoint")
    data = request.get_json()
    print(data)
    if not data or 'name' not in data or 'paragraphs' not in data:
        return jsonify({'message': 'Name and paragraphs are required'}), 400
    
    new_template = Template(
        user_id=current_user.id,
        name=data['name'],
        paragraphs=sqlLite_convertArrayToText(data['paragraphs']),
        last_edited=datetime.now()
    )
    db.session.add(new_template)
    db.session.commit()
    
    brief_info = {
        'id': new_template.id,
        'name': new_template.name,
        'last_edited': new_template.last_edited.isoformat()
    }
    return jsonify(brief_info), 201



# delete a template by id
@templateRoutes.route('/deleteTemplate/<int:template_id>', methods=['DELETE'])
@login_required
def delete_template_by_user(template_id):
    template = Template.query.filter_by(id=template_id, user_id=current_user.id).first()
    if not template:
        return jsonify({'message': 'Template not found or you do not have permission to delete this template'}), 404
    
    db.session.delete(template)
    db.session.commit()
    return jsonify({'message': 'Template deleted successfully'}), 200


# update a template by id
@templateRoutes.route('/updateTemplate/<int:template_id>', methods=['PUT'])
@login_required
def update_template_by_user(template_id):
    data = request.get_json()
    template = Template.query.filter_by(id=template_id, user_id=current_user.id).first()
    
    if not template:
        return jsonify({'message': 'Template not found or you do not have permission to update this template'}), 404
    
    if 'name' in data:
        template.name = data['name']
    if 'paragraph' in data:
        template.paragraph = data['paragraph']
    template.last_edited = datetime.now(datetime.UTC)
    
    db.session.commit()
    return jsonify({'message': 'Template updated successfully', 'template': template.serialize()}), 200
