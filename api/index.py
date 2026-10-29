import os
import sys
import traceback
from pathlib import Path

CURRENT_DIR = Path(__file__).resolve().parent
ROOT_DIR = CURRENT_DIR.parent
BACKEND_DIR = ROOT_DIR / 'backend'

sys.path.insert(0, str(BACKEND_DIR))
sys.path.insert(0, str(CURRENT_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

_django_app = None
_init_error = None

try:
    import django
    django.setup()
    from django.core.wsgi import get_wsgi_application
    _django_app = get_wsgi_application()
except Exception:
    _init_error = traceback.format_exc()

def app(environ, start_response):
    if _init_error:
        start_response('200 OK', [('Content-Type', 'text/plain')])
        return [f"DJANGO_INIT_ERROR:\n{_init_error}".encode('utf-8')]
    
    path = environ.get('PATH_INFO', '')
    if 'debug' in path:
        start_response('200 OK', [('Content-Type', 'text/plain')])
        return [f"DEBUG_OK: PATH_INFO={path}".encode('utf-8')]

    try:
        if not path.startswith('/api'):
            environ['PATH_INFO'] = '/api' + path
        return _django_app(environ, start_response)
    except Exception:
        start_response('200 OK', [('Content-Type', 'text/plain')])
        return [f"DJANGO_RUNTIME_ERROR:\n{traceback.format_exc()}".encode('utf-8')]

application = app
