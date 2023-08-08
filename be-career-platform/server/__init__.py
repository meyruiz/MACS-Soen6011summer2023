from flask import Flask
from flask_login import LoginManager, UserMixin
from .extensions import mongo, bcrypt, cors
from .auth import auth as auth_blueprint
from .candidate import candidate as candidate_blueprint
from .employer import employer as employer_blueprint
from .admin import admin as admin_blueprint
from .model import User

def create_app(config_object="server.settings", extra_config=None):
    app = Flask(__name__)
    
    app.config.from_object(config_object)

    # Apply extra configuration if provided
    if extra_config is not None:
        app.config.update(extra_config)

    mongo.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app, resources={r"/*": {"origins": "*"}})

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)
    
    @login_manager.user_loader
    def load_user(user_id):
        user = User.get_by_id(user_id)
        if user is not None:
            return user
        else:
            return None

    app.register_blueprint(auth_blueprint)
    app.register_blueprint(candidate_blueprint)
    app.register_blueprint(employer_blueprint)
    app.register_blueprint(admin_blueprint)

    return app
