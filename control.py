# --coding: utf-8 --
import jenkins
server = jenkins.Jenkins('http://172.16.14.189:8080/jenkins/', username='xuzhitong', password='qaz123')

#获取job列表信息
def get_jobs_list():
    return server.get_jobs()

#获取视图列表
def get_views_list():
    return server.get_views()

#创建job
def create_job(jobname,xml):
    server.create_job(jobname,xml)
    '''file_object = open('E:\config.xml')
    xml = file_object.read( )
    file_object.close( )
    create_job('chifan2', xml)'''

#删除job
def delete_job(jobname):
    server.delete_job(jobname)

#构建job
def buid_job(jobname):
    server.build_job(jobname)

#获取job配置数据
def get_job_config(jobname):
    return server.get_job_config(jobname)
#获取job任务的构建日志（构建任务名字，构建次数）

def get_build_info(jobname,number):
    return server.get_build_info(jobname,number)

#获取job执行结果数据
def get_build_console_output( jobname, number):
    return get_build_console_output(jobname, number)

#获取节点信息
def get_node():
    return server.get_nodes()

#获取节点配置信息
def get_node_indo(slavename):
    return server.get_node_info(slavename)
if __name__ == "__main__":
    #print buid_job('job')
    print get_jobs_list()
    print get_views_list()
    print get_node()
    #print get_node_indo('xiaobin')
    #t = get_job_config('job')
    #print t
    #create_job('job4',t)
    print get_jobs_list()