#!/usr/bin/env python3
import http.server
import socketserver
import os

# Configuration du serveur
PORT = 8080
DIRECTORY = "/app"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # Ajout des headers CORS pour éviter les problèmes
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_GET(self):
        # Redirection automatique vers la page d'accueil si on accède à /
        if self.path == '/' or self.path == '/simple':
            self.path = '/algerie-excursions-simple.html'
        return super().do_GET()

if __name__ == "__main__":
    os.chdir(DIRECTORY)
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"🌐 Serveur démarré sur le port {PORT}")
        print(f"📱 Votre page web est accessible à :")
        print(f"   👉 http://localhost:{PORT}/algerie-excursions-simple.html")
        print(f"   👉 http://localhost:{PORT}/simple")
        print(f"   👉 http://localhost:{PORT}/")
        print(f"")
        print(f"🛑 Pour arrêter le serveur : Ctrl+C")
        print(f"")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print(f"\n🔴 Serveur arrêté")
            httpd.shutdown()