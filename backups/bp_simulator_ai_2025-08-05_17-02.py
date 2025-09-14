import streamlit as st
import pandas as pd
from fpdf import FPDF
import io

st.set_page_config(page_title="🏦 Private Banker Business Plan Simulator", layout="wide")

# ----------------------
# Header
# ----------------------
st.write("### Executive Partners presents the Private Banker Business Plan Simulator with AI Recruiter Scoring")

st.title("🏦 Private Banker Business Plan Simulator")

# ----------------------
# 1️⃣ Candidate Information
# ----------------------
st.header("1️⃣ Candidate Information")

col1, col2, col3 = st.columns(3)
with col1:
    candidate_name = st.text_input("Candidate Name")
    candidate_email = st.text_input("Candidate Email")
    years_exp = st.number_input("Years of Experience", min_value=0, max_value=50)
    location = st.selectbox("Location", [
        "Geneva", "Zurich", "Dubai", "London", "New York", "Miami", "Hong Kong", "Singapore"
    ])
with col2:
    current_role = st.selectbox("Current Role", [
        "Managing Director", "Senior Relationship Manager", "Relationship Manager", "Investment Advisor"
    ])
    current_employer = st.text_input("Current Employer")
    current_book = st.number_input("Current Book AUM (in millions)", min_value=0.0, step=0.1)
    base_salary = st.number_input("Base Salary", min_value=0.0, step=1000.0)
with col3:
    last_bonus = st.number_input("Last Bonus (Received)", min_value=0.0, step=1000.0)
    currency = st.selectbox("Currency", ["CHF", "EUR", "USD", "GBP", "AED", "HKD", "SGD"])
    book_origin = st.slider("Book Origin % Inherited", 0, 100, 0)
    st.write("💡 Note: Current Book AUM is informational only.")

st.divider()

# ----------------------
# 2️⃣ NNM & ROA Projections
# ----------------------
st.header("2️⃣ NNM & ROA Projections")

st.write("Enter your projected **NNM, AUM, and ROA** for each year. Revenue = AUM × ROA.")

proj_data = []
for year in range(1, 4):
    col1, col2, col3 = st.columns(3)
    with col1:
        nnm = st.number_input(f"NNM Year {year} (in millions)", min_value=0.0, step=0.1)
    with col2:
        aum = st.number_input(f"AUM Year {year} (in millions)", min_value=0.0, step=0.1)
    with col3:
        roa = st.number_input(f"ROA Year {year} (%)", min_value=0.0, step=0.01)
    revenue = aum * 1_000_000 * (roa / 100)
    proj_data.append([year, nnm, aum, roa, revenue])

proj_df = pd.DataFrame(proj_data, columns=["Year", "NNM (M)", "AUM (M)", "ROA (%)", "Revenue"])
proj_df["Revenue"] = pd.to_numeric(proj_df["Revenue"], errors="coerce").fillna(0).round(2)

# Add total row
total_row = pd.DataFrame([["TOTAL", proj_df["NNM (M)"].sum(), proj_df["AUM (M)"].sum(), "", proj_df["Revenue"].sum()]],
                         columns=proj_df.columns)
proj_display = pd.concat([proj_df, total_row], ignore_index=True)

st.dataframe(proj_display, use_container_width=True)

st.divider()

# ----------------------
# 3️⃣ Enhanced NNA / Prospects Table
# ----------------------
st.header("3️⃣ Enhanced NNA / Prospects Table")

st.write("List prospects with total client wealth and best & worst case NNM projections.")

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
    margin_data.append([row["Year"], gross_rev, total_cost, net_margin])

margin_df = pd.DataFrame(margin_data, columns=["Year", "Gross Revenue", "Total Cost", "Net Margin"])
margin_df[["Gross Revenue", "Total Cost", "Net Margin"]] = margin_df[
    ["Gross Revenue", "Total Cost", "Net Margin"]
].round(2)

st.dataframe(margin_df, use_container_width=True)
st.bar_chart(margin_df.set_index("Year")[["Gross Revenue", "Net Margin"]])

st.divider()

# ----------------------
# 5️⃣ Export Business Plan as PDF
# ----------------------
st.header("5️⃣ Export Business Plan as PDF")

if st.button("📄 Generate PDF"):
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    
    pdf.set_font("Arial", "B", 16)
    pdf.cell(200, 10, f"Business Plan - {candidate_name}", ln=True, align="C")

    pdf.set_font("Arial", "", 12)
    pdf.ln(10)
    pdf.multi_cell(0, 10, f"Email: {candidate_email}")
    pdf.multi_cell(0, 10, f"Current Role: {current_role} at {current_employer}")
    pdf.multi_cell(0, 10, f"Location: {location}, Market: {market}")
    pdf.multi_cell(0, 10, f"Years Experience: {years_exp}")
    pdf.multi_cell(0, 10, f"Current Book AUM: {current_book} M")
    pdf.multi_cell(0, 10, f"Base Salary: {base_salary} | Last Bonus: {last_bonus}")

    pdf.ln(10)
    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "NNM & ROA Projection", ln=True)
    pdf.set_font("Arial", "", 10)
    for i, row in proj_df.iterrows():
        pdf.cell(0, 8, f"Year {int(row['Year'])} - NNM: {row['NNM (M)']}M, AUM: {row['AUM (M)']}M, ROA: {row['ROA (%)']}%, Revenue: {row['Revenue']:.2f}", ln=True)

    pdf.ln(5)
    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "Cost & Net Margin", ln=True)
    pdf.set_font("Arial", "", 10)
    for i, row in margin_df.iterrows():
        pdf.cell(0, 8, f"Year {int(row['Year'])} - Revenue: {row['Gross Revenue']:.2f}, Cost: {row['Total Cost']:.2f}, Net Margin: {row['Net Margin']:.2f}", ln=True)

    pdf_output = io.BytesIO()
    pdf.output(pdf_output)
    st.download_button("⬇️ Download PDF", data=pdf_output.getvalue(), file_name=f"BusinessPlan_{candidate_name}.pdf", mime="application/pdf")
