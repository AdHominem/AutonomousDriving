# PiSlave

This is the LED driver. It must run on the Service Router because it needs access to HW peripherals. 
If you want to code on this on your development host you should use smartcity_mockup.py to eliminate HW dependencies.


## Quick start
Start Slave on Service Router

```
cd ~/hackathon/LED_Worker/PiSlave
# needs sudo to access PWM
sudo python smartcity.py
```