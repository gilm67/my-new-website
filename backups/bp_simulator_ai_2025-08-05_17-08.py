import streamlit as st
import pandas as pd
from fpdf import FPDF
import gspread
from google.oauth2.service_account import Credentials

# --------------------------
# Google Sheets & Drive Auth
# --------------------------
SERVICE_ACCOUNT_FILE = "service_account.json"
SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]
credentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
gc = gspread.authorize(credentials)

# Replace with your real Google Sheet URL
SHEET_URL = "https://docs.google.com/spreadsheets/d/1A__yEhD_0LYQwBF45wTSbWqdkRe0HAdnnBSj70qgpic/edit?gid=0#gid=0"

try:
    sh = gc.open_by_url(SHEET_URL)
    worksheet = sh.sheet1
    st.info("✅ Connected to Google Sheet.")
except Exception as e:
    st.warning(f"⚠️ Could not connect to Google Sheet: {e}")

st.set_page_config(page_title="🏦 Private Banker Business Plan Simulator", layout="wide")

st.markdown("### Executive Partners presents: Private Banker Business Plan Simulator with AI Scoring")

st.title("🏦 Private Banker Business Plan Simulator")

# ----------------------
# 1️⃣ Candidate Information
# ----------------------
st.header("1️⃣ Candidate Information")

col1, col2, col3 = st.columns(3)
with col1:
    candidate_name = st.text_input("Candidate Name")
    candidate_email = st.text_input("Candidate Email")
    current_role = st.selectbox("Current Role", ["Managing Director", "Senior Relationship Manager", "Relationship Manager", "Investment Advisor"])
with col2:
    current_employer = st.text_input("Current Employer")
    years_exp = st.number_input("Years of Experience", min_value=0, max_value=50)
    market = st.selectbox("Primary Market Covered", [
        "Swiss Onshore", "LATAM", "MEA", "Turkey", "CIS", "CEE", 
        "Spain", "Portugal", "Nordics", "US", "UK", "Hong Kong", "Singapore"
    ])
with col3:
    location = st.selectbox("Candidate Location", ["Geneva", "Zurich", "Dubai", "Hong Kong", "Singapore", "New York", "Miami", "London"])
    current_book = st.number_input("Current Book AUM (in millions)", min_value=0.0, step=0.1)
    currency = st.selectbox("Currency", ["CHF", "EUR", "USD", "GBP", "AED", "HKD", "SGD"])
    book_origin = st.slider("Book Origin % Inherited", 0, 100, 0)

base_salary = st.number_input("Base Salary", min_value=0.0, step=1000.0)
last_bonus = st.number_input("Last Bonus (Received)", min_value=0.0, step=1000.0)

cv_file = st.file_uploader("📄 Upload Candidate CV (PDF or DOCX)", type=["pdf", "docx"])

st.divider()

# ----------------------
# 2️⃣ NNM Projection & ROA
# ----------------------
st.header("2️⃣ NNM Projection & ROA")

proj_data = []
for year in range(1, 4):
    c1, c2, c3 = st.columns(3)
    with c1:
        nnm = st.number_input(f"NNM Year {year} (in millions)", min_value=0.0, step=0.1)
    with c2:
        roa = st.number_input(f"Projected ROA Year {year} (%)", min_value=0.0, step=0.01)
    with c3:
        revenue = nnm * 1_000_000 * (roa / 100)
    proj_data.append([year, nnm, roa, revenue])

proj_df = pd.DataFrame(proj_data, columns=["Year", "NNM (M)", "ROA (%)", "Revenue"])
proj_df["Revenue"] = proj_df["Revenue"].astype(float).round(0)

# Add TOTAL row safely for Streamlit
total_row = pd.DataFrame([["TOTAL", proj_df["NNM (M)"].sum(), "", proj_df["Revenue"].sum()]], columns=proj_df.columns)
proj_df_display = pd.concat([proj_df, total_row], ignore_index=True)

st.dataframe(proj_df_display, use_container_width=True)

st.divider()

# ----------------------
# 3️⃣ Enhanced NNA / Prospects Table
# ----------------------
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
    total_row = pd.DataFrame([["TOTAL", "", *prospects[numeric_cols].sum()]], columns=prospects.columns)
    prospects_display = pd.concat([prospects, total_row], ignore_index=True)
    st.dataframe(prospects_display, use_container_width=True)

st.divider()

# ----------------------
# 4️⃣ Cost & Net Margin Analysis
# ----------------------
st.header("4️⃣ Cost & Net Margin Analysis")

social_charges = base_salary * 0.25
total_cost = base_salary + last_bonus + social_charges

margin_data = []
for i, row in proj_df.iterrows():
    gross_rev = row["Revenue"]
    net_margin = gross_rev - total_cost
    margin_data.append([str(int(row["Year"])), gross_rev, total_cost, net_margin])

margin_df = pd.DataFrame(margin_data, columns=["Year", "Gross Revenue", "Total Cost", "Net Margin"])
margin_df[["Gross Revenue", "Total Cost", "Net Margin"]] = margin_df[
    ["Gross Revenue", "Total Cost", "Net Margin"]
].round(0)

st.dataframe(margin_df, use_container_width=True)
st.bar_chart(margin_df.set_index("Year")[["Gross Revenue", "Net Margin"]])

# ----------------------
# 5️⃣ AI Recruiter Scoring
# ----------------------
st.header("5️⃣ AI Recruiter Scoring")

score_color = "🟢 Green (Hunter)"
if base_salary < 150000 or last_bonus < 30000:
    score_color = "🟡 Yellow (Farmer / Moderate)"
if years_exp < 5:
    score_color = "🔴 Red (Low Experience)"

st.subheader(f"Recruiter Traffic Light Score: {score_color}")

st.divider()

# ----------------------
# 6️⃣ PDF Download Button
# ----------------------
if st.button("📄 Generate Business Plan PDF"):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt=f"Business Plan for {candidate_name}", ln=True)
    pdf.cell(200, 10, txt=f"Current Employer: {current_employer}", ln=True)
    pdf.cell(200, 10, txt=f"Current Role: {current_role}", ln=True)
    pdf.cell(200, 10, txt=f"Candidate Email: {candidate_email}", ln=True)
    pdf.cell(200, 10, txt=f"Location: {location}", ln=True)
    pdf.cell(200, 10, txt=f"Current Book AUM: {current_book} M {currency}", ln=True)
    pdf.cell(200, 10, txt=f"Base Salary: {base_salary} {currency}", ln=True)
    pdf.cell(200, 10, txt=f"Last Bonus: {last_bonus} {currency}", ln=True)
    pdf.output("business_plan.pdf")
    with open("business_plan.pdf", "rb") as f:
        st.download_button("⬇️ Download Generated PDF", f, file_name="BusinessPlan.pdf")

st.success("✅ Business Plan simulation complete.")
