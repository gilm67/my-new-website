import streamlit as st
import pandas as pd
from fpdf import FPDF
import gspread
from google.oauth2.service_account import Credentials
from pydrive2.auth import GoogleAuth
from pydrive2.drive import GoogleDrive
import datetime
import os

# --------------------------
# Google Authentication (Sheets + Drive)
# --------------------------
SERVICE_ACCOUNT_FILE = "service_account.json"
SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file"
]

credentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
gc = gspread.authorize(credentials)

# Google Drive Setup
gauth = GoogleAuth()
gauth.credentials = credentials
drive = GoogleDrive(gauth)

SHEET_URL = "https://docs.google.com/spreadsheets/d/1A__yEhD_0LYQwBF45wTSbWqdkRe0HAdnnBSj70qgpic/edit?gid=0#gid=0"

try:
    sh = gc.open_by_url(SHEET_URL)
    worksheet = sh.sheet1
    st.info("✅ Connected to Google Sheet.")
except Exception as e:
    st.warning(f"⚠️ Could not connect to Google Sheet: {e}")

st.set_page_config(page_title="🏦 Private Banker Business Plan Simulator", layout="wide")

st.markdown("### Executive Partners presents: Private Banker Business Plan Simulator with AI Scoring")
st.title("🏦 Private Banker Business Plan
