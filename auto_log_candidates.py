import os
import streamlit as st
import pandas as pd
import gspread
from google.oauth2.service_account import Credentials
from datetime import datetime

# Attempt to import OpenAI; if not available, AI analysis will be disabled
try:
    import openai
except ImportError:
    openai = None

# -------------------- CONFIGURATION -------------------- #
SCOPE = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]
SHEET_ID = "YOUR_SHEET_ID_HERE"
if openai:
    openai.api_key = os.getenv("OPENAI_API_KEY")

# -------------------- GOOGLE SHEETS SETUP -------------------- #
creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "service_account.json")
try:
    credentials = Credentials.from_service_account_file(creds_path, scopes=SCOPE)
    gc = gspread.authorize(credentials)
    sheet = gc.open_by_key(SHEET_ID)
    worksheet = sheet.worksheet("BP_Entries")
    sheet_status = "✅ Connected to Google Sheet"
except Exception as e:
    sheet, worksheet = None, None
    sheet_status = f"⚠️ Could not connect to Google Sheet: {e}"

# -------------------- STREAMLIT APP -------------------- #
st.set_page_config(page_title="Business Plan Simulator", layout="wide")
st.markdown("# 📊 Business Plan Simulator")
st.caption(sheet_status)
st.info("*Fields marked with an asterisk (*) are mandatory and handled confidentially.")

# === SECTION 1: Basic Candidate Information ===
st.markdown("---")
st.subheader("1️⃣ Basic Candidate Information")
st.info("Please complete all required fields (*) before proceeding.")
col1, col2 = st.columns(2)
with col1:
    candidate_name = st.text_input("Candidate Name")
    candidate_email = st.text_input("Candidate Email *")
    years_experience = st.number_input("Years of Experience *", min_value=0, step=1)
    inherited_book = st.number_input("Inherited Book (% of total AUM) *", min_value=0, max_value=100, step=1)
    current_role = st.selectbox("Current Role *", [
        "Relationship Manager", "Senior Relationship Manager", "Assistant Relationship Manager",
        "Investment Advisor", "Managing Director", "Director", "Team Head", "Market Head", "Other"
    ])
    candidate_location = st.selectbox("Candidate Location *", [
            "— Select —", "Zurich", "Geneva", "Lausanne", "Basel", "Luzern",
            "Dubai", "London", "Hong Kong", "Singapore",
            "New York", "Miami", "Madrid", "Lisbon", "Sao Paulo"
        ])
with col2:
    current_employer = st.text_input("Current Employer *")
    current_market = st.selectbox("Current Market *", [
        "CH Onshore", "UK", "Portugal", "Spain", "Germany", "MEA", "LATAM",
        "CIS", "CEE", "France", "Benelux", "Asia",
        "Argentina", "Brazil", "Conosur", "NRI", "India", "US", "China"
    ])
    currency = st.selectbox("Currency *", ["CHF", "USD", "EUR", "AED", "SGD", "HKD"])
    base_salary = st.number_input(f"Current Base Salary ({currency}) *", min_value=0, step=1000)
    last_bonus = st.number_input(f"Last Bonus ({currency}) *", min_value=0, step=1000)
    current_number_clients = st.number_input("Current Number of Clients *", min_value=0)
    current_assets = st.number_input("Current AUM Under Management (in million) *", min_value=0.0, step=0.1)

# === SECTION 2: Net New Money Projection ===
st.markdown("---")
st.subheader("2️⃣ Net New Money Projection over 3 years")
st.info("Accurately project net new money targets.")
nnm_y1, nnm_y2, nnm_y3 = st.columns(3)[0].number_input("NNM Year 1 (M)",0.0, step=0.1), st.columns(3)[1].number_input("NNM Year 2 (M)",0.0, step=0.1), st.columns(3)[2].number_input("NNM Year 3 (M)",0.0, step=0.1)
proj_clients_y1, proj_clients_y2, proj_clients_y3 = [col.number_input(f"Projected Clients Year {i+1}",0) for i,col in enumerate(st.columns(3))]

