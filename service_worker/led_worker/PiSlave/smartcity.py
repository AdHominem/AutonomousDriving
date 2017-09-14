###############################################################################
#
# The MIT License (MIT)
#
# Copyright (c) Contintental Automotive GmbH foss@continental-corporation.com
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
#
###############################################################################

from os import environ
from twisted.internet.defer import inlineCallbacks
import time
from autobahn.twisted.wamp import ApplicationSession, ApplicationRunner
 
from neopixel import *
 
 
# LED strip configuration:
LED_COUNT      = 30      # Number of LED pixels.
LED_PIN        = 18      # GPIO pin connected to the pixels (18 uses PWM!).
#LED_PIN        = 10      # GPIO pin connected to the pixels (10 uses SPI /dev/spidev0.0).
LED_FREQ_HZ    = 800000  # LED signal frequency in hertz (usually 800khz)
LED_DMA        = 5       # DMA channel to use for generating signal (try 5)
LED_BRIGHTNESS = 255     # Set to 0 for darkest and 255 for brightest
LED_INVERT     = False   # True to invert the signal (when using NPN transistor level shift)
LED_CHANNEL    = 0       # set to '1' for GPIOs 13, 19, 41, 45 or 53
LED_STRIP      = ws.WS2811_STRIP_GRB   # Strip type and colour ordering
 
 
 
# Define functions which animate LEDs in various ways.

def colorWipeWorker(strip, color, wait_ms=50, start_led=0):
    """Wipe color across display a pixel at a time."""
    for i in range(10):
        strip.setPixelColor( (i+start_led), color)
        strip.show()
        time.sleep(wait_ms/1000.0)
    led_off = Color(0,0,0)
    for i in range(10):
        strip.setPixelColor( (i+start_led), led_off)
        strip.show()    

def colorWipe(strip, color, wait_ms=50):
    """Wipe color across display a pixel at a time."""
    for i in range(strip.numPixels()):
        strip.setPixelColor(i, color)
        strip.show()
        time.sleep(wait_ms/1000.0)
 
def theaterChase(strip, color, wait_ms=50, iterations=10):
    """Movie theater light style chaser animation."""
    for j in range(iterations):
        for q in range(3):
            for i in range(0, strip.numPixels(), 3):
                strip.setPixelColor(i+q, color)
            strip.show()
            time.sleep(wait_ms/1000.0)
            for i in range(0, strip.numPixels(), 3):
                strip.setPixelColor(i+q, 0)
 
def wheel(pos):
    """Generate rainbow colors across 0-255 positions."""
    if pos < 85:
        return Color(pos * 3, 255 - pos * 3, 0)
    elif pos < 170:
        pos -= 85
        return Color(255 - pos * 3, 0, pos * 3)
    else:
        pos -= 170
        return Color(0, pos * 3, 255 - pos * 3)
 
def rainbow(strip, wait_ms=20, iterations=1):
    """Draw rainbow that fades across all pixels at once."""
    for j in range(256*iterations):
        for i in range(strip.numPixels()):
            strip.setPixelColor(i, wheel((i+j) & 255))
        strip.show()
        time.sleep(wait_ms/1000.0)
 
def rainbowCycle(strip, wait_ms=20, iterations=5):
    """Draw rainbow that uniformly distributes itself across all pixels."""
    for j in range(256*iterations):
        for i in range(strip.numPixels()):
            strip.setPixelColor(i, wheel((int(i * 256 / strip.numPixels()) + j) & 255))
        strip.show()
        time.sleep(wait_ms/1000.0)
 
def theaterChaseRainbow(strip, wait_ms=50):
    """Rainbow movie theater light style chaser animation."""
    for j in range(256):
        for q in range(3):
            for i in range(0, strip.numPixels(), 3):
                strip.setPixelColor(i+q, wheel((i+j) % 255))
            strip.show()
            time.sleep(wait_ms/1000.0)
            for i in range(0, strip.numPixels(), 3):
                strip.setPixelColor(i+q, 0)

class Component(ApplicationSession):
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
            colorWipe(strip, Color(255, 0, 0))  # Red wipe
            return "red Wipe"

        def greenWipe():
            colorWipe(strip, Color(0, 255, 0))  # Gree wipe
            return "blue Wipe"

        def blueWipe():
            colorWipe(strip, Color(0, 0, 255))  # Blue wipe
            return "green Wipe"

        def whiteTheater():
            theaterChase(strip, Color(127, 127, 127))  # White theater chase
            return "white theater"

        def customcolor(red, green, blue):
            colorWipe(strip, Color(red, green, blue))
            return u"red {} - blue {} - green {} -".format(red, blue, green)

        yield self.register(workerVisualization, u'conti.smartcity.workerVisualization')
        yield self.register(redWipe, u'conti.smartcity.redWipe')
        yield self.register(blueWipe, u'conti.smartcity.blueWipe')
        yield self.register(greenWipe, u'conti.smartcity.greenWipe')
        yield self.register(whiteTheater, u'conti.smartcity.whitetheater')
        yield self.register(customcolor, u'conti.smartcity.customcolor')
        print("Procedures registered; ready for frontend.")


if __name__ == '__main__':
    # Create NeoPixel object with appropriate configuration.
    strip = Adafruit_NeoPixel(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL, LED_STRIP)
    # Intialize the library (must be called once before other functions).
    strip.begin()

    runner = ApplicationRunner(
        environ.get("AUTOBAHN_DEMO_ROUTER", u"ws://127.0.0.1:8080/ws"),
        u"realm1",
    )
    runner.run(Component)
