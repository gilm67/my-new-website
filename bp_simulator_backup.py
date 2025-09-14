import streamlit as st
import pandas as pd
import datetime
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

st.set_page_config(page_title="Private Banker Business Plan Simulator", layout="wide")

st.title("🏦 Private Banker 3-Year Business Plan Simulator")

st.markdown("""
This simulator helps candidates prepare their 3-year **Business Case** for private banking roles.  
Recruiters can evaluate **Net New Money, ROA, Cost, and Candidate Potential**.
""")

# ----------------------
# SECTION 1: Candidate Information
# ----------------------
st.header("1️⃣ Candidate Information")

col1, col2, col3 = st.columns(3)
with col1:
    candidate_name = st.text_input("Candidate Name")
    candidate_email = st.text_input("Candidate Email")
    years_exp = st.number_input("Years of Experience", min_value=0, max_value=50)
    location = st.selectbox("Candidate Location", [
        "Geneva", "Zurich", "Dubai", "Hong Kong", "Singapore",
        "New York", "Miami", "London", "Other"
    ])
with col2:
    market = st.selectbox("Primary Market Covered", [
        "Swiss Onshore", "LATAM", "MEA", "Turkey", "CIS", "CEE", "Spain",
        "Portugal", "Nordics", "US", "UK", "Hong Kong", "Singapore"
    ])
    current_book = st.number_input("Current Book AUM (in millions)", min_value=0.0, step=0.1)
    base_salary = st.number_input("Base Salary", min_value=0.0, step=1000.0)
    last_bonus = st.number_input("Last Bonus (Received)", min_value=0.0, step=1000.0)
with col3:
    currency = st.selectbox("Currency", ["CHF", "EUR", "USD", "GBP", "AED", "HKD", "SGD"])
    book_origin = st.slider("Book Origin % Inherited", 0, 100, 0)
    uploaded_cv = st.file_uploader("Upload Candidate CV (PDF/DOCX)", type=["pdf", "docx"])
    st.write("💡 Note: Current Book AUM is **informational only** and not linked to projections.")

st.divider()

# ----------------------
# SECTION 2: NNM Projection & ROA
# ----------------------
st.header("2️⃣ NNM Projection & ROA")

proj_data = []
for year in range(1, 4):
    col1, col2, col3 = st.columns(3)
    with col1:
        nnm = st.number_input(f"Net New Money Year {year} (in millions)", min_value=0.0, step=0.1)
    with col2:
        aum = st.number_input(f"Projected AUM Year {year} (in millions)", min_value=0.0, step=0.1)
    with col3:
        roa = st.number_input(f"Projected ROA Year {year} (%)", min_value=0.0, step=0.01)
    revenue = aum * 1_000_000 * (roa / 100)
    proj_data.append([year, nnm, aum, roa, revenue])

proj_df = pd.DataFrame(proj_data, columns=["Year", "NNM (M)", "Projected AUM (M)", "ROA (%)", "Revenue"])
proj_df["Revenue"] = proj_df["Revenue"].astype(float).round(2)

# Add Total row
totals = proj_df[["NNM (M)", "Projected AUM (M)", "Revenue"]].sum()
total_row = pd.DataFrame([["TOTAL", totals["NNM (M)"], totals["Projected AUM (M)"], "", totals["Revenue"]]],
                         columns=proj_df.columns)
proj_df = pd.concat([proj_df, total_row], ignore_index=True)

st.dataframe(proj_df.style.format({
    "NNM (M)": "{:,.2f}",
    "Projected AUM (M)": "{:,.2f}",
    "ROA (%)": "{:}",
    "Revenue": "{:,.2f}"
}), use_container_width=True)

st.divider()

# ----------------------
# SECTION 3: Enhanced NNA / Prospects Table
# ----------------------
st.header("3️⃣ Enhanced NNA / Prospects Table")

st.write("List prospects with **Source**, **Total Client Wealth**, and **Best/Worst Case NNM**.")

prospects = st.data_editor(
    pd.DataFrame(columns=[
        "Prospect Name", "Source", "Total Client Wealth (M)", 
        "Best Case NNM (M)", "Worst Case NNM (M)"
    ]),
    num_rows="dynamic",
    use_container_width=True,
    column_config={
        "Source": st.column_config.SelectboxColumn(
            options=["Self Acquired", "Inherited", "Finder"], required=True
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
for i, row in proj_df.iterrows():
    if row["Year"] == "TOTAL":
        continue
    gross_rev = row["Revenue"]
    net_margin = gross_rev - total_cost
    margin_data.append([row["Year"], gross_rev, total_cost, net_margin])

margin_df = pd.DataFrame(margin_data, columns=["Year", "Gross Revenue", "Total Cost", "Net Margin"])
margin_df[["Gross Revenue", "Total Cost", "Net Margin"]] = margin_df[
    ["Gross Revenue", "Total Cost", "Net Margin"]
].round(0)

st.dataframe(margin_df.style.format("{:,.0f}"), use_container_width=True)
st.bar_chart(margin_df.set_index("Year")[["Gross Revenue", "Net Margin"]])

# ----------------------
# SECTION 5: AI Candidate Analysis
# ----------------------
st.header("5️⃣ AI Candidate Analysis (Recruiter Only)")

if base_salary < 150_000 or last_bonus < 30_000 or book_origin > 70:
    st.error("🔴 High Farmer Risk – Limited new client acquisition potential")
elif base_salary >= 200_000 and last_bonus >= 100_000 and years_exp >= 5:
    st.success("🟢 Strong Hunter Profile – High likelihood of delivering business case")
else:
    st.warning("🟡 Mixed Profile – Review NNM projections and prospects carefully")

# ----------------------
# SECTION 6: PDF Export
# ----------------------
st.header("6️⃣ Export Business Plan")

if st.button("📄 Download BP as PDF"):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    c.drawString(100, 750, f"Private Banker Business Plan - {candidate_name}")
    c.drawString(100, 730, f"Email: {candidate_email} | Location: {location}")
    c.drawString(100, 710, f"Market: {market} | Book AUM: {current_book}M | Book Origin: {book_origin}%")
    c.drawString(100, 690, f"Base Salary: {base_salary} {currency} | Last Bonus: {last_bonus} {currency}")
    c.drawString(100, 670, "Summary: Review Streamlit tables for full details.")
    c.save()

    st.download_button("⬇️ Download PDF", data=buffer.getvalue(),
                       file_name=f"BusinessPlan_{candidate_name}.pdf",
                       mime="application/pdf")

st.success("✅ Business Plan simulation complete.")
