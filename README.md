# Nutri-Smart

## Prerequisites
- Python 3.x
- Node.js

## How to Run

### Backend
1. Open a terminal.
2. Navigate to the `back` folder:
   ```bash
   cd back
   ```
3. Install dependencies (if not already installed):
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

### Frontend
1. Open a new terminal.
2. Navigate to the `front` folder:
   ```bash
   cd front
   ```
3. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## Quick Start (Windows)
You can run the `start_all.bat` script to open both servers in new terminal windows automatically.

## Carga de base de datos
Tener instalado MongoDB, crear la base de datos "nutrismart" y también crear las colecciones:
- consultations  
- daily_records  
- foods  
- ingestions  
- notifications  
- profiles  
- users

Ejecutar el script seed_db.py estando en el folder back desde la terminal.
```bash
   cd back
   ```
```bash
   python seed_db.py
   ```