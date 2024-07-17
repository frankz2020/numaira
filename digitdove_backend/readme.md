## run migrations:

export FLASK_APP=main.py
flask db init
flask db migrate -m "Add paragraph column to template table"
flask db upgrade
