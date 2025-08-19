#!/bin/bash
# Script per riavviare il server

echo "🔄 Riavvio Cosmic Heroes Liberation..."

# Ferma tutti i processi http-server
echo "🛑 Fermo server esistenti..."
pkill -f "http-server" || true

# Aspetta un momento
sleep 2

# Riavvia
echo "🚀 Riavvio server..."
./start.sh
