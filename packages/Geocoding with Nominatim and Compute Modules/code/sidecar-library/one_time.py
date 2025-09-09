import threading


# TODO: Replace this with a deserialization function in a broadcasted class
class OneTimePerExecutorOperation:
    def __init__(self):
        self._lock = threading.Lock()
        self._done = False

    def do_once(self, operation):
        if self._done:
            return

        with self._lock:
            if not self._done:
                operation()
                self._done = True

    def __getstate__(self):
        return {}

    def __setstate__(self, state):
        # Always create a new instance with fresh state
        self.__init__()
