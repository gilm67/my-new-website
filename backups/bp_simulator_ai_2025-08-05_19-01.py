import streamlit as st
import pandas as pd
from fpdf import FPDF
import os

st.set_page_config(page_title="🏦 Private Banker Business Plan Simulator", layout="wide")

# ----------------------
# TITLE & INTRO
# ----------------------
st.markdown("### Executive Partners presents: A confidential Private Banker Business Plan Simulator with AI Recruiter Scoring")

st.title("🏦 Private Banker Business Plan Simulator")

# ----------------------
# 1️⃣ Candidate Information
# ----------------------
st.header("1️⃣ Candidate Information")

col1, col2, col3 = st.columns(3)
with col1:
    candidate_name = st.text_input("Candidate Name")
    candidate_email = st.text_input("Candidate Email")
    candidate_location = st.selectbox("Candidate Location", [
        "Geneva", "Zurich", "Dubai", "Hong Kong", "Singapore", "London", "New York", "Miami"
    ])
    years_exp = st.number_input("Years of Experience", min_value=0, max_value=50)
    market = st.selectbox("Primary Market Covered", [
        "Swiss Onshore", "LATAM", "MEA", "Turkey", "CIS", "CEE", "Spain",
        "Portugal", "Nordics", "US", "UK", "Hong Kong", "Singapore"
    ])
with col2:
    current_book = st.number_input("Current Book AUM (in millions)", min_value=0.0, step=0.1)
    current_role = st.selectbox("Current Role", [
        "Managing Director", "Senior Relationship Manager", 
        "Relationship Manager", "Investment Advisor"
    ])
    current_employer = st.text_input("Current Employer")
    base_salary = st.number_input("Base Salary", min_value=0.0, step=1000.0)
with col3:
    last_bonus = st.number_input("Last Bonus (Received)", min_value=0.0, step=1000.0)
    currency = st.selectbox("Currency", ["CHF", "EUR", "USD", "GBP", "AED", "HKD", "SGD"])
    book_origin = st.slider("Book Origin % Inherited", 0, 100, 0)
    cv_file = st.file_uploader("📄 Upload CV (PDF or DOCX)", type=["pdf", "docx"])

st.divider()

# ----------------------
# 2️⃣ NNM & ROA Projections
# ----------------------
st.header("2️⃣ NNM & ROA Projections")

st.write("Enter projected **Net New Money (NNM)** and **ROA** for 3 years. Revenue = NNM × ROA.")

proj_data = []
for year in range(1, 4):
    col1, col2 = st.columns(2)
    with col1:
        nnm = st.number_input(f"NNM Year {year} (in millions)", min_value=0.0, step=0.1)
    with col2:
        roa = st.number_input(f"ROA Year {year} (%)", min_value=0.0, step=0.01)
    revenue = nnm * 1_000_000 * (roa / 100)
    proj_data.append([year, nnm, roa, revenue])

proj_df = pd.DataFrame(proj_data, columns=["Year", "NNM (M)", "ROA (%)", "Revenue"])
proj_df["Revenue"] = proj_df["Revenue"].astype(float).round(2)

# Add Total row safely
total_row = pd.DataFrame([["TOTAL", proj_df["NNM (M)"].sum(), "", proj_df["Revenue"].sum()]],
                         columns=proj_df.columns)

# Convert Year to str to avoid PyArrow error
proj_display = pd.concat([proj_df.astype({"Year": str}), total_row.astype(str)], ignore_index=True)
st.dataframe(proj_display, use_container_width=True)

# Chart for NNM & Revenue
chart_data = proj_df.copy()
chart_data["Year"] = chart_data["Year"].astype(str)
st.bar_chart(chart_data.set_index("Year")[["NNM (M)", "Revenue"]])

st.divider()

# ----------------------
# 3️⃣ Enhanced NNA / Prospects Table
# ----------------------
st.header("3️⃣ Enhanced NNA / Prospects Table")
st.write("💡 Enter **all clients and prospects**. Total NNM here should match projections in Section 2.")

prospects = st.data_editor(
    pd.DataFrame(columns=[
        "Prospect Name", "Source", "Total Client Wealth (M)", 
        "Best Case NNM (M)", "Worst Case NNM (M)"
    ]),
    num_rows="dynamic",
    use_container_width=True,
    column_config={
        "Source": st.column_config.SelectboxColumn(
            "Source", options=["Self Acquired", "Inherited", "Finder"]
        )
    }
)

if not prospects.empty:
    numeric_cols = ["Total Client Wealth (M)", "Best Case NNM (M)", "Worst Case NNM (M)"]
    for col in numeric_cols:
        prospects[col] = pd.to_numeric(prospects[col], errors="coerce").fillna(0)

    totals = prospects[numeric_cols].sum()
    total_row = pd.DataFrame([["TOTAL", "", *totals]], columns=prospects.columns)
    summary_df = pd.concat([prospects, total_row], ignore_index=True).astype(str)
    st.dataframe(summary_df, use_container_width=True)

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
    margin_data.append([int(row["Year"]), gross_rev, total_cost, net_margin])

margin_df = pd.DataFrame(margin_data, columns=["Year", "Gross Revenue", "Total Cost", "Net Margin"])
margin_df[["Gross Revenue", "Total Cost", "Net Margin"]] = margin_df[
    ["Gross Revenue", "Total Cost", "Net Margin"]
].round(2)

st.dataframe(margin_df.astype(str), use_container_width=True)
st.bar_chart(margin_df.set_index("Year")[["Gross Revenue", "Net Margin"]])

st.divider()

# ----------------------
# 5️⃣ AI Recruiter Scoring
# ----------------------
st.header("5️⃣ AI Recruiter Traffic Light Scoring")

score = 0
if proj_df["Revenue"].sum() > 1_000_000: score += 1
if book_origin < 50: score += 1
if proj_df["NNM (M)"].sum() > 20: score += 1

if score == 3:
    st.success("🟢 Strong Hunter Profile: High revenue potential & new money generation")
elif score == 2:
    st.warning("🟡 Balanced Profile: Moderate revenue and client acquisition")
else:
    st.error("🔴 Farmer Profile: Heavy reliance on inherited book")

# ----------------------
# PDF Download
# ----------------------
if st.button("📥 Download Business Plan as PDF"):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, f"Private Banker Business Plan - {candidate_name}\n\n")
    pdf.multi_cell(0, 10, f"Total Revenue (3Y): {proj_df['Revenue'].sum():,.2f} {currency}")
    pdf.multi_cell(0, 10, f"Net Margin Year 1: {margin_df['Net Margin'][0]:,.2f} {currency}")
    pdf.output("BusinessPlan.pdf")
    st.success("✅ PDF Generated. Check your project folder for BusinessPlan.pdf")
