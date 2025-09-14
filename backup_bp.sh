#!/bin/bash
# Backup script for bp_simulator_ai.py
# Saves a timestamped copy in the backups folder

# Ensure the backups folder exists
mkdir -p backups

# Copy the current file with a timestamp
cp bp_simulator_ai.py backups/bp_simulator_ai_$(date +"%Y-%m-%d_%H-%M").py

echo "✅ Backup complete! Saved in backups/ folder."
