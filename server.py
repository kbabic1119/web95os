"""
DOOM-compatible dev server with COOP/COEP headers for SharedArrayBuffer/WASM threads.
Run: python server.py
"""
from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

class COIHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        self.send_header("Cross-Origin-Embedder-Policy", "require-corp")
        self.send_header("Cross-Origin-Resource-Policy", "cross-origin")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass  # silent

print("Server: http://localhost:8080")
HTTPServer(("", 8080), COIHandler).serve_forever()
