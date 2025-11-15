# Test Execution Script for MyTechPortfolio
# Date: 2025-11-15
# Purpose: Rerun test cases and verify system functionality

$ErrorActionPreference = "Continue"
$backendUrl = "http://localhost:8080"
$frontendUrl = "http://localhost:5173"
$testResults = @()

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MyTechPortfolio Test Execution" -ForegroundColor Cyan
Write-Host "Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to test API endpoint
function Test-ApiEndpoint {
    param(
        [string]$Method,
        [string]$Url,
        [string]$TestName,
        [object]$Body = $null
    )
    
    Write-Host "Testing: $TestName" -ForegroundColor Yellow
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
            "Accept" = "application/json"
        }
        
        if ($Body) {
            $bodyJson = $Body | ConvertTo-Json -Depth 10
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $headers -Body $bodyJson -ErrorAction Stop
        } else {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Headers $headers -ErrorAction Stop
        }
        
        $status = "✅ SUCCESS"
        Write-Host "  Status: $status" -ForegroundColor Green
        Write-Host "  Response: $($response | ConvertTo-Json -Compress)" -ForegroundColor Gray
        
        return @{
            TestName = $TestName
            Status = "SUCCESS"
            Message = "Endpoint responded successfully"
            Response = $response
        }
    }
    catch {
        $status = "❌ FAILED"
        $errorMsg = $_.Exception.Message
        Write-Host "  Status: $status" -ForegroundColor Red
        Write-Host "  Error: $errorMsg" -ForegroundColor Red
        
        return @{
            TestName = $TestName
            Status = "FAILED"
            Message = $errorMsg
            Response = $null
        }
    }
    finally {
        Write-Host ""
    }
}

# Check if backend is running
Write-Host "Checking Backend Server..." -ForegroundColor Cyan
try {
    $healthCheck = Invoke-WebRequest -Uri "$backendUrl/actuator/health" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Backend server is running" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend server may not be running. Some tests may fail." -ForegroundColor Yellow
    Write-Host "   Start backend with: cd backend; .\gradlew.bat bootRun" -ForegroundColor Yellow
}
Write-Host ""

# Test API Endpoints
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "API Endpoint Tests" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# TC-001: Projects API - List
$testResults += Test-ApiEndpoint -Method "GET" -Url "$backendUrl/api/projects?page=1&size=10" -TestName "TC-001: Projects API - List"

# TC-002: Projects API - Get by ID (using a sample ID format)
$testResults += Test-ApiEndpoint -Method "GET" -Url "$backendUrl/api/projects/507f1f77bcf86cd799439011" -TestName "TC-002: Projects API - Get by ID"

# TC-003: TechStacks API - List
$testResults += Test-ApiEndpoint -Method "GET" -Url "$backendUrl/api/techstacks" -TestName "TC-003: TechStacks API - List"

# TC-004: TechStacks API - List by Type
$testResults += Test-ApiEndpoint -Method "GET" -Url "$backendUrl/api/techstacks?type=Frontend" -TestName "TC-004: TechStacks API - List by Type"

# TC-005: Academics API - List
$testResults += Test-ApiEndpoint -Method "GET" -Url "$backendUrl/api/academics?page=1&size=10" -TestName "TC-005: Academics API - List"

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$successCount = ($testResults | Where-Object { $_.Status -eq "SUCCESS" }).Count
$failedCount = ($testResults | Where-Object { $_.Status -eq "FAILED" }).Count
$totalCount = $testResults.Count

Write-Host "Total Tests: $totalCount" -ForegroundColor White
Write-Host "Successful: $successCount" -ForegroundColor Green
Write-Host "Failed: $failedCount" -ForegroundColor Red
Write-Host "Success Rate: $([math]::Round(($successCount / $totalCount) * 100, 2))%" -ForegroundColor $(if ($successCount -eq $totalCount) { "Green" } else { "Yellow" })

Write-Host ""
Write-Host "Test execution completed at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Cyan

# Export results to JSON
$testResults | ConvertTo-Json -Depth 10 | Out-File -FilePath "test-results-$(Get-Date -Format 'yyyyMMdd-HHmmss').json" -Encoding UTF8
Write-Host "Results exported to: test-results-$(Get-Date -Format 'yyyyMMdd-HHmmss').json" -ForegroundColor Gray

