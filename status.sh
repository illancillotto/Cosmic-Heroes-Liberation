#!/bin/bash
# Script per controllare lo stato del server

echo "📊 Stato Cosmic Heroes Liberation..."

# Controlla se il server è attivo
if pgrep -f "http-server" > /dev/null; then
    echo "🟢 Server ATTIVO"
    echo "📍 Porta: 3002"
    echo "🌐 URL: http://localhost:3002"
    
    # Mostra i processi
    echo "🔍 Processi attivi:"
    pgrep -f "http-server" | xargs ps -p
else
    echo "🔴 Server NON ATTIVO"
fi

# Controlla se la porta è in uso
if netstat -tuln 2>/dev/null | grep ":3002" > /dev/null; then
    echo "🔌 Porta 3002 in uso"
else
    echo "🔌 Porta 3002 libera"
fi
