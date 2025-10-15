# PowerShell script to populate sample data
$baseUrl = "http://localhost:5001/api"

Write-Host "Starting data population via API..." -ForegroundColor Green

# Step 1: Login as instructor
Write-Host "Logging in as instructor..." -ForegroundColor Yellow
$loginBody = @{
    email = "sarah.johnson@lecturer.com"
    password = "lecturer123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body $loginBody
    $loginData = $loginResponse.Content | ConvertFrom-Json
    $token = $loginData.token
    Write-Host "Instructor logged in successfully" -ForegroundColor Green
} catch {
    Write-Host "Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 2: Create organization
Write-Host "Creating organization..." -ForegroundColor Yellow
$orgBody = @{
    name = "Tech Academy DRC"
    description = "Leading technology education in the Democratic Republic of Congo"
    website = "https://techacademy-drc.com"
    email = "info@techacademy-drc.com"
    phone = "+243987654321"
    address = "Kinshasa, DRC"
} | ConvertTo-Json

try {
    $orgResponse = Invoke-WebRequest -Uri "$baseUrl/organizations" -Method POST -Headers @{
        "Content-Type"="application/json"
        "Authorization"="Bearer $token"
        "x-auth-token"="$token"
    } -Body $orgBody
    Write-Host "Organization created" -ForegroundColor Green
} catch {
    Write-Host "Organization might already exist" -ForegroundColor Yellow
}

# Step 3: Create courses
Write-Host "Creating courses..." -ForegroundColor Yellow

$courses = @(
    @{
        title = "React Fundamentals"
        subtitle = "Learn React from scratch"
        description = "A comprehensive course covering React basics, components, state management, and hooks."
        shortDescription = "Master React fundamentals with hands-on projects"
        category = "Web Development"
        subcategory = "Frontend"
        tags = @("react", "javascript", "frontend", "web")
        language = "en"
        difficulty = "beginner"
        level = "basic"
        price = 5.00
        currency = "USD"
        duration = 480
        totalLessons = 24
        status = "published"
    },
    @{
        title = "JavaScript Advanced"
        subtitle = "Advanced JavaScript concepts and patterns"
        description = "Deep dive into advanced JavaScript features, design patterns, and modern ES6+ syntax."
        shortDescription = "Advanced JavaScript for experienced developers"
        category = "Web Development"
        subcategory = "Programming"
        tags = @("javascript", "es6", "advanced", "programming")
        language = "en"
        difficulty = "advanced"
        level = "expert"
        price = 5.00
        currency = "USD"
        duration = 720
        totalLessons = 36
        status = "published"
    },
    @{
        title = "Node.js Backend Development"
        subtitle = "Build robust backend applications"
        description = "Learn to build scalable backend applications using Node.js, Express, and MongoDB."
        shortDescription = "Complete backend development with Node.js"
        category = "Web Development"
        subcategory = "Backend"
        tags = @("nodejs", "express", "mongodb", "backend")
        language = "en"
        difficulty = "intermediate"
        level = "intermediate"
        price = 5.00
        currency = "USD"
        duration = 960
        totalLessons = 48
        status = "published"
    }
)

foreach ($course in $courses) {
    try {
        $courseBody = $course | ConvertTo-Json -Depth 10
        $courseResponse = Invoke-WebRequest -Uri "$baseUrl/courses" -Method POST -Headers @{
            "Content-Type"="application/json"
            "Authorization"="Bearer $token"
            "x-auth-token"="$token"
        } -Body $courseBody
        Write-Host "Created course: $($course.title)" -ForegroundColor Green
    } catch {
        Write-Host "Course might already exist: $($course.title)" -ForegroundColor Yellow
    }
}

Write-Host "Data population completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "- Organization created" -ForegroundColor White
Write-Host "- 3 courses created" -ForegroundColor White
Write-Host ""
Write-Host "Test the instructor dashboard now:" -ForegroundColor Cyan
Write-Host "1. Go to http://localhost:3000" -ForegroundColor White
Write-Host "2. Login as: sarah.johnson@lecturer.com / lecturer123" -ForegroundColor White
Write-Host "3. Check the instructor dashboard for real data" -ForegroundColor White
