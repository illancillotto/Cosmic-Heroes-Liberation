# Makefile per Cosmic Heroes Liberation

.PHONY: start stop restart status clean install

# Variabili
PORT = 3002
URL = http://localhost:$(PORT)

# Avvia il server
start:
	@echo "🚀 Avvio Cosmic Heroes Liberation..."
	@echo "📍 Porta: $(PORT)"
	@echo "🌐 URL: $(URL)"
	@if [ ! -d "public/js" ]; then \
		echo "📁 Creazione directory public/js..."; \
		mkdir -p public/js; \
	fi
	@if [ ! -f "public/js/main.js" ]; then \
		echo "📋 Copia file JavaScript..."; \
		cp -r src/* public/js/; \
	fi
	@echo "🔥 Avvio server http-server..."
	@http-server -p $(PORT) --cors

# Ferma il server
stop:
	@echo "🛑 Fermo Cosmic Heroes Liberation..."
	@PIDS=$$(pgrep -f "http-server"); \
	if [ ! -z "$$PIDS" ]; then \
		echo "🔍 Processi trovati: $$PIDS"; \
		echo "💀 Terminazione processi..."; \
		kill -9 $$PIDS; \
		echo "✅ Server fermato"; \
	else \
		echo "ℹ️  Nessun server attivo trovato"; \
	fi

# Riavvia il server
restart: stop
	@echo "🔄 Riavvio in corso..."
	@sleep 2
	@$(MAKE) start

# Controlla lo stato
status:
	@echo "📊 Stato Cosmic Heroes Liberation..."
	@if pgrep -f "http-server" > /dev/null; then \
		echo "🟢 Server ATTIVO"; \
		echo "📍 Porta: $(PORT)"; \
		echo "🌐 URL: $(URL)"; \
	else \
		echo "🔴 Server NON ATTIVO"; \
	fi

# Pulisce i file temporanei
clean:
	@echo "🧹 Pulizia file temporanei..."
	@rm -rf public/js
	@echo "✅ Pulizia completata"

# Installa le dipendenze
install:
	@echo "📦 Installazione dipendenze..."
	@npm install
	@npm install -g http-server
	@echo "✅ Installazione completata"

# Aiuto
help:
	@echo "🎮 Cosmic Heroes Liberation - Comandi disponibili:"
	@echo ""
	@echo "🚀 make start    - Avvia il server"
	@echo "🛑 make stop     - Ferma il server"
	@echo "🔄 make restart  - Riavvia il server"
	@echo "📊 make status   - Controlla lo stato"
	@echo "🧹 make clean    - Pulisce file temporanei"
	@echo "📦 make install  - Installa dipendenze"
	@echo "❓ make help     - Mostra questo aiuto"
