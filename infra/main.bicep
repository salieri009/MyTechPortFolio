targetScope = 'resourceGroup'

@minLength(1)
@maxLength(64)
@description('Name of the environment that can be used as part of naming resource convention')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string = resourceGroup().location

@minLength(1)
@description('Name of the resource group. Used for tagging.')
param resourceGroupName string

// Environment variables for the services
@description('Value for VITE_AUTH_MODE environment variable')
param viteAuthMode string = 'demo'

@description('Value for SPRING_PROFILES_ACTIVE environment variable')
param springProfilesActive string = 'azure'

@description('Value for CORS_ALLOWED_ORIGINS environment variable')
param corsAllowedOrigins string = '*'

var abbrs = loadJsonContent('abbreviations.json')
var resourceToken = uniqueString(subscription().id, resourceGroup().id, location, environmentName)
var resourcePrefix = 'mtp'

// Tags that should be applied to all resources
var tags = {
  'azd-env-name': environmentName
}

// Log Analytics Workspace
resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: '${abbrs.operationalInsightsWorkspaces}${resourcePrefix}-${resourceToken}'
  location: location
  tags: tags
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
    features: {
      searchVersion: 1
      legacy: 0
      enableLogAccessUsingOnlyResourcePermissions: true
    }
  }
}

// Application Insights
resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${abbrs.insightsComponents}${resourcePrefix}-${resourceToken}'
  location: location
  tags: tags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalyticsWorkspace.id
  }
}

// User Assigned Managed Identity
resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: '${abbrs.managedIdentityUserAssignedIdentities}${resourcePrefix}-${resourceToken}'
  location: location
  tags: tags
}

// SQL Server
resource sqlServer 'Microsoft.Sql/servers@2022-05-01-preview' = {
  name: '${abbrs.sqlServers}${resourcePrefix}-${resourceToken}'
  location: location
  tags: tags
  properties: {
    administratorLogin: 'azureuser'
    administratorLoginPassword: 'P@ssw0rd123!'
    version: '12.0'
    publicNetworkAccess: 'Enabled'
  }
}

// SQL Database
resource sqlDatabase 'Microsoft.Sql/servers/databases@2022-05-01-preview' = {
  parent: sqlServer
  name: 'portfolio'
  location: location
  tags: tags
  sku: {
    name: 'Basic'
    tier: 'Basic'
    capacity: 5
  }
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    maxSizeBytes: 2147483648
  }
}

// SQL Server Firewall Rule to allow Azure services
resource sqlFirewallRule 'Microsoft.Sql/servers/firewallRules@2022-05-01-preview' = {
  parent: sqlServer
  name: 'AllowAzureServices'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: '${abbrs.webServerFarms}${resourcePrefix}-${resourceToken}'
  location: location
  tags: tags
  sku: {
    name: 'B1'
    tier: 'Basic'
    size: 'B1'
    family: 'B'
    capacity: 1
  }
  properties: {
    reserved: false
  }
}

// Backend App Service
resource backendAppService 'Microsoft.Web/sites@2024-04-01' = {
  name: '${abbrs.webSitesAppService}${resourcePrefix}-backend-${resourceToken}'
  location: location
  tags: union(tags, { 'azd-service-name': 'backend' })
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}': {}
    }
  }
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      javaVersion: '17'
      javaContainer: 'TOMCAT'
      javaContainerVersion: '10.0'
      cors: {
        allowedOrigins: [ corsAllowedOrigins ]
        supportCredentials: false
      }
      appSettings: [
        {
          name: 'SPRING_PROFILES_ACTIVE'
          value: springProfilesActive
        }
        {
          name: 'SPRING_DATASOURCE_URL'
          value: 'jdbc:sqlserver://${sqlServer.properties.fullyQualifiedDomainName}:1433;database=${sqlDatabase.name};encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;'
        }
        {
          name: 'SPRING_DATASOURCE_USERNAME'
          value: sqlServer.properties.administratorLogin
        }
        {
          name: 'SPRING_DATASOURCE_PASSWORD'
          value: 'P@ssw0rd123!'
        }
        {
          name: 'CORS_ALLOWED_ORIGINS'
          value: corsAllowedOrigins
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: applicationInsights.properties.ConnectionString
        }
      ]
    }
    httpsOnly: true
  }
}

// Backend App Service Diagnostic Settings
resource backendDiagnosticSettings 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'backend-diagnostic-settings'
  scope: backendAppService
  properties: {
    workspaceId: logAnalyticsWorkspace.id
    logs: [
      {
        category: 'AppServiceHTTPLogs'
        enabled: true
      }
      {
        category: 'AppServiceConsoleLogs'
        enabled: true
      }
      {
        category: 'AppServiceAppLogs'
        enabled: true
      }
    ]
    metrics: [
      {
        category: 'AllMetrics'
        enabled: true
      }
    ]
  }
}

// Static Web App for Frontend
resource staticWebApp 'Microsoft.Web/staticSites@2024-04-01' = {
  name: '${abbrs.webStaticSites}${resourcePrefix}-${resourceToken}'
  location: location
  tags: union(tags, { 'azd-service-name': 'frontend' })
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    repositoryUrl: ''
    branch: ''
    buildProperties: {
      appLocation: '/'
      apiLocation: ''
      outputLocation: 'dist'
    }
  }
}

// Output values
output RESOURCE_GROUP_ID string = resourceGroup().id
output AZURE_LOCATION string = location
output AZURE_ENV_NAME string = environmentName

// Frontend outputs
output STATIC_WEB_APP_NAME string = staticWebApp.name
output STATIC_WEB_APP_URL string = 'https://${staticWebApp.properties.defaultHostname}'

// Backend outputs
output BACKEND_APP_SERVICE_NAME string = backendAppService.name
output BACKEND_APP_SERVICE_URL string = 'https://${backendAppService.properties.defaultHostName}'

// Database outputs
output SQL_SERVER_NAME string = sqlServer.name
output SQL_DATABASE_NAME string = sqlDatabase.name

// Shared outputs
output APPLICATION_INSIGHTS_CONNECTION_STRING string = applicationInsights.properties.ConnectionString
output LOG_ANALYTICS_WORKSPACE_ID string = logAnalyticsWorkspace.id