# === SECTION 3: Enhanced NNA / Prospects Table ===
st.markdown("---")
st.subheader("3️⃣ Enhanced NNA / Prospects Table")
st.info("List all clients/prospects; TOTAL Best Case NNM should match NNM Year 1 for consistency.")
prospects = st.data_editor(
    pd.DataFrame(columns=["Name","Source","Wealth (M)","Best NNM (M)","Worst NNM (M)" ]),
    num_rows='dynamic', use_container_width=True,
    column_config={'Source': st.column_config.SelectboxColumn('Source',options=['Self Acquired','Inherited','Finder'])}
)
best_sum = 0
if not prospects.empty:
    for col in ['Wealth (M)','Best NNM (M)','Worst NNM (M)']:
        prospects[col] = pd.to_numeric(prospects[col],errors='coerce').fillna(0)
    best_sum = prospects['Best NNM (M)'].sum()
    footer = pd.DataFrame([['TOTAL','','',best_sum,prospects['Worst NNM (M)'].sum()]], columns=prospects.columns)
    df_prosp = pd.concat([prospects, footer],ignore_index=True)
    st.dataframe(df_prosp.style.apply(lambda r: ['font-weight:bold; background-color:lightblue' if r.name==len(df_prosp)-1 else '' for _ in r],axis=1), use_container_width=True)

# === SECTION 4: Revenue, Costs & Net Margin Analysis ===
st.markdown("---")
st.subheader("4️⃣ Revenue, Costs & Net Margin Analysis")
st.info("Ensure sections 1-3 are complete.")
roa_y1, roa_y2, roa_y3 = [col.number_input(f'ROA % Year {i+1}',0.0,1.0,0.1) for i,col in enumerate(st.columns(3))]
rev = [nnm * roa/100 * 1e6 for nnm,roa in zip((nnm_y1,nnm_y2,nnm_y3),(roa_y1,roa_y2,roa_y3))]
gross = [rev[0], rev[0]+rev[1], rev[1]+rev[2]]
tot_gross = sum(rev)
fixed = base_salary*1.25
tot_cost = fixed*3
net = [gross[i] - fixed*(i+1) for i in range(3)]
tot_net = sum(net)
df_rc = pd.DataFrame({'Year':['Y1','Y2','Y3','Total'], 'Gross':gross+ [tot_gross],'Fixed':[fixed]*3+[tot_cost],'Net':net+[tot_net]})
ct,cc = st.columns(2)
with ct: st.table(df_rc.set_index('Year').style.format({'Gross':'{:,.0f}','Fixed':'{:,.0f}','Net':'{:,.0f}'}))
with cc: st.bar_chart(df_rc.set_index('Year')[['Gross','Net']])

# === SECTION 5: AI Candidate Analysis for Recruiter ===
st.markdown("---")
st.header("5️⃣ AI Candidate Analysis for Recruiter")
score = 0
# Experience
score += 1 if years_experience >= 6 else 0
# Inherited book
score += 1 if inherited_book <= 50 else 0
# AUM
min_aum = 200 if current_market=='CH Onshore' else 200
score += 1 if current_assets >= min_aum else 0
# Hunter profile
score += 1 if (base_salary > 200_000 and last_bonus > 100_000) else 0
# ROA
avg_roa = (roa_y1+roa_y2+roa_y3)/3
score += 1 if avg_roa >= 1.5 else 0
# Prospects consistency
if abs(best_sum - nnm_y1) <= 0.1*nnm_y1: score += 1
# Final
if score >= 5: tl='🟢 Strong Candidate'
elif score >= 3: tl='🟡 Medium Potential'
else: tl='🔴 Weak Candidate'
st.subheader(f"Traffic Light: {tl}")
st.write("**🟢 Green** Strong potential\n**🟡 Yellow** Medium -- review details\n**🔴 Red** Weak fit")

# === SECTION 6: Summary & Save Entry ===
with st.container():
    st.markdown("---")
    st.subheader("6️⃣ Summary & Save Entry")
    if st.button("Save to Google Sheet"):
        # Validate mandatory fields
        def _email_valid(e: str) -> bool:
            return isinstance(e, str) and "@" in e and "." in e.split("@")[-1]
        missing = []
        if not _email_valid(candidate_email):
            missing.append("Candidate Email (valid)")
        if candidate_location == "— Select —":
            missing.append("Candidate Location")
        if missing:
            st.error("Please complete the required fields: " + ", ".join(missing))
        elif not worksheet:
            st.warning("⚠️ Google Sheet connection not available.")
        else:
            now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            row = [
                now, candidate_name, candidate_email, current_role, candidate_location,
                current_employer, current_market, currency, base_salary, last_bonus,
                current_number_clients, current_assets, inherited_book,
                nnm_y1, nnm_y2, nnm_y3,
                proj_clients_y1, proj_clients_y2, proj_clients_y3,
                roa_y1, roa_y2, roa_y3,
                revenue_y1, revenue_y2, revenue_y3,
                fixed_cost, net_margin_y1, net_margin_y2, net_margin_y3
            ]
            worksheet.append_row(row)
            st.success("✅ Entry saved to Google Sheet")
