import streamlit as st
import pandas as pd
import datetime
import gspread
from google.oauth2.service_account import Credentials
from fpdf import FPDF
import os

# --------------------------
# Streamlit Page Config
# --------------------------
st.set_page_config(page_title="🏦 Private Banker Business Plan Simulator", layout="wide")

st.caption("**Executive Partners** presents the Private Banker Business Plan Simulator with AI Recruiter Scoring")

st.title("🏦 Private Banker Business Plan Simulator")

# --------------------------
# Google Sheets Setup (Lazy)
# --------------------------
SERVICE_ACCOUNT_FILE = "service_account.json"
SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]
SHEET_URL = "https://docs.google.com/spreadsheets/d/1A__yEhD_0LYQwBF45wTSbWqdkRe0HAdnnBSj70qgpic/edit#gid=0"

@st.cache_resource
def get_gsheets_client():
    try:
        credentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        return gspread.authorize(credentials)
    except Exception as e:
        st.warning(f"⚠️ Google Sheets connection failed: {e}")
        return None

# --------------------------
# SECTION 1: Candidate Information
# --------------------------
st.header("1️⃣ Candidate Information")

col1, col2, col3 = st.columns(3)
with col1:
    candidate_name = st.text_input("Candidate Name")
    candidate_email = st.text_input("Candidate Email")
    years_exp = st.number_input("Years of Experience", min_value=0, max_value=50)
    current_role = st.selectbox("Current Role", ["Managing Director", "Senior Relationship Manager", "Relationship Manager", "Investment Advisor"])
with col2:
    current_employer = st.text_input("Current Employer")
    market = st.selectbox("Primary Market Covered", [
        "Swiss Onshore", "LATAM", "MEA", "Turkey", "CIS", "CEE",
        "Spain", "Portugal", "Nordics", "US", "UK", "Hong Kong", "Singapore"
    ])
    base_salary = st.number_input("Base Salary", min_value=0.0, step=1000.0)
    last_bonus = st.number_input("Last Bonus (Received)", min_value=0.0, step=1000.0)
with col3:
    location = st.selectbox("Location", ["Geneva","Zurich","Dubai","Hong Kong","Singapore","New York","Miami","London"])
    currency = st.selectbox("Currency", ["CHF", "EUR", "USD", "GBP", "AED", "HKD", "SGD"])
    book_origin = st.slider("Book Origin % Inherited", 0, 100, 0)
    current_book = st.number_input("Current Book AUM (in millions)", min_value=0.0, step=0.1)

uploaded_cv = st.file_uploader("Upload Candidate CV (PDF/DOCX)", type=["pdf", "docx"])

st.divider()

# --------------------------
# SECTION 2: NNM & ROA Projections
# --------------------------
st.header("2️⃣ NNM & ROA Projections")

proj_data = []
for year in range(1, 4):
    col1, col2 = st.columns(2)
    with col1:
        nnm = st.number_input(f"NNM Year {year} (in millions)", min_value=0.0, step=0.1)
    with col2:
        roa = st.number_input(f"Projected ROA Year {year} (%)", min_value=0.0, step=0.01)
    revenue = nnm * 1_000_000 * (roa / 100)
    proj_data.append([year, nnm, roa, revenue])

proj_df = pd.DataFrame(proj_data, columns=["Year", "NNM (M)", "ROA (%)", "Revenue"])
proj_df["Revenue"] = proj_df["Revenue"].astype(float).round(2)

total_row = pd.DataFrame([["TOTAL", proj_df["NNM (M)"].sum(), "", proj_df["Revenue"].sum()]],
                         columns=proj_df.columns)

proj_display = pd.concat([proj_df, total_row], ignore_index=True)
proj_display_style = proj_display.copy()
proj_display_style["NNM (M)"] = proj_display_style["NNM (M)"].apply(lambda x: f"{x:,.2f}" if str(x).replace('.','',1).isdigit() else x)
proj_display_style["Revenue"] = proj_display_style["Revenue"].apply(lambda x: f"{x:,.2f}" if str(x).replace('.','',1).isdigit() else x)

st.dataframe(proj_display_style, use_container_width=True)

st.divider()

# --------------------------
# SECTION 3: Enhanced NNA / Prospects Table
# --------------------------
st.header("3️⃣ Enhanced NNA / Prospects Table")

prospects = st.data_editor(
    pd.DataFrame(columns=["Prospect Name", "Source", "Total Client Wealth (M)", "Best Case NNM (M)", "Worst Case NNM (M)"]),
    num_rows="dynamic",
    use_container_width=True
)

if not prospects.empty:
    numeric_cols = ["Total Client Wealth (M)", "Best Case NNM (M)", "Worst Case NNM (M)"]
    for col in numeric_cols:
        prospects[col] = pd.to_numeric(prospects[col], errors="coerce").fillna(0)
    totals = prospects[numeric_cols].sum()
    total_row = pd.DataFrame([["TOTAL", "", *totals]], columns=prospects.columns)
    display_prospects = pd.concat([prospects, total_row], ignore_index=True)
    display_prospects_style = display_prospects.copy()
    for col in numeric_cols:
        display_prospects_style[col] = display_prospects_style[col].apply(lambda x: f"{x:,.2f}" if isinstance(x,(int,float)) else x)
    st.dataframe(display_prospects_style, use_container_width=True)

st.divider()

# --------------------------
# SECTION 4: Cost & Net Margin Analysis
# --------------------------
st.header("4️⃣ Cost & Net Margin Analysis")

social_charges = base_salary * 0.25
total_cost = base_salary + last_bonus + social_charges

margin_data = []
for i, row in proj_df.iterrows():
    gross_rev = row["Revenue"]
    net_margin = gross_rev - total_cost
    margin_data.append([int(row["Year"]), gross_rev, total_cost, net_margin])

margin_df = pd.DataFrame(margin_data, columns=["Year", "Gross Revenue", "Total Cost", "Net Margin"])
margin_df[["Gross Revenue", "Total Cost", "Net Margin"]] = margin_df[["Gross Revenue", "Total Cost", "Net Margin"]].astype(float).round(2)

margin_display = margin_df.copy()
for col in ["Gross Revenue","Total Cost","Net Margin"]:
    margin_display[col] = margin_display[col].apply(lambda x: f"{x:,.2f}")

st.dataframe(margin_display, use_container_width=True)
st.bar_chart(margin_df.set_index("Year")[["Gross Revenue", "Net Margin"]])

st.success("✅ Business Plan simulation complete.")
