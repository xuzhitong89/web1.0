# -*- coding: utf-8 -*-
import web
from models import *
from sqlalchemy.orm import scoped_session, sessionmaker
def load_sqla(handler):
    web.ctx.orm = scoped_session(sessionmaker(bind=engine))
    try:
        return handler()
    except web.HTTPError:
       web.ctx.orm.commit()
       raise
    except:
        web.ctx.orm.rollback()
        raise
    finally:
        web.ctx.orm.commit()
        web.ctx.orm.close()
def login_password(username,password):
    print username
    try:
        if username == "admin" and password == "1":
            return 0
        else:
            t = web.ctx.orm.query(User).filter_by(username="%s" % (username),password="%s" % (password) ).one()
            return 1
    except:
        return -1
def login_password(username,password):
    print username
    try:
        if username == "admin" and password == "1":
            return 0
        else:
            t = web.ctx.orm.query(User).filter_by(username="%s" % (username),password="%s" % (password) ).one()
            return 1
    except:
        return -1

