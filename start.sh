#!/bin/bash
# Script per avviare il server

echo "🚀 Avvio Cosmic Heroes Liberation..."
echo "📍 Porta: 3002"
echo "🌐 URL: http://localhost:3002"

# Crea la directory js se non esiste
if [ ! -d "public/js" ]; then
    echo "📁 Creazione directory public/js..."
    mkdir -p public/js
fi

# Copia i file JavaScript se non esistono
if [ ! -f "public/js/main.js" ]; then
    echo "📋 Copia file JavaScript..."
    cp -r src/* public/js/
fi

# Avvia il server
echo "🔥 Avvio server http-server..."
http-server -p 3002 --cors

echo "✅ Server avviato su http://localhost:3002"
echo "🛑 Premi Ctrl+C per fermare"
