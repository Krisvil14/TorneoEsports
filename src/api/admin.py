import os
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from .models import db

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    # Import models here to avoid circular dependencies
    from .models import User, Team, Tournament, Application, Payment, Match, User_Stats, Team_Stats, Calendar
    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Team, db.session))
    admin.add_view(ModelView(Tournament, db.session))
    admin.add_view(ModelView(Application, db.session))
    admin.add_view(ModelView(Payment, db.session))
    admin.add_view(ModelView(Match, db.session))
    admin.add_view(ModelView(User_Stats, db.session))
    admin.add_view(ModelView(Team_Stats, db.session))
    admin.add_view(ModelView(Calendar, db.session))
    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))