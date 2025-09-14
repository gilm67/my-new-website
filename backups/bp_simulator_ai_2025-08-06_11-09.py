import streamlit as st
import pandas as pd
import numpy as np
import gspread
from google.oauth2.service_account import Credentials
from fpdf import FPDF

st.set_page_config(page_title="🏦 Private Banker Business Plan Simulator", layout="wide")

# -------------------------
# 0️⃣ Google Sheets Integration
# -------------------------
try:
    creds = Credentials.from_service_account_file(
        "bp-simulator-key.json",
        scopes=[
            "https://www.googleapis.com/auth/spreadsheets",
            "https://www.googleapis.com/auth/drive"
        ]
    )
    client = gspread.authorize(creds)
    SHEET_NAME = "Private Banker BP Data"
    sheet = client.open(SHEET_NAME).sheet1
    google_connected = True
except Exception as e:
    st.warning(f"⚠️ Google Sheets not connected: {e}")
    google_connected = False

# -------------------------
# 1️⃣ Candidate Information
# -------------------------
st.subheader("Executive Partners presents:")
st.title("🏦 Private Banker Business Plan Simulator with AI Scoring")

col1, col2, col3 = st.columns(3)
with col1:
    candidate_name = st.text_input("Candidate Name")
    candidate_email = st.text_input("Candidate Email")
    current_role = st.selectbox("Current Role", ["Managing Director", "Senior Relationship Manager", "Relationship Manager", "Investment Advisor"])
with col2:
    current_employer = st.text_input("Current Employer")
    years_exp = st.number_input("Years of Experience", min_value=0, max_value=50)
    location = st.selectbox("Current Location", ["Geneva", "Zurich", "Dubai", "London", "Singapore", "Hong Kong", "New York", "Miami"])
with col3:
    market = st.selectbox("Primary Market Covered", [
        "Swiss Onshore", "LATAM", "MEA", "Turkey", "CIS", "CEE", "Spain",
        "Portugal", "Nordics", "US", "UK", "Hong Kong", "Singapore"
    ])
    current_book = st.number_input("Current Book AUM (in millions)", min_value=0.0, step=0.1)
    last_bonus = st.number_input("Last Bonus Received", min_value=0.0, step=1000.0)

cv_file = st.file_uploader("📄 Upload your CV (PDF or DOCX)", type=["pdf", "docx"])
st.write("💡 Current Book AUM is for reference only and does not influence projections automatically.")

st.divider()

# -------------------------
# 2️⃣ NNM & ROA Projections
# -------------------------
st.header("2️⃣ Net New Money (NNM) & ROA Projections")

proj_data = []
for year in range(1, 4):
    col1, col2 = st.columns(2)
    with col1:
        nnm = st.number_input(f"Projected NNM Year {year} (in millions)", min_value=0.0, step=0.1)
    with col2:
        roa = st.number_input(f"Projected ROA Year {year} (%)", min_value=0.0, step=0.01)
    revenue = nnm * 1_000_000 * (roa / 100)
    proj_data.append([year, nnm, roa, revenue])

proj_df = pd.DataFrame(proj_data, columns=["Year", "NNM (M)", "ROA (%)", "Revenue"])
proj_df["Revenue"] = proj_df["Revenue"].astype(float).round(2)

# Add Total Row
total_row = pd.DataFrame([["TOTAL", proj_df["NNM (M)"].sum(), "", proj_df["Revenue"].sum()]], columns=proj_df.columns)
proj_display = pd.concat([proj_df, total_row], ignore_index=True)

st.dataframe(proj_display, use_container_width=True)

# Clean chart (exclude TOTAL row)
chart_df = proj_df.copy()
chart_df["Revenue (M)"] = chart_df["Revenue"] / 1_000_000
st.bar_chart(chart_df.set_index("Year")[["NNM (M)", "Revenue (M)"]])

st.divider()

# -------------------------
# 3️⃣ Enhanced NNA / Prospects Table
# -------------------------
st.header("3️⃣ Enhanced NNA / Prospects Table")
st.write("💡 Enter all your clients and prospects. Total NNM here should match your Section 2 projections.")

prospects = st.data_editor(
    pd.DataFrame(columns=["Prospect Name", "Source", "Total Client Wealth (M)", "Best Case NNM (M)", "Worst Case NNM (M)"]),
    num_rows="dynamic",
    column_config={
        "Source": st.column_config.SelectboxColumn(options=["Self Acquired", "Inherited", "Finder"])
    },
    use_container_width=True
)

if not prospects.empty:
    numeric_cols = ["Total Client Wealth (M)", "Best Case NNM (M)", "Worst Case NNM (M)"]
    for col in numeric_cols:
        prospects[col] = pd.to_numeric(prospects[col], errors="coerce").fillna(0)
    total_row = pd.DataFrame([["TOTAL", "", prospects[numeric_cols[0]].sum(), prospects[numeric_cols[1]].sum(), prospects[numeric_cols[2]].sum()]],
                             columns=prospects.columns)
    summary_df = pd.concat([prospects, total_row], ignore_index=True)
    st.dataframe(summary_df, use_container_width=True)

st.divider()

# -------------------------
# 4️⃣ Cost & Net Margin Analysis
# -------------------------
st.header("4️⃣ Cost & Net Margin Analysis")

social_charges = last_bonus * 0.25
total_cost = last_bonus + social_charges

margin_data = []
for i, row in proj_df.iterrows():
    gross_rev = row["Revenue"]
    net_margin = gross_rev - total_cost
    margin_data.append([row["Year"], round(gross_rev, 2), round(total_cost, 2), round(net_margin, 2)])

margin_df = pd.DataFrame(margin_data, columns=["Year", "Gross Revenue", "Total Cost", "Net Margin"])

st.dataframe(margin_df, use_container_width=True)
st.bar_chart(margin_df.set_index("Year")[["Gross Revenue", "Net Margin"]])

st.divider()

# -------------------------
# 5️⃣ AI Candidate Analysis with Traffic Light
# -------------------------
st.header("5️⃣ AI Recruiter Analysis")
if candidate_name:
    avg_roa = proj_df["ROA (%)"].replace("", np.nan).astype(float).mean()
    total_nnm = proj_df["NNM (M)"].replace("", np.nan).astype(float).sum()

    score_color = "green" if total_nnm >= 50 else "yellow" if total_nnm >= 20 else "red"
    st.markdown(f"**Traffic Light Score:** <span style='color:{score_color};font-weight:bold;'>{score_color.upper()}</span>", unsafe_allow_html=True)
    st.write(f"- Total Projected NNM: {total_nnm:.2f} M")
    st.write(f"- Average ROA: {avg_roa:.2f}%")
else:
    st.warning("⚠️ Please enter candidate name for AI scoring.")

st.success("✅ Business Plan simulation complete.")

# -------------------------
# 6️⃣ Submit to Google Sheets
# -------------------------
if st.button("✅ Submit to Google Sheets") and google_connected:
    row_data = [
        candidate_name,
        candidate_email,
        current_role,
        current_employer,
        years_exp,
        location,
        market,
        current_book,
        last_bonus,
        sum(proj_df["NNM (M)"].replace("", 0)),
        proj_df["ROA (%)"].replace("", 0).mean()
    ]
    sheet.append_row(row_data)
    st.success("✅ Submitted to Google Sheets successfully!")