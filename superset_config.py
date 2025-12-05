# Superset Configuration File
# Custom configuration for a modern, professional interface

import os
from flask_appbuilder.security.manager import AUTH_DB

# Secret key for session management
SECRET_KEY = os.environ.get('SUPERSET_SECRET_KEY', 'votre_cle_secrete_changez_moi')

# Database connection
SQLALCHEMY_DATABASE_URI = 'sqlite:////app/superset_home/superset.db'

# Flask-WTF flag for CSRF
WTF_CSRF_ENABLED = True

# Disable async queries (simpler setup)
SUPERSET_WEBSERVER_TIMEOUT = 300

# Modern UI Configuration
APP_NAME = "BeliBeli Analytics"
APP_ICON = "/static/assets/images/superset-logo-horiz.png"

# Custom colors for a modern interface
THEME_OVERRIDES = {
    "colors": {
        "primary": {
            "base": "#1890ff",
            "dark1": "#096dd9",
            "dark2": "#0050b3",
            "light1": "#40a9ff",
            "light2": "#69c0ff",
        },
        "secondary": {
            "base": "#52c41a",
            "dark1": "#389e0d",
            "dark2": "#237804",
            "light1": "#73d13d",
            "light2": "#95de64",
        },
        "success": {
            "base": "#52c41a",
        },
        "warning": {
            "base": "#faad14",
        },
        "error": {
            "base": "#ff4d4f",
        },
        "info": {
            "base": "#1890ff",
        },
    },
}

# Enable modern features
ENABLE_TEMPLATE_PROCESSING = True
ENABLE_CORS = True
CORS_OPTIONS = {
    'supports_credentials': True,
    'allow_headers': ['*'],
    'resources': ['*'],
    'origins': ['http://localhost:5173', 'http://localhost:3000']
}

# Cache configuration for better performance
CACHE_CONFIG = {
    'CACHE_TYPE': 'SimpleCache',
    'CACHE_DEFAULT_TIMEOUT': 300
}

# Feature flags for modern features
FEATURE_FLAGS = {
    'DASHBOARD_NATIVE_FILTERS': True,
    'DASHBOARD_CROSS_FILTERS': True,
    'DASHBOARD_NATIVE_FILTERS_SET': True,
    'ENABLE_TEMPLATE_PROCESSING': True,
    'DASHBOARD_RBAC': True,
    'EMBEDDED_SUPERSET': True,
    'ALERT_REPORTS': True,
}

# Email configuration (optional)
SMTP_HOST = os.environ.get('SMTP_HOST', 'localhost')
SMTP_STARTTLS = True
SMTP_SSL = False
SMTP_USER = os.environ.get('SMTP_USER', '')
SMTP_PORT = 25
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '')
SMTP_MAIL_FROM = os.environ.get('SMTP_MAIL_FROM', 'superset@example.com')

# Authentication type
AUTH_TYPE = AUTH_DB

# Row limit for SQL Lab
ROW_LIMIT = 5000
DEFAULT_SQLLAB_LIMIT = 1000

# SQL Lab configuration
SQLLAB_TIMEOUT = 300
SQLLAB_ASYNC_TIME_LIMIT_SEC = 600
SQLALCHEMY_POOL_SIZE = 5
SQLALCHEMY_POOL_TIMEOUT = 30

# Upload folder
UPLOAD_FOLDER = '/app/superset_home/uploads/'
UPLOAD_CHUNK_SIZE = 4096

# Image and file upload configuration
ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'txt'}
CSV_TO_HIVE_UPLOAD_DIRECTORY_FUNC = lambda: '/tmp/'

# Mapbox API key (optional, for geospatial visualizations)
MAPBOX_API_KEY = os.environ.get('MAPBOX_API_KEY', '')

# Language
BABEL_DEFAULT_LOCALE = 'en'
LANGUAGES = {
    'en': {'flag': 'us', 'name': 'English'},
    'fr': {'flag': 'fr', 'name': 'French'},
}
