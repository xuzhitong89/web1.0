# --coding: utf-8 --
import web
from views import *
urls = (
    "/login", "login",
    "/adminmanger", "adminManger",
    "/manger", "manger",
    "/test", "test",
    "/view", "view",
    "/logout", "logout",
    "/createTask", "createTask",
    "/admin/", "admin",
    "/user/(.*)", "user",
    "/projectmanger", "projectManger",
    "/userManger", "userManger",
    "/projectlist", "projectList",
    "/userlist", "userList"
    )
app = web.application(urls, globals(), autoreload=True)
initializer = {'isLogin': False, 'userName': ''}
session = web.session.Session(app, web.session.DiskStore('sessions'), initializer)
web.config.debug = True
'''
web.config.session_parameters['cookie_name'] = 'webpy_session_id'#保存session id的Cookie的名称
web.config.session_parameters['cookie_domain'] = None #保存session id的Cookie的domain信息
web.config.session_parameters['timeout'] = 60 #的有效时间 ，以秒为单位
web.config.session_parameters['ignore_expiry'] = False # 如果为True，session就永不过期
web.config.session_parameters['ignore_change_ip'] = False #果为False，就表明只有在访问该session的IP与创建该session的IP完全一致时，session才被允许访问。
#web.config.session_parameters['secret_key'] = 'fLjUfxqXtfNoIldA0A0J' #密码种子，为session加密提供一个字符串种子
web.config.session_parameters['expired_message'] = 'Session expired'#过期时显示的提示信息。
'''
app.add_processor(web.loadhook(my_loadhook))
def notfound():
    return web.notfound(render.notfound())
def internalerror():
    return web.internalerror(render.servererror())
app.notfound = notfound
app.internalerror = internalerror
app.add_processor(load_sqla)

def getSession():
    if '_session' not in web.config:
        web.config._session = session

if __name__ == "__main__":
    getSession()
    app.run()