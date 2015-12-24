#!/usr/bin/env python
# -*- coding: utf-8 -*-

from sqlalchemy.ext.declarative import declarative_base


from sqlalchemy import Column, Integer, String,create_engine
#连接数据库
#engine = create_engine('mysql://root:bitbao@127.0.0.1/report?charset=utf8', echo=False)
<<<<<<< HEAD
engine = create_engine('mysql+mysqlconnector://root:123456@localhost:3307/mysqlTest',echo=True)
=======
engine = create_engine('mysql+mysqlconnector://root:@localhost:3306/toast')
>>>>>>> 20c48185164c0008fe2f0e3d261d742f9e2ac2b7
Base = declarative_base()
metadata = Base.metadata
class User(Base):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    username = Column(String)
    password = Column(String)
    realname = Column(String)
    email = Column(String)
    pinyin = Column(String)
    abbreviation = Column(String)
    token = Column(String)
    role = Column(String)

class Task(Base):
    __tablename__ = 'task'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    responsible = Column(Integer)
    type = Column(Integer)
    build = Column(Integer)
    svn_url = Column(String)
    report_to = Column(String)
    exclusive = Column(String)
    cron_time = Column(String)
    wait_machine= Column(String)
    report_filter= Column(String)
    status= Column(String)
    created_by= Column(String)
    updated_by= Column(String)
    create_time= Column(String)
    update_time= Column(String)
    project_id= Column(String)


if __name__ == "__main__":
    metadata.create_all(engine)
'''
Session = sessionmaker(bind=engine)
Session = sessionmaker()# engine = create_engine(...) 创建引擎
Session.configure(bind=engine)# 到这里engine应该已经创建
session = Session()
for t in session.query(User).filter_by(username = 'chifan'):
    print t.password

'''





'''for instance in session.query(User).order_by(User.id):
    print instance.username
def get_login_date(username):
    listUserPassword=dict()
    monthList=engine.execute("select * from user where username='chifan'")
    return monthList
print get_login_date('chifan')

'''