from os import environ
from twisted.internet.defer import inlineCallbacks
import time
from autobahn.twisted.wamp import ApplicationSession, ApplicationRunner
from twisted.internet.defer import inlineCallbacks
from os import environ
from autobahn.twisted.wamp import ApplicationSession, ApplicationRunner


class TracingComponent(ApplicationSession):
    """
    An LED application providing procedures for controlling light color and patterns
    """

    @inlineCallbacks
    def onJoin(self, details):
        print("LED attached")
        def workerVisualization(worker_1="off", worker_2="off", worker_3="off"):
            loc_offset = 0
            loc_color = Color(255,0,0) #worker_1 color
            worker_switch = {
                "off":  lambda off:   colorWipeWorker(strip,Color(0,0,0),10,loc_offset),
                "slow": lambda slow:  colorWipeWorker(strip,loc_color,120,loc_offset),
                "mid":  lambda mid:   colorWipeWorker(strip,loc_color,60,loc_offset),
                "fast": lambda fast:  colorWipeWorker(strip,loc_color,30,loc_offset)
            }
            worker_switch[worker_1](self)
            loc_offset = 10
            loc_color = Color(0,255,0)
            worker_switch[worker_2](self)
            loc_offset = 20
            loc_color = Color(0,0,255)
            worker_switch[worker_3](self) 
        def redWipe():
            print("sfwef")
            return "red Wipe"

        def greenWipe():
            print("sfwef")
            return "blue Wipe"

        def blueWipe():
            print("sfwef")
            return "green Wipe"

        def whiteTheater():
            print("sfwef")
            return "white theater"

        def customcolor(red, green, blue):
            print("sfwef")
            return u"red {} - blue {} - green {} -".format(red, blue, green)

        yield self.register(workerVisualization, u'conti.smartcity.workerVisualization')
        yield self.register(redWipe, u'conti.smartcity.redWipe')
        yield self.register(blueWipe, u'conti.smartcity.blueWipe')
        yield self.register(greenWipe, u'conti.smartcity.greenWipe')
        yield self.register(whiteTheater, u'conti.smartcity.whitetheater')
        yield self.register(customcolor, u'conti.smartcity.customcolor')
        print("Procedures registered; ready for frontend.")




class Edge_Component(ApplicationSession):
    
    @inlineCallbacks
    def onJoin(self, details):
        def getpinglist(arg):
            print(arg)
        yield self.subscribe(getpinglist, u'conti.network.pinglist')
        print("ping subscribed")


if __name__ == '__main__':

    runner = ApplicationRunner(
        environ.get("AUTOBAHN_DEMO_ROUTER", u"ws://192.168.40.102:8899/ws"),
        u"conti",
    )
    edge_runner = ApplicationRunner(
        environ.get("AUTOBAHN_DEMO_ROUTER", u"ws://192.168.40.122:8080/ws"),
        u"realm1",
    )
    runner.run(TracingComponent)
    edge_runner.run(Edge_Component)
