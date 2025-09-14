import streamlit as st
import pandas as pd
import gspread
from google.oauth2.service_account import Credentials
import datetime

# -------------------------
# PAGE CONFIG
# -------------------------
st.set_page_config(page_title="🏦 Private Banker Business Plan Simulator", layout="wide")

st.write("### Executive Partners – Confidential AI-Enhanced Business Plan Simulator")
st.write("_Professional evaluation of Private Bankers with AI traffic-light scoring._")

# -------------------------
# GOOGLE SHEETS SETUP
# -------------------------
SERVICE_ACCOUNT_FILE = "service_account.json"
SCOPES = ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/drive"]

try:
    credentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    gc = gspread.authorize(credentials)
    SHEET_URL = "https://docs.google.com/spreadsheets/d/1A__yEhD_0LYQwBF45wTSbWqdkRe0HAdnnBSj70qgpic/edit#gid=0"
    sh = gc.open_by_url(SHEET_URL)
    worksheet = sh.sheet1
    st.success("✅ Connected to Google Sheet successfully!")
except Exception as e:
    st.warning(f"⚠️ Could not connect to Google Sheet: {e}")

# -------------------------
# SECTION 1: Candidate Information
# -------------------------
st.header("1️⃣ Candidate Information")

col1, col2, col3 = st.columns(3)
with col1:
    candidate_name = st.text_input("Candidate Name")
    candidate_email = st.text_input("Candidate Email")
    years_exp = st.number_input("Years of Experience", min_value=0, max_value=50)
    current_role = st.selectbox("Current Role", ["Managing Director", "Senior Relationship Manager", 
                                                 "Relationship Manager", "Investment Advisor"])
with col2:
    current_employer = st.text_input("Current Employer")
    current_book = st.number_input("Current Book AUM (in millions)", min_value=0.0, step=0.1)
    base_salary = st.number_input("Base Salary", min_value=0.0, step=1000.0)
    last_bonus = st.number_input("Last Bonus (Received)", min_value=0.0, step=1000.0)
with col3:
    location = st.selectbox("Current Location", ["Geneva", "Zurich", "Dubai", "London", 
                                                 "Hong Kong", "Singapore", "New York", "Miami"])
    currency = st.selectbox("Currency", ["CHF", "EUR", "USD", "GBP", "AED", "HKD", "SGD"])
    book_origin = st.slider("Book Origin % Inherited", 0, 100, 0)
    uploaded_cv = st.file_uploader("Upload Candidate CV (PDF or DOCX)", type=["pdf", "docx"])

st.divider()

# -------------------------
# SECTION 2: NNM & ROA Projections
# -------------------------
st.header("2️⃣ NNM & ROA Projections")

proj_data = []
for year in range(1, 4):
    col1, col2, col3 = st.columns(3)
    with col1:
        nnm = st.number_input(f"NNM Year {year} (in millions)", min_value=0.0, step=0.1)
    with col2:
        aum = st.number_input(f"Projected AUM Year {year} (in millions)", min_value=0.0, step=0.1)
    with col3:
        roa = st.number_input(f"Projected ROA Year {year} (%)", min_value=0.0, step=0.01)

    revenue = aum * 1_000_000 * (roa / 100)  # Convert millions × ROA%
    proj_data.append([year, nnm, aum, roa, revenue])

proj_df = pd.DataFrame(proj_data, columns=["Year", "NNM (M)", "Projected AUM (M)", "ROA (%)", "Revenue"])
proj_df["Revenue"] = proj_df["Revenue"].astype(float).round(2)

# Add TOTAL row without breaking types
total_row = pd.DataFrame([["TOTAL", proj_df["NNM (M)"].sum(), proj_df["Projected AUM (M)"].sum(), "", proj_df["Revenue"].sum()]], 
                         columns=proj_df.columns)
proj_display = pd.concat([proj_df, total_row], ignore_index=True)

st.dataframe(proj_display, use_container_width=True)

st.divider()

# -------------------------
# SECTION 3: Enhanced NNA / Prospects Table
# -------------------------
st.header("3️⃣ Enhanced NNA / Prospects Table")

st.write("List prospects with total wealth and NNM projections. Dropdown for source type is included.")

prospects = st.data_editor(
    pd.DataFrame(columns=["Prospect Name", "Source (Self/Inherited/Finder)", 
                          "Total Client Wealth (M)", "Best Case NNM (M)", "Worst Case NNM (M)"]),
    num_rows="dynamic",
    use_container_width=True
)

if not prospects.empty:
    numeric_cols = ["Total Client Wealth (M)", "Best Case NNM (M)", "Worst Case NNM (M)"]
    for col in numeric_cols:
        prospects[col] = pd.to_numeric(prospects[col], errors="coerce").fillna(0)

    totals = prospects[numeric_cols].sum()
    total_row = pd.DataFrame([["TOTAL", "", *totals]], columns=prospects.columns)
    summary_df = pd.concat([prospects, total_row], ignore_index=True)
    st.dataframe(summary_df, use_container_width=True)

st.divider()

# -------------------------
# SECTION 4: Cost & Net Margin Analysis
# -------------------------
st.header("4️⃣ Cost & Net Margin Analysis")

social_charges = base_salary * 0.25
total_cost = base_salary + last_bonus + social_charges

margin_data = []
for i, row in proj_df.iterrows():
    gross_rev = row["Revenue"]
    net_margin = gross_rev - total_cost
    margin_data.append([int(row["Year"]), gross_rev, total_cost, net_margin])

margin_df = pd.DataFrame(margin_data, columns=["Year", "Gross Revenue", "Total Cost", "Net Margin"])
margin_df[["Gross Revenue", "Total Cost", "Net Margin"]] = margin_df[["Gross Revenue", "Total Cost", "Net Margin"]].round(2)

st.dataframe(margin_df, use_container_width=True)
st.bar_chart(margin_df.set_index("Year")[["Gross Revenue", "Net Margin"]])

# AI Traffic-Light Scoring
st.subheader("AI Recruiter Scoring")
score = 0
if base_salary >= 200000 and last_bonus >= 50000 and years_exp >= 5:
    score = 3
elif base_salary >= 150000 and last_bonus >= 30000:
    score = 2
else:
    score = 1

if score == 3:
    st.success("🟢 High potential hunter")
elif score == 2:
    st.warning("🟡 Moderate potential – mixed profile")
else:
    st.error("🔴 Likely farmer profile")

st.success("✅ Business Plan simulation complete.")
