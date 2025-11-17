---
title: "Common Issues and Solutions"
version: "1.0.0"
last_updated: "2025-11-17"
status: "active"
category: "Guide"
audience: ["Developers", "DevOps Engineers"]
prerequisites: ["Getting-Started.md"]
related_docs: ["Getting-Started.md", "Guides/Development/Frontend-Setup.md"]
maintainer: "Development Team"
---

# Common Issues and Solutions

> **Version**: 1.0.0  
> **Last Updated**: 2025-11-17  
> **Status**: Active

## Overview

This guide addresses common issues encountered during development and deployment, with step-by-step solutions and diagnostic steps.

---

## Frontend Issues

### Module Not Found Errors

**Symptom**: `Module not found: Can't resolve '...'`

**Solutions**:
1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Check import paths:
   - Verify path aliases in `tsconfig.json` and `vite.config.ts`
   - Use absolute imports: `@components/...` instead of relative paths

3. Check file extensions:
   - Ensure `.tsx` for React components
   - Ensure `.ts` for TypeScript files

### Build Errors

**Symptom**: Vite build fails with TypeScript errors

**Solutions**:
1. Check TypeScript version compatibility
2. Run type check:
   ```bash
   npm run type-check
   ```
3. Fix type errors or add type assertions
4. Clear build cache:
   ```bash
   rm -rf dist node_modules/.vite
   ```

### CORS Errors

**Symptom**: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solutions**:
1. **Development**: Check Vite proxy configuration in `vite.config.ts`
2. **Backend**: Verify CORS configuration in `WebConfig.java`
3. **Environment**: Check `VITE_API_BASE_URL` in `.env`
4. **Backend CORS**: Ensure backend allows frontend origin

### Port Already in Use

**Symptom**: `Port 5173 is already in use`

**Solutions**:
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5173 | xargs kill
```

Or use a different port:
```bash
npm run dev -- --port 3000
```

---

## Backend Issues

### MongoDB Connection Failed

**Symptom**: `MongoSocketException: Unable to connect to server`

**Solutions**:
1. **Check MongoDB is running**:
   ```bash
   mongosh --eval "db.version()"
   ```

2. **Verify connection string** in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/mytechfolio
   ```

3. **Check firewall settings**
4. **Verify MongoDB service**:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

### Port 8080 Already in Use

**Symptom**: `Port 8080 is already in use`

