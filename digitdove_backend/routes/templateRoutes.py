from datetime import datetime
from flask import request, jsonify, Blueprint
from config import app, db
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from models.Template import Template


templateRoutes = Blueprint('templateRoutes', __name__)

# get all templates
@templateRoutes.route('/getTemplates', methods=['GET'])
@login_required
def get_templates():
    templates = Template.query.filter_by(user_id=current_user.id).all()
    summarized_templates = [
        {
            'id': template.id,
            'names': template.names,
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
    data = request.get_json()
    if not data or 'names' not in data or 'paragraph' not in data:
        return jsonify({'message': 'Names and paragraph are required'}), 400
    
    new_template = Template(
        user_id=current_user.id,
        names=data['names'],
        paragraph=data['paragraph'],
        last_edited=datetime.now()
    )
    db.session.add(new_template)
    db.session.commit()
    
    brief_info = {
        'id': new_template.id,
        'names': new_template.names,
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
    
    if 'names' in data:
        template.names = data['names']
    if 'paragraph' in data:
        template.paragraph = data['paragraph']
    template.last_edited = datetime.now(datetime.UTC)
    
    db.session.commit()
    return jsonify({'message': 'Template updated successfully', 'template': template.serialize()}), 200
