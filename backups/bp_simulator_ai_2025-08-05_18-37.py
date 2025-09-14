# Paste the full code aboveimport streamlit as st import pandas as pd from 
fpdf import FPDF # Save: CTRL+O → Enter → CTRL+X 
st.set_page_config(page_title="🏦 Private Banker Business Plan Simulator", 
layout="wide") st.write("### Executive Partners presents your AI-powered 
Business Plan Simulator") st.title("🏦 Private Banker Business Plan 
Simulator")
import streamlit as st
import pandas as pd
import numpy as np

# ---------------------------
# PAGE CONFIG
# ---------------------------
st.set_page_config(page_title="🏦 Private Banker Business Plan Simulator", layout="wide")

st.markdown("### Presented by Executive Partners – Private Banking & Wealth Management Recruitment")
st.title("🏦 Private Banker Business Plan Simulator with AI Recruiter Scoring")

# Helper for formatting numbers
def format_number(x):
    try:
        return f"{float(x):,.2f}"
    except:
        return x

# ---------------------------
# 1️⃣ Candidate Information
# ---------------------------
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
with col2:
    location = st.selectbox("Candidate Location", [
        "Geneva", "Zurich", "Dubai", "Hong Kong", "Singapore", "London", "New York", "Miami"
    ])
    current_role = st.selectbox("Current Role", [
        "Managing Director", "Senior Relationship Manager", "Relationship Manager", "Investment Advisor"
    ])
    current_employer = st.text_input("Current Employer")
    current_book = st.number_input("Current Book AUM (in millions)", min_value=0.0, step=0.1)
with col3:
    base_salary = st.number_input("Base Salary", min_value=0.0, step=1000.0)
    last_bonus = st.number_input("Last Bonus (Received)", min_value=0.0, step=1000.0)
    book_origin = st.slider("Book Origin % Inherited", 0, 100, 0)

uploaded_cv = st.file_uploader("Upload Candidate CV (PDF or DOCX)", type=["pdf", "docx"])

st.divider()

# ---------------------------
# 2️⃣ NNM & ROA Projections
# ---------------------------
st.header("2️⃣ NNM & ROA Projections")

st.write("💡 **Guidance:** Enter your projected **Net New Money (NNM)** and **ROA** for 3 years. Revenue = AUM × ROA.")

proj_data = []
for year in range(1, 4):
    col1, col2 = st.columns(2)
    with col1:
        nnm = st.number_input(f"Projected NNM Year {year} (in millions)", min_value=0.0, step=0.1)
    with col2:
        roa = st.number_input(f"Projected ROA Year {year} (%)", min_value=0.0, step=0.01)
    revenue = nnm * 1_000_000 * (roa / 100)  # Revenue = NNM * ROA%
    proj_data.append([year, nnm, roa, revenue])

proj_df = pd.DataFrame(proj_data, columns=["Year", "NNM (M)", "ROA (%)", "Revenue"])
proj_df["Revenue"] = proj_df["Revenue"].astype(float).round(2)

# Add Total row
total_row = pd.DataFrame([["TOTAL", proj_df["NNM (M)"].sum(), "", proj_df["Revenue"].sum()]], columns=proj_df.columns)
proj_display = pd.concat([proj_df, total_row], ignore_index=True)

st.dataframe(proj_display.map(format_number), use_container_width=True)
st.bar_chart(proj_df.set_index("Year")[["Revenue"]])

st.divider()

# ---------------------------
# 3️⃣ Enhanced NNA / Prospects Table
# ---------------------------
st.header("3️⃣ Enhanced NNA / Prospects Table")

st.write(
    "💡 **Guidance:** Enter **all clients and prospects**. "
    "Include source (Self Acquired / Inherited / Finder) and estimated total client wealth. "
    "The **Total NNM** here should match your Section 2 projection."
)

prospects = st.data_editor(
    pd.DataFrame(columns=[
        "Prospect Name",
        "Source",
        "Total Client Wealth (M)",
        "Best Case NNM (M)",
        "Worst Case NNM (M)"
    ]),
    num_rows="dynamic",
    column_config={
        "Source": st.column_config.SelectboxColumn(
            options=["Self Acquired", "Inherited", "Finder"]
        )
    },
    use_container_width=True
)

if not prospects.empty:
    numeric_cols = ["Total Client Wealth (M)", "Best Case NNM (M)", "Worst Case NNM (M)"]
    for col in numeric_cols:
        prospects[col] = pd.to_numeric(prospects[col], errors="coerce").fillna(0)
    totals = prospects[numeric_cols].sum()
    total_row = pd.DataFrame([["TOTAL", "", *totals]], columns=prospects.columns)
    summary_df = pd.concat([prospects, total_row], ignore_index=True)
    st.dataframe(summary_df.map(format_number), use_container_width=True)

st.divider()

# ---------------------------
# 4️⃣ Cost & Net Margin Analysis
# ---------------------------
st.header("4️⃣ Cost & Net Margin Analysis")

social_charges = base_salary * 0.25
total_cost = base_salary + last_bonus + social_charges

margin_data = []
for i, row in proj_df.iterrows():
    gross_rev = row["Revenue"]
    net_margin = gross_rev - total_cost
    margin_data.append([int(row["Year"]), gross_rev, total_cost, net_margin])

margin_df = pd.DataFrame(margin_data, columns=["Year", "Gross Revenue", "Total Cost", "Net Margin"])
st.dataframe(margin_df.map(format_number), use_container_width=True)
st.bar_chart(margin_df.set_index("Year")[["Gross Revenue", "Net Margin"]])

st.divider()

# ---------------------------
# 5️⃣ AI Recruiter Scoring (Traffic Light)
# ---------------------------
st.header("5️⃣ AI Recruiter Scoring")

score = 0
if years_exp >= 10:
    score += 1
if current_book > 100:
    score += 1
if proj_df["Revenue"].sum() > 500_000:
    score += 1

if score == 3:
    st.success("🟢 Strong Hunter Profile – High Potential")
elif score == 2:
    st.warning("🟡 Balanced Profile – Requires Review")
else:
    st.error("🔴 Limited Business Case – Likely Farmer")

st.success("✅ Business Plan simulation complete.")
