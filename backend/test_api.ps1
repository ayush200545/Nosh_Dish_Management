$ErrorActionPreference = "Stop"

$baseUrl = "http://localhost:8000/api/v1"

Write-Host "1. Logging in as admin..."
$loginBody = @{
    username = "admin@nosh.com"
    password = "Nosh@123456"
}
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/x-www-form-urlencoded"
$token = $loginResponse.access_token
Write-Host "Login successful. Token: $($token.Substring(0, 10))..."

$headers = @{
    Authorization = "Bearer $token"
}

Write-Host "`n2. Creating a test dish..."
$dishData = @{
    dishName = "Test API Dish"
    imageUrl = "https://example.com/image.jpg"
    category = "Main Course"
    isPublished = $false
    description = "A test dish"
    prepTime = "15 mins"
    ingredients = @("Test")
    recipe = "Test recipe"
    orderIndex = 0
}
$createResponse = Invoke-RestMethod -Uri "$baseUrl/dishes" -Method Post -Body ($dishData | ConvertTo-Json) -ContentType "application/json" -Headers $headers
$dishId = $createResponse.dishId
Write-Host "Created dish successfully with ID: $dishId"

Write-Host "`n3. Publishing dish $dishId..."
$publishBody = @{
    isPublished = $true
}
$publishResponse = Invoke-RestMethod -Uri "$baseUrl/dishes/$dishId/toggle" -Method Patch -Body ($publishBody | ConvertTo-Json) -ContentType "application/json" -Headers $headers
Write-Host "Publish successful."

Write-Host "`n4. Verifying dish status..."
$getResponse = Invoke-RestMethod -Uri "$baseUrl/dishes/$dishId" -Method Get
if ($getResponse.isPublished -eq $true) {
    Write-Host "Verification successful: Dish is published."
} else {
    Write-Host "Verification failed: Dish is not published."
    exit 1
}

Write-Host "`n5. Deleting dish $dishId..."
$deleteResponse = Invoke-RestMethod -Uri "$baseUrl/dishes/$dishId" -Method Delete -Headers $headers
Write-Host "Delete successful."

Write-Host "`n6. Verifying deletion..."
try {
    $verifyDeleteResponse = Invoke-RestMethod -Uri "$baseUrl/dishes/$dishId" -Method Get
    Write-Host "Verification failed: Dish still exists!"
    exit 1
} catch {
    Write-Host "Verification successful: Dish not found (deleted)."
}

Write-Host "`nAll tests passed perfectly!"
