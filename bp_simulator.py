import streamlit as st
import pandas as pd
import gspread
from google.oauth2.service_account import Credentials
from datetime import datetime

st.set_page_config(page_title="Private Banker Business Plan Simulator", layout="wide")

st.title("🏦 Private Banker Business Plan Simulator")

# ----------------------
# Google Sheets Connection
# ----------------------
SERVICE_ACCOUNT_FILE = "service_account.json"
SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]

try:
    credentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    gc = gspread.authorize(credentials)
    SHEET_URL = "https://docs.google.com/spreadsheets/d/1A__yEhD_0LYQwBF45wTSbWqdkRe0HAdnnBSj70qgpic/edit#gid=0"
    sh = gc.open_by_url(SHEET_URL)
    worksheet = sh.sheet1
    google_connected = True
except:
    google_connected = False

# ----------------------
# SECTION 1: Candidate Information
# ----------------------
st.header("1️⃣ Candidate Information")

col1, col2, col3 = st.columns(3)
with col1:
    candidate_name = st.text_input("Candidate Name")
    candidate_email = st.text_input("Candidate Email")
    years_exp = st.number_input("Years of Experience", min_value=0, max_value=50)
    market = st.selectbox("Primary Market Covered", [
        "Swiss Onshore", "LATAM", "MEA", "Turkey", "CIS", "CEE", 
        "Spain", "Portugal", "Nordics", "US", "UK", "Hong Kong", "Singapore"
    ])
    location = st.selectbox("Candidate Location", [
        "Geneva", "Zurich", "Dubai", "Hong Kong", "Singapore", "New York", "Miami", "London"
    ])
with col2:
    current_role = st.selectbox("Current Role", [
        "Managing Director", "Senior Relationship Manager", "Relationship Manager", "Investment Advisor"
    ])
    current_employer = st.text_input("Current Employer")
    current_book = st.number_input("Current Book AUM (in millions)", min_value=0.0, step=0.1)
    base_salary = st.number_input("Base Salary", min_value=0.0, step=1000.0)
    last_bonus = st.number_input("Last Bonus (Received)", min_value=0.0, step=1000.0)
with col3:
    currency = st.selectbox("Currency", ["CHF", "EUR", "USD", "GBP", "AED", "HKD", "SGD"])
    book_origin = st.slider("Book Origin % Inherited", 0, 100, 0)
    cv_upload = st.file_uploader("Upload CV", type=["pdf", "docx"])
    st.write("💡 Note: Current Book AUM is informational only.")

st.divider()

# ----------------------
# SECTION 2: NNM & ROA Projections
# ----------------------
st.header("2️⃣ NNM Projection & ROA")

proj_data = []
total_nnm = 0
for year in range(1, 4):
    col1, col2, col3 = st.columns(3)
    with col1:
        nnm = st.number_input(f"NNM Year {year} (M)", min_value=0.0, step=0.1)
    with col2:
        roa = st.number_input(f"ROA Year {year} (%)", min_value=0.0, step=0.01)
    with col3:
        revenue = nnm * 1_000_000 * (roa / 100)
    total_nnm += nnm
    proj_data.append([year, nnm, roa, revenue])

proj_df = pd.DataFrame(proj_data, columns=["Year", "NNM (M)", "ROA (%)", "Revenue"])
proj_df["Revenue"] = proj_df["Revenue"].astype(float).round(2)

# Add total row
total_row = pd.DataFrame([["TOTAL", total_nnm, "", proj_df["Revenue"].sum()]], columns=proj_df.columns)
proj_df = pd.concat([proj_df, total_row], ignore_index=True)

st.dataframe(proj_df.style.format({
    "NNM (M)": "{:,.2f}",
    "Revenue": "{:,.2f}"
}), use_container_width=True)

st.divider()

# ----------------------
# SECTION 3: Enhanced NNA / Prospects Table
# ----------------------
st.header("3️⃣ Enhanced NNA / Prospects Table")

prospects = st.data_editor(
    pd.DataFrame(columns=["Prospect Name", "Source", "Total Client Wealth (M)", 
                          "Best Case NNM (M)", "Worst Case NNM (M)"]),
    num_rows="dynamic",
    use_container_width=True,
    column_config={
        "Source": st.column_config.SelectboxColumn(
            options=["Self-acquired", "Inherited", "Finder"], required=True
        )
    }
)

