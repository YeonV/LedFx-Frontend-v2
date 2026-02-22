import sys
import types
m = types.ModuleType('sounddevice')
sys.modules['sounddevice'] = m
