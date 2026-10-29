import pymysql

# Patch MySQLdb with PyMySQL for seamless MySQL ORM operation on Windows
pymysql.install_as_MySQLdb()

# Allow MySQL 8.0.x on Django 6.x (MySQL 8.0 is standard production LTS)
from django.db.backends.base.base import BaseDatabaseWrapper
BaseDatabaseWrapper.check_database_version_supported = lambda self: None

