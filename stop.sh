#!/bin/bash
# Script per fermare il server

echo "🛑 Fermo Cosmic Heroes Liberation..."

# Trova e ferma tutti i processi http-server
PIDS=$(pgrep -f "http-server")
if [ ! -z "$PIDS" ]; then
    echo "🔍 Processi trovati: $PIDS"
    echo "💀 Terminazione processi..."
    kill -9 $PIDS
    echo "✅ Server fermato"
else
    echo "ℹ️  Nessun server attivo trovato"
fi
