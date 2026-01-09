#!/usr/bin/env pwsh
# PowerShell script to start both backend and frontend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AI Threat Detection Dashboard Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the script directory
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $SCRIPT_DIR

# Check if model exists, if not train it
if (-not (Test-Path "saved_model.pkl")) {
    Write-Host "[1/4] Training ML model..." -ForegroundColor Yellow
    python train_saved_model.py
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Model training failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Model trained successfully!" -ForegroundColor Green
} else {
    Write-Host "[1/4] Model already trained ✓" -ForegroundColor Green
}

# Check backend dependencies
Write-Host "[2/4] Checking backend dependencies..." -ForegroundColor Yellow
Set-Location backend
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment and install dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
if (Test-Path "venv\Scripts\Activate.ps1") {
    & venv\Scripts\Activate.ps1
} else {
    Write-Host "Warning: Could not activate venv, using global Python" -ForegroundColor Yellow
}
pip install -q -r requirements.txt
Write-Host "✓ Backend ready!" -ForegroundColor Green

# Check frontend dependencies
Write-Host "[3/4] Checking frontend dependencies..." -ForegroundColor Yellow
Set-Location ..\frontend
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
}
Write-Host "✓ Frontend ready!" -ForegroundColor Green
Set-Location ..

Write-Host ""
Write-Host "[4/4] Starting servers..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Backend:  http://localhost:8000" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Cyan
Write-Host ""

# Start backend in background
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:SCRIPT_DIR\backend
    if (Test-Path "venv\Scripts\Activate.ps1") {
        & venv\Scripts\Activate.ps1
    }
    uvicorn main:app --reload --port 8000
}

# Start frontend in background
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:SCRIPT_DIR\frontend
    npm run dev
}

# Wait for jobs and display output
try {
    while ($true) {
        # Check if jobs are still running
        $backendState = (Get-Job -Id $backendJob.Id).State
        $frontendState = (Get-Job -Id $frontendJob.Id).State
        
        if ($backendState -eq "Failed" -or $frontendState -eq "Failed") {
            Write-Host "One or more servers failed to start!" -ForegroundColor Red
            break
        }
        
        # Receive and display output from both jobs
        Receive-Job -Id $backendJob.Id -ErrorAction SilentlyContinue | Write-Host
        Receive-Job -Id $frontendJob.Id -ErrorAction SilentlyContinue | Write-Host
        
        Start-Sleep -Milliseconds 100
    }
} finally {
    # Clean up jobs on exit
    Write-Host ""
    Write-Host "Shutting down servers..." -ForegroundColor Yellow
    Stop-Job -Id $backendJob.Id -ErrorAction SilentlyContinue
    Stop-Job -Id $frontendJob.Id -ErrorAction SilentlyContinue
    Remove-Job -Id $backendJob.Id -ErrorAction SilentlyContinue
    Remove-Job -Id $frontendJob.Id -ErrorAction SilentlyContinue
    Write-Host "✓ Servers stopped" -ForegroundColor Green
}
