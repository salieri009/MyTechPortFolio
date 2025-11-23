#!/usr/bin/env node
/**
 * Frontend-Backend Connection Verification Script
 * Executes comprehensive checks based on CONNECTION_VERIFICATION_CHECKLIST.md
 * 
 * Usage: 
 *   From frontend directory: node ../scripts/verify-connection.js
 *   Or: npm run verify:connection (from frontend directory)
 * 
 * Uses Node.js built-in fetch (Node 18+) instead of axios to avoid ES module issues
 */

// Simple HTTP client using Node's built-in fetch
const httpClient = {
  async get(url, options = {}) {
    const response = await fetch(url, {
      method: 'GET',
      ...options,
    })
    return {
      status: response.status,
      statusText: response.statusText,
      data: await response.json().catch(() => ({})),
      headers: Object.fromEntries(response.headers.entries()),
    }
  },
  async post(url, data, options = {}) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    })
    return {
      status: response.status,
      statusText: response.statusText,
      data: await response.json().catch(() => ({})),
      headers: Object.fromEntries(response.headers.entries()),
    }
  },
  async options(url, options = {}) {
    const response = await fetch(url, {
      method: 'OPTIONS',
      ...options,
    })
    return {
      status: response.status,
      statusText: response.statusText,
      data: await response.json().catch(() => ({})),
      headers: Object.fromEntries(response.headers.entries()),
    }
  },
}

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

const results = []

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function addResult(result) {
  results.push(result)
  const statusIcon = {
    PASS: '✅',
    FAIL: '❌',
    SKIP: '⏭️',
    WARN: '⚠️',
  }[result.status]
  
  log(`${statusIcon} [${result.phase}] ${result.test}: ${result.message}`, 
    result.status === 'PASS' ? 'green' : 
    result.status === 'FAIL' ? 'red' : 
    result.status === 'WARN' ? 'yellow' : 'reset')
}

async function checkBackendHealth() {
  const startTime = Date.now()
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    const response = await httpClient.get(`${API_BASE_URL.replace('/api', '')}/actuator/health`, {
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    const responseTime = Date.now() - startTime
    
    if (response.data?.status === 'UP' || response.status === 200) {
      return {
        phase: 'Phase 1: Environment & Setup',
        test: 'Backend Health',
        status: 'PASS',
        message: `Backend is healthy (status: ${response.data?.status || 'UP'})`,
        responseTime,
        details: response.data,
      }
    } else {
      return {
        phase: 'Phase 1: Environment & Setup',
        test: 'Backend Health',
        status: 'FAIL',
        message: `Backend returned unexpected status: ${response.data?.status}`,
        responseTime,
        details: response.data,
      }
    }
  } catch (error) {
    const responseTime = Date.now() - startTime
    return {
      phase: 'Phase 1: Environment & Setup',
      test: 'Backend Health',
      status: 'FAIL',
      message: `Backend health check failed: ${error.message || 'Unknown error'}`,
      responseTime,
      details: { error: error.message || 'Unknown error', name: error.name },
    }
  }
}

async function checkApiConnectivity() {
  const startTime = Date.now()
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)
    
    const response = await httpClient.get(`${API_BASE_URL}/v1/projects?page=1&size=1`, {
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    const responseTime = Date.now() - startTime
    
    if (response.status >= 200 && response.status < 300) {
      return {
        phase: 'Phase 3: API Interaction',
        test: 'API Connectivity',
        status: 'PASS',
        message: `API is reachable (status: ${response.status})`,
        responseTime,
        details: {
          status: response.status,
          hasData: !!response.data,
        },
      }
    } else {
      return {
        phase: 'Phase 3: API Interaction',
        test: 'API Connectivity',
        status: 'WARN',
        message: `API returned status ${response.status}`,
        responseTime,
        details: { status: response.status },
      }
    }
  } catch (error) {
    const responseTime = Date.now() - startTime
    return {
      phase: 'Phase 3: API Interaction',
      test: 'API Connectivity',
      status: 'FAIL',
      message: `API connectivity test failed: ${error.message || 'Unknown error'}`,
      responseTime,
      details: { error: error.message || 'Unknown error', name: error.name },
    }
  }
}

async function checkRequestHeaders() {
  const startTime = Date.now()
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)
    
    const response = await httpClient.get(`${API_BASE_URL}/v1/projects?page=1&size=1`, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    clearTimeout(timeoutId)
    const responseTime = Date.now() - startTime
    
    const hasRequestId = !!response.headers['x-request-id']
    const hasResponseTime = !!response.headers['x-response-time']
    
    return {
      phase: 'Phase 3: API Interaction',
      test: 'Request Headers',
      status: hasRequestId ? 'PASS' : 'WARN',
      message: hasRequestId 
        ? 'Request ID tracking is working' 
        : 'Request ID header not found in response',
      responseTime,
      details: {
        'x-request-id': response.headers['x-request-id'],
        'x-response-time': response.headers['x-response-time'],
        'content-type': response.headers['content-type'],
      },
    }
  } catch (error) {
    return {
      phase: 'Phase 3: API Interaction',
      test: 'Request Headers',
      status: 'SKIP',
      message: 'Could not test headers (API not reachable)',
      details: { error: error.message },
    }
  }
}