**Solutions**:
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8080 | xargs kill
```

Or change port in `application.properties`:
```properties
server.port=8081
```

### Gradle Build Failures

**Symptom**: `Gradle build failed`

**Solutions**:
1. **Clean build**:
   ```bash
   ./gradlew clean build
   ```

2. **Check Java version**:
   ```bash
   java -version  # Should be 21+
   ```

3. **Invalidate Gradle cache**:
   ```bash
   ./gradlew clean --refresh-dependencies
   ```

4. **Check dependencies** in `build.gradle`

### JWT Token Errors

**Symptom**: `JWT token expired` or `Invalid token`

**Solutions**:
1. **Clear localStorage**:
   ```javascript
   localStorage.clear()
   ```

2. **Check token expiration** in backend configuration
3. **Verify JWT secret** in environment variables
4. **Re-authenticate** if token is expired

---

## Database Issues

### Connection Timeout

**Symptom**: `MongoDB connection timeout`

**Solutions**:
1. Check MongoDB is accessible
2. Verify network connectivity
3. Check connection string format
4. Increase timeout in configuration

### Data Not Persisting

**Symptom**: Data disappears after restart

**Solutions**:
1. **Check MongoDB data directory**:
   ```bash
   # Default locations
   # Windows: C:\data\db
   # macOS/Linux: /data/db
   ```

2. **Verify write permissions**
3. **Check MongoDB logs** for errors
4. **Verify database name** in connection string

---

## Deployment Issues

### Build Fails in CI/CD

**Symptom**: Azure Pipeline build fails

**Solutions**:
1. **Check build logs** for specific errors
2. **Verify environment variables** in pipeline
3. **Check Node.js/Java versions** match local
4. **Review pipeline YAML** configuration

### Static Assets Not Loading

**Symptom**: JS/CSS files return 404 or HTML

**Solutions**:
1. **Check `staticwebapp.config.json`** routing rules
2. **Verify output directory** in build configuration
3. **Check MIME types** configuration
4. **Verify file paths** in HTML

### Environment Variables Not Working

**Symptom**: Environment variables undefined

**Solutions**:
1. **Frontend**: Variables must start with `VITE_`
2. **Backend**: Check `.env` file location
3. **Azure**: Verify variables in App Settings
4. **Restart application** after adding variables

---

## API Issues

### 404 Not Found

**Symptom**: API endpoints return 404

**Solutions**:
1. **Check API base URL** configuration
2. **Verify endpoint paths** match backend
3. **Check API version** (`/api/v1/...`)
4. **Verify backend is running**

### 401 Unauthorized

**Symptom**: API returns 401 Unauthorized

**Solutions**:
1. **Check authentication token** in request headers
2. **Verify token is valid** and not expired
3. **Check user permissions** and roles
4. **Re-authenticate** if needed

### 500 Internal Server Error

**Symptom**: API returns 500 error

**Solutions**:
1. **Check backend logs** for error details
2. **Verify database connection**
3. **Check environment variables**
4. **Review error stack trace**

---

## Performance Issues

### Slow Page Load

**Symptom**: Pages load slowly

**Solutions**:
1. **Check network tab** for slow requests
2. **Optimize images** (use WebP, lazy loading)
3. **Enable code splitting**
4. **Check bundle size**:
   ```bash
   npm run build -- --analyze
   ```

### Memory Leaks

**Symptom**: Application memory usage increases over time

**Solutions**:
1. **Check for event listeners** not being removed
2. **Verify useEffect cleanup** functions
3. **Check for circular references**
4. **Use React DevTools Profiler**

---

## Development Environment

### Hot Reload Not Working

**Symptom**: Changes not reflected in browser

**Solutions**:
1. **Restart dev server**:
   ```bash
   npm run dev
   ```

2. **Clear browser cache**
3. **Check file watchers** aren't exhausted
4. **Verify file is saved** before checking

### TypeScript Errors in IDE

**Symptom**: IDE shows TypeScript errors but code compiles

**Solutions**:
1. **Restart TypeScript server** in IDE
2. **Reload window** (VS Code: Ctrl+Shift+P ??"Reload Window")
3. **Check tsconfig.json** configuration
4. **Clear TypeScript cache**

---

## Diagnostic Steps

### General Troubleshooting

1. **Check logs**:
   - Frontend: Browser console
   - Backend: Application logs
   - Database: MongoDB logs

2. **Verify versions**:
   - Node.js: `node -v`
   - Java: `java -version`
   - MongoDB: `mongosh --version`

3. **Check environment**:
   - Environment variables
   - Configuration files
   - Network connectivity

4. **Test in isolation**:
   - Test components individually
   - Test API endpoints with Postman
   - Test database queries directly

---

## Getting Additional Help

### Resources

- **Documentation**: [docs/README.md](../README.md)
- **GitHub Issues**: Search for similar issues
- **Stack Overflow**: Tag with `mytechportfolio`
- **Contact**: Reach out to maintainers

### Reporting Issues

When reporting issues, include:
- Error messages and stack traces
- Steps to reproduce
- Environment details
- Expected vs actual behavior
- Screenshots if applicable

---

## Related Documentation

- [Getting Started Guide](../Getting-Started.md)
- [Frontend Setup](../Guides/Development/Frontend-Setup.md)
- [Backend Setup](../Guides/Development/Backend-Setup.md)
- [Deployment Guide](../Guides/Deployment/Deployment-Guide.md)

---

**Last Updated**: 2025-11-17  
**Maintained By**: Development Team


