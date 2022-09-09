# Install-webhooks Example (Python server)
A Flask server implementation

## Requirements
 - Python 3
 - [Configured .env file](../../README.md)

## How to run
1. Create and activate a new virtual environment

2. Install dependencies

3. Export and run the application

#### MacOS / Unix
```bash
python3 -m venv env
source env/bin/activate

pip install -r requirements.txt

export FLASK_APP=index.py
python3 -m flask run --port=8080
```

#### Windows (PowerShell)

```bash
python3 -m venv env
.\env\Scripts\activate.bat

pip install -r requirements.txt

$env:FLASK_APP=“server.py"
python3 -m flask run --port=8080
```
Server is running on `localhost:8080`