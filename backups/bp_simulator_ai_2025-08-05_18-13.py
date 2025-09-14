import streamlit as st
import pandas as pd
from fpdf import FPDF

# ------------------------
# PAGE CONFIG
# ------------------------
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

currency = st.selectbox("Currency", ["CHF", "EUR", "USD", "GBP", "AED", "HKD", "SGD"])
book_origin = st.slider("Book Origin % Inherited", 0, 100, 0)

uploaded_cv = st.file_uploader("📄 Upload Candidate CV (PDF or DOCX)", type=["pdf", "docx"])

st.divider()

# ------------------------
# 2️⃣ NNM Projection & ROA
# ------------------------
st.header("2️⃣ NNM Projection & ROA")

proj_data = []
for year in range(1, 4):
    col1, col2, col3 = st.columns(3)
    with col1:
        nnm = st.number_input(f"Net New Money (NNM) Year {year} (M)", min_value=0.0, step=0.1)
    with col2:
        aum = st.number_input(f"Projected AUM Year {year} (M)", min_value=0.0, step=0.1)
    with col3:
        roa = st.number_input(f"Projected ROA Year {year} (%)", min_value=0.0, step=0.01)
    revenue = aum * 1_000_000 * (roa / 100)
    proj_data.append([year, nnm, aum, roa, revenue])

proj_df = pd.DataFrame(proj_data, columns=["Year", "NNM (M)", "Projected AUM (M)", "ROA (%)", "Revenue"])
proj_df["Revenue"] = proj_df["Revenue"].astype(float)

# Add total row safely (string for Year)
total_row = pd.DataFrame([["TOTAL", proj_df["NNM (M)"].sum(), proj_df["Projected AUM (M)"].sum(),
                           "", proj_df["Revenue"].sum()]], columns=proj_df.columns)
proj_display = pd.concat([proj_df, total_row], ignore_index=True)

# Format revenue nicely
def format_number(x):
    if isinstance(x, (int, float)):
        return f"{x:,.2f}"
    return x

st.dataframe(proj_display.map(format_number), use_container_width=True)

st.divider()

# ------------------------
# 3️⃣ Enhanced NNA / Prospects Table
# ------------------------
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
    summary_df = pd.concat([prospects, total_row], ignore_index=True)
    st.dataframe(summary_df.map(format_number), use_container_width=True)

st.divider()

# ------------------------
# 4️⃣ Cost & Net Margin Analysis
# ------------------------
st.header("4️⃣ Cost & Net Margin Analysis")

social_charges = base_salary * 0.25
total_cost = base_salary + last_bonus + social_charges

margin_data = []
for i, row in proj_df.iterrows():
    gross_rev = row["Revenue"]
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
if proj_df["Revenue"].sum() > 1_000_000: score += 1
if proj_df["NNM (M)"].sum() > 30: score += 1

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
    pdf.multi_cell(0, 10, f"Candidate: {candidate_name}\nEmail: {candidate_email}\nLocation: {location}\nMarket: {current_role}\nCurrency: {currency}")
    pdf.output("business_plan.pdf")
    st.success("✅ PDF Generated! Check your project folder.")

st.success("✅ Business Plan simulation complete.")
