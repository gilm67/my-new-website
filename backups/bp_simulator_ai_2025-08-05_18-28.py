import streamlit as st
import pandas as pd
from fpdf import FPDF

st.set_page_config(page_title="🏦 Private Banker Business Plan Simulator", layout="wide")
st.write("### Executive Partners presents your AI-powered Business Plan Simulator")
st.title("🏦 Private Banker Business Plan Simulator")

# ------------------------
# 1️⃣ Candidate Information
# ------------------------
st.header("1️⃣ Candidate Information")

col1, col2, col3 = st.columns(3)
with col1:
    candidate_name = st.text_input("Candidate Name")
    candidate_email = st.text_input("Candidate Email")
    years_exp = st.number_input("Years of Experience", min_value=0, max_value=50)
with col2:
    current_role = st.selectbox("Current Role", ["Managing Director", "Senior Relationship Manager", "Relationship Manager", "Investment Advisor"])
    current_employer = st.text_input("Current Employer")
    location = st.selectbox("Candidate Location", ["Geneva", "Zurich", "Dubai", "Hong Kong", "Singapore", "New York", "Miami", "London"])
with col3:
    current_book = st.number_input("Current Book AUM (M)", min_value=0.0, step=0.1)
    base_salary = st.number_input("Base Salary", min_value=0.0, step=1000.0)
    last_bonus = st.number_input("Last Bonus (Received)", min_value=0.0, step=1000.0)

market = st.selectbox("Primary Market Covered", [
    "Swiss Onshore", "LATAM", "MEA", "Turkey", "CIS", "CEE", "Spain",
    "Portugal", "Nordics", "US", "UK", "Hong Kong", "Singapore"
])

currency = st.selectbox("Currency", ["CHF", "EUR", "USD", "GBP", "AED", "HKD", "SGD"])
book_origin = st.slider("Book Origin % Inherited", 0, 100, 0)

uploaded_cv = st.file_uploader("📄 Upload Candidate CV (PDF or DOCX)", type=["pdf", "docx"])

st.divider()

# ------------------------
# 2️⃣ NNM Projection (simplified)
# ------------------------
st.header("2️⃣ NNM Projection")

nnm_data = []
for year in range(1, 4):
    nnm = st.number_input(f"Net New Money (NNM) Year {year} (M)", min_value=0.0, step=0.1)
    nnm_data.append([year, nnm])

nnm_df = pd.DataFrame(nnm_data, columns=["Year", "NNM (M)"])

# Add total row
total_row = pd.DataFrame([["TOTAL", nnm_df["NNM (M)"].sum()]], columns=nnm_df.columns)
nnm_display = pd.concat([nnm_df, total_row], ignore_index=True)

def format_number(x):
    if isinstance(x, (int, float)):
        return f"{x:,.2f}"
    return x

st.dataframe(nnm_display.map(format_number), use_container_width=True)

# Chart for NNM only
chart_df = nnm_df.copy()
chart_df["Year"] = chart_df["Year"].astype(str)
st.bar_chart(chart_df.set_index("Year"))

st.divider()

# ------------------------
# 3️⃣ Enhanced NNA / Prospects Table
# ------------------------
st.header("3️⃣ Enhanced NNA / Prospects Table")

# Prospects with drop-down for source
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

# ------------------------
# 4️⃣ Cost & Net Margin Analysis (simplified)
# ------------------------
st.header("4️⃣ Cost & Net Margin Analysis")

social_charges = base_salary * 0.25
total_cost = base_salary + last_bonus + social_charges

# Estimate revenue based on NNM (simplified: assume 0.5% ROA on NNM inflows)
margin_data = []
for i, row in nnm_df.iterrows():
    gross_rev = row["NNM (M)"] * 1_000_000 * 0.005  # 0.5% ROA assumption
    net_margin = gross_rev - total_cost
    margin_data.append([row["Year"], gross_rev, total_cost, net_margin])

margin_df = pd.DataFrame(margin_data, columns=["Year", "Gross Revenue", "Total Cost", "Net Margin"])
st.dataframe(margin_df.applymap(format_number), use_container_width=True)
st.bar_chart(margin_df.set_index("Year")[["Gross Revenue", "Net Margin"]])

st.divider()

# ------------------------
# 5️⃣ AI Recruiter Analysis
# ------------------------
st.header("5️⃣ AI Recruiter Analysis")

score = 0
if current_book > 50: score += 1
if nnm_df["NNM (M)"].sum() > 30: score += 1
if margin_df["Net Margin"].sum() > 500_000: score += 1

if score == 3:
    st.success("🟢 Candidate looks **Strong** (Hunter profile).")
elif score == 2:
    st.warning("🟡 Candidate is **Moderate** (Farmer with growth potential).")
else:
    st.error("🔴 Candidate seems **Weak** for aggressive targets.")

st.divider()

# ------------------------
# 6️⃣ Download PDF
# ------------------------
if st.button("📥 Download Business Plan as PDF"):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, f"Candidate: {candidate_name}\nEmail: {candidate_email}\nLocation: {location}\nMarket: {market}\nCurrency: {currency}")
    pdf.output("business_plan.pdf")
    st.success("✅ PDF Generated! Check your project folder.")

st.success("✅ Business Plan simulation complete.")
