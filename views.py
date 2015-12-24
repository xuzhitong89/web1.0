 # --coding: utf-8 --
import web
from web.contrib.template import render_jinja
from sqlalchemy.orm import scoped_session, sessionmaker
from models import *
from data_module import *
d = dict()
render = render_jinja(
    'templates/site/',
    encoding='utf-8',
)

def notfound():
    return web.notfound(render.notfound())
def internalerror():
    return web.internalerror(render.servererror())
def my_loadhook():
    web.ctx.session = web.config._session


# 登录装饰器函数
def login_required(func):
    def Function(*args):
        if web.ctx.session.isLogin == False:
            raise web.seeother('/login')
        else:
            return func(*args)
    return Function

#加载admin模板装饰器
def adminRender():
    render = render_jinja('templates/admin/', encoding='utf-8',)
    return render
adminrender = adminRender()
#登录页面
class login:
    def GET(self):
        d['error'] = ''
        return render.login(d)
    def POST(self):
        username=web.input().username
        password=web.input().password
        print username, password
        t=login_password(username,password)
        print t
        if t == 1:
            web.ctx.session.isLogin = True
            web.ctx.session.userName = username
            web.ctx.session.Password = password
            d['username'] = web.ctx.session.userName
            print d['username'] +u'登录用户'
            raise web.seeother('/manger')
        elif t == -1:
            d['error'] = u"用户名或密码错误!"
            return render.login(d)
        elif t == 0:
            web.ctx.session.isLogin = True
            web.ctx.session.userName = username
            web.ctx.session.Password = password
            d['username'] = web.ctx.session.userName
            print d['username'] + u'登录用户'
            return adminrender.adminmanger(d)
#退出
class logout():
    def GET(self):
        web.ctx.session.kill()
        raise web.seeother('/login')
#个人页面
class manger():
    @login_required
    def GET(self):
        return render.manger(d)
#admin页面
class adminManger():
    @login_required
    def GET(self):
        return adminrender.adminmanger(d)

class admin():
    @login_required
    def GET(self):
        return render.createTask()

    def POST(self):
        raise web.seeother('/case')

class user():
    @login_required
    def GET(self):
        return render.createTask()

    def POST(self):
        raise web.seeother('/case')

class createTask():
    @login_required
    def GET(self):
        return render.createTask()

    def POST(self):
        raise web.seeother('/case')



class test():
    @login_required
    def GET(self):
        return render.test()
#创建项目页面
class projectManger():
    @login_required
    def GET(self):
        render = render_jinja('templates/admin/',encoding='utf-8',)
        return render.projectmanger(d)

#创建用户页面
class userManger():
    @login_required
    def GET(self):
        render = render_jinja('templates/admin/', encoding='utf-8',)
        return render.usermanger(d)
#项目列表页面
class projectList():
    @login_required
    def GET(self):
        return adminrender.projectlist(d)
class userList():
    @login_required
    def GET(self):
        return adminrender.userlist(d)
