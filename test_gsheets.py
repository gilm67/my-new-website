import gspread
from google.oauth2.service_account import Credentials

# 1️⃣ Define the required Google API scopes
# - spreadsheets: to read/write data
# - drive: to open the file by name
SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]

# 2️⃣ Authenticate with the service account credentials
try:
    creds = Credentials.from_service_account_file("credentials.json", scopes=SCOPES)
    client = gspread.authorize(creds)
except Exception as e:
    print(f"❌ Failed to authenticate: {e}")
    exit()

# 3️⃣ Open your Google Sheet by name
SHEET_NAME = "Private Banker BP Data"
try:
    sheet = client.open(SHEET_NAME).sheet1
    print(f"✅ Connected to Google Sheet: {SHEET_NAME}")
except Exception as e:
    print(f"❌ Could not open Google Sheet: {e}")
    exit()

# 4️⃣ Append a test row
try:
    sheet.append_row(["Connection Test", "✅ Successful"], value_input_option='USER_ENTERED')
    print("✅ Test row added to the sheet successfully!")
except Exception as e:
    print(f"❌ Failed to add test row: {e}")