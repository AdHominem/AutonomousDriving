from twisted.internet.defer import inlineCallbacks
from autobahn.twisted.wamp import ApplicationSession, ApplicationRunner

mysession = None

class Component(ApplicationSession):
    def onConnect(self):
        global mysession
        self.join(self.config.realm, 
            [u'anonymous'],
            authextra=self.config.extra.get(u'authextra', None))
        mysession = self

    @inlineCallbacks
    def onJoin(self, details):
        def show_message(msg):
            print(msg)
        
        def start_check(msg):
            global mysession
            print('checking OBD worker {}'.format(mysession))
            try:
                mysession.call('conti.obdserver.getpoint', 4, 5)
                print("call result: {}".format(res))
                # TODO query Google
                # TODO publish results
                # self.publish('')
            except Exception as e:
                print("call error: {}".format(e))

        yield self.subscribe(show_message, 'conti.hackteam2.checkthehood.startcheck')
        yield self.subscribe(start_check, 'conti.hackteam2.poichecker.txmsg')

if __name__ == '__main__':
    ApplicationRunner(
        url=u'ws://192.168.40.122:8080/ws',
        realm=u'realm1',
        extra={u'authextra': {u'service_name': u'poi_checker'}}
    ).run(Component)