if not prospects.empty:
    numeric_cols = ["Total Client Wealth (M)", "Best Case NNM (M)", "Worst Case NNM (M)"]
    for col in numeric_cols:
        prospects[col] = pd.to_numeric(prospects[col], errors="coerce").fillna(0)
    totals = prospects[numeric_cols].sum()
    total_row = pd.DataFrame([["TOTAL", "", *totals]], columns=prospects.columns)
    summary_df = pd.concat([prospects, total_row], ignore_index=True)
    st.dataframe(summary_df.style.format("{:,.2f}"), use_container_width=True)

st.divider()

# ----------------------
# SECTION 4: Cost & Net Margin Analysis
# ----------------------
st.header("4️⃣ Cost & Net Margin Analysis")

social_charges = base_salary * 0.25
total_cost = base_salary + last_bonus + social_charges

margin_data = []
for i, row in proj_df.iloc[:-1].iterrows():  # exclude total row
    gross_rev = row["Revenue"]
    net_margin = gross_rev - total_cost
    margin_data.append([int(row["Year"]), gross_rev, total_cost, net_margin])

margin_df = pd.DataFrame(margin_data, columns=["Year", "Gross Revenue", "Total Cost", "Net Margin"])
margin_df = margin_df.round(2)

st.dataframe(margin_df.style.format("{:,.2f}"), use_container_width=True)
st.bar_chart(margin_df.set_index("Year")[["Gross Revenue", "Net Margin"]])

st.divider()

# ----------------------
# SECTION 5: AI Candidate Analysis
# ----------------------
st.header("5️⃣ AI Candidate Analysis & Traffic-Light Scoring")

ai_score = 0
analysis_comments = []

# Experience
if years_exp >= 10:
    ai_score += 2
    analysis_comments.append("✅ Strong experience.")
elif 5 <= years_exp < 10:
    ai_score += 1
    analysis_comments.append("⚠️ Moderate experience.")
else:
    analysis_comments.append("❌ Limited experience.")

# Current Book
if current_book >= 150:
    ai_score += 2
    analysis_comments.append("✅ Strong current book (hunter).")
elif 50 <= current_book < 150:
    ai_score += 1
    analysis_comments.append("⚠️ Average current book.")
else:
    analysis_comments.append("❌ Weak current book (farmer).")

# Compensation
if base_salary >= 200 and last_bonus >= 50:
    ai_score += 2
    analysis_comments.append("✅ Strong compensation; likely performer.")
elif base_salary >= 150 and last_bonus >= 30:
    ai_score += 1
    analysis_comments.append("⚠️ Mid-range compensation.")
else:
    analysis_comments.append("❌ Compensation suggests farmer profile.")

# NNM target
if total_nnm >= 250:
    ai_score += 2
    analysis_comments.append("✅ Meets international HNWI expectations.")
elif total_nnm >= 100:
    ai_score += 1
    analysis_comments.append("⚠️ Meets Swiss HNWI expectations.")
else:
    analysis_comments.append("❌ NNM below expectations.")

# Book origin
if book_origin <= 30:
    ai_score += 2
    analysis_comments.append("✅ Mostly self-acquired (hunter).")
elif 30 < book_origin <= 70:
    ai_score += 1
    analysis_comments.append("⚠️ Mixed origin.")
else:
    analysis_comments.append("❌ Mostly inherited (farmer).")

# Traffic light scoring
if ai_score >= 8:
    traffic_light = "🟢 HIGH POTENTIAL"
elif 5 <= ai_score < 8:
    traffic_light = "🟡 MEDIUM POTENTIAL"
else:
    traffic_light = "🔴 LOW POTENTIAL"

st.subheader("Candidate AI Scoring Result")
st.write(f"**AI Score:** {ai_score}/10 — {traffic_light}")
for comment in analysis_comments:
    st.write(comment)

st.divider()

# ----------------------
# SECTION 6: Submit to Google Sheets
# ----------------------
if st.button("✅ Submit Candidate to Google Sheets") and google_connected:
    log_data = [
        datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        candidate_name,
        candidate_email,
        location,
        current_role,
        current_employer,
        market,
        years_exp,
        current_book,
        base_salary,
        last_bonus,
        book_origin,
        total_nnm,
        ai_score,
        traffic_light
    ]
    worksheet.append_row(log_data)
    st.success("Candidate logged to Google Sheets successfully!")
elif not google_connected:
    st.warning("⚠️ Google Sheets is not connected. Submission disabled.")