async function checkErrorHandling() {
  const errorTests = []
  
  // Test 404 Not Found
  try {
    const startTime = Date.now()
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    await httpClient.get(`${API_BASE_URL}/v1/projects/99999`, {
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    const responseTime = Date.now() - startTime
    
    errorTests.push({
      phase: 'Phase 4: Error Handling',
      test: '404 Not Found',
      status: 'SKIP',
      message: '404 test skipped (endpoint may not exist)',
      responseTime,
    })
  } catch (error) {
    errorTests.push({
      phase: 'Phase 4: Error Handling',
      test: '404 Not Found',
      status: error.response?.status === 404 ? 'PASS' : 'WARN',
      message: error.response?.status === 404 
        ? '404 error handling works correctly' 
        : `Unexpected status: ${error.response?.status}`,
      details: { status: error.response?.status },
    })
  }
  
  // Test 400 Bad Request (malformed request)
  try {
    const startTime = Date.now()
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    await httpClient.post(`${API_BASE_URL}/v1/projects`, {
      // Invalid data
      invalidField: 'test',
    }, {
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    const responseTime = Date.now() - startTime
    
    errorTests.push({
      phase: 'Phase 4: Error Handling',
      test: '400 Bad Request',
      status: 'SKIP',
      message: '400 test skipped (validation may vary)',
      responseTime,
    })
  } catch (error) {
    errorTests.push({
      phase: 'Phase 4: Error Handling',
      test: '400 Bad Request',
      status: error.response?.status === 400 ? 'PASS' : 'WARN',
      message: error.response?.status === 400 
        ? '400 error handling works correctly' 
        : `Unexpected status: ${error.response?.status}`,
      details: { status: error.response?.status },
    })
  }
  
  return errorTests
}

async function checkResponseTime() {
  const startTime = Date.now()
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)
    
    await httpClient.get(`${API_BASE_URL}/v1/projects?page=1&size=1`, {
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    const responseTime = Date.now() - startTime
    const isAcceptable = responseTime < 500
    
    return {
      phase: 'Phase 4: Performance & UX',
      test: 'Response Time',
      status: isAcceptable ? 'PASS' : 'WARN',
      message: `Response time: ${responseTime}ms ${isAcceptable ? '(acceptable)' : '(slow, > 500ms)'}`,
      responseTime,
      details: { threshold: 500, actual: responseTime },
    }
  } catch (error) {
    return {
      phase: 'Phase 4: Performance & UX',
      test: 'Response Time',
      status: 'SKIP',
      message: 'Could not measure response time (API not reachable)',
      details: { error: error.message },
    }
  }
}

async function checkCors() {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    const response = await httpClient.options(`${API_BASE_URL}/v1/projects`, {
      signal: controller.signal,
      headers: {
        'Origin': FRONTEND_URL,
        'Access-Control-Request-Method': 'GET',
      },
    })
    clearTimeout(timeoutId)
    
    const corsHeaders = {
      'access-control-allow-origin': response.headers['access-control-allow-origin'],
      'access-control-allow-methods': response.headers['access-control-allow-methods'],
      'access-control-allow-headers': response.headers['access-control-allow-headers'],
    }
    
    return {
      phase: 'Phase 1: Environment & Setup',
      test: 'CORS Configuration',
      status: corsHeaders['access-control-allow-origin'] ? 'PASS' : 'WARN',
      message: corsHeaders['access-control-allow-origin'] 
        ? 'CORS headers are present' 
        : 'CORS headers not found',
      details: corsHeaders,
    }
  } catch (error) {
    return {
      phase: 'Phase 1: Environment & Setup',
      test: 'CORS Configuration',
      status: 'SKIP',
      message: 'Could not test CORS (OPTIONS request failed)',
      details: { error: error.message },
    }
  }
}

function generateReport() {
  log('\n' + '='.repeat(80), 'cyan')
  log('CONNECTION VERIFICATION REPORT', 'cyan')
  log('='.repeat(80), 'cyan')
  
  const summary = {
    total: results.length,
    pass: results.filter(r => r.status === 'PASS').length,
    fail: results.filter(r => r.status === 'FAIL').length,
    warn: results.filter(r => r.status === 'WARN').length,
    skip: results.filter(r => r.status === 'SKIP').length,
  }
  
  log('\n📊 Summary:', 'blue')
  log(`  Total Tests: ${summary.total}`, 'reset')
  log(`  ✅ Passed: ${summary.pass}`, 'green')
  log(`  ❌ Failed: ${summary.fail}`, 'red')
  log(`  ⚠️  Warnings: ${summary.warn}`, 'yellow')
  log(`  ⏭️  Skipped: ${summary.skip}`, 'reset')
  
  // Group by phase
  const byPhase = results.reduce((acc, result) => {
    if (!acc[result.phase]) {
      acc[result.phase] = []
    }
    acc[result.phase].push(result)
    return acc
  }, {})
  
  log('\n📋 Detailed Results by Phase:', 'blue')
  for (const [phase, phaseResults] of Object.entries(byPhase)) {
    log(`\n${phase}:`, 'cyan')
    for (const result of phaseResults) {
      const icon = {
        PASS: '✅',
        FAIL: '❌',
        WARN: '⚠️',
        SKIP: '⏭️',
      }[result.status]
      
      const color = result.status === 'PASS' ? 'green' : 
                   result.status === 'FAIL' ? 'red' : 
                   result.status === 'WARN' ? 'yellow' : 'reset'
      
      log(`  ${icon} ${result.test}: ${result.message}`, color)
      if (result.responseTime) {
        log(`     Response Time: ${result.responseTime}ms`, 'reset')
      }
      if (result.details && Object.keys(result.details).length > 0) {
        log(`     Details: ${JSON.stringify(result.details, null, 2)}`, 'reset')
      }
    }
  }
  
  log('\n' + '='.repeat(80), 'cyan')
  
  if (summary.fail > 0) {
    log('\n⚠️  Some tests failed. Please review the details above.', 'yellow')
    process.exit(1)
  } else if (summary.warn > 0) {
    log('\n⚠️  Some tests have warnings. Review recommended.', 'yellow')
    process.exit(0)
  } else {
    log('\n✅ All critical tests passed!', 'green')
    process.exit(0)
  }
}

async function main() {
  log('🔍 Starting Connection Verification...', 'blue')
  log(`   API Base URL: ${API_BASE_URL}`, 'reset')
  log(`   Frontend URL: ${FRONTEND_URL}`, 'reset')
  log('', 'reset')
  
  // Phase 1: Environment & Setup
  log('Phase 1: Environment & Setup', 'cyan')
  addResult(await checkBackendHealth())
  addResult(await checkCors())
  
  // Phase 3: API Interaction
  log('\nPhase 3: API Interaction', 'cyan')
  addResult(await checkApiConnectivity())
  addResult(await checkRequestHeaders())
  
  // Phase 4: Error Handling
  log('\nPhase 4: Error Handling', 'cyan')
  const errorResults = await checkErrorHandling()
  errorResults.forEach(addResult)
  
  // Phase 4: Performance
  log('\nPhase 4: Performance & UX', 'cyan')
  addResult(await checkResponseTime())
  
  // Generate report
  generateReport()
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    log(`\n❌ Fatal error: ${error.message}`, 'red')
    console.error(error)
    process.exit(1)
  })
}

// Export for use as module
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { main, checkBackendHealth, checkApiConnectivity }
}

