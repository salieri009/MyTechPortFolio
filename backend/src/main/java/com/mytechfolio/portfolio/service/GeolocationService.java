package com.mytechfolio.portfolio.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Service for geolocation information
 * This is a basic implementation that can be extended with actual geolocation providers
 */
@Service
public class GeolocationService {

    private static final Logger logger = LoggerFactory.getLogger(GeolocationService.class);

    /**
     * Get location information for an IP address
     * This is a placeholder implementation - in production you would integrate with
     * services like MaxMind GeoIP2, IP2Location, or similar providers
     */
    public LocationInfo getLocationInfo(String ipAddress) {
        try {
            // Handle localhost and private IP addresses
            if (isLocalOrPrivateIp(ipAddress)) {
                return new LocationInfo("Unknown", "Unknown");
            }

            // TODO: Integrate with actual geolocation service
            // For now, return a placeholder implementation
            return getPlaceholderLocationInfo(ipAddress);
            
        } catch (Exception e) {
            logger.warn("Failed to get location info for IP: {}", ipAddress, e);
            return new LocationInfo("Unknown", "Unknown");
        }
    }

    /**
     * Check if IP is localhost or private
     */
    private boolean isLocalOrPrivateIp(String ipAddress) {
        if (ipAddress == null || ipAddress.isEmpty()) {
            return true;
        }

        // Localhost
        if ("127.0.0.1".equals(ipAddress) || "::1".equals(ipAddress) || "0:0:0:0:0:0:0:1".equals(ipAddress)) {
            return true;
        }

        // Private IP ranges
        String[] parts = ipAddress.split("\\.");
        if (parts.length == 4) {
            try {
                int first = Integer.parseInt(parts[0]);
                int second = Integer.parseInt(parts[1]);

                // 10.0.0.0/8
                if (first == 10) {
                    return true;
                }

                // 172.16.0.0/12
                if (first == 172 && second >= 16 && second <= 31) {
                    return true;
                }

                // 192.168.0.0/16
                if (first == 192 && second == 168) {
                    return true;
                }
            } catch (NumberFormatException e) {
                // Invalid IP format
                return true;
            }
        }

        return false;
    }

    /**
     * Placeholder implementation for geolocation
     * Replace this with actual geolocation service integration
     */
    private LocationInfo getPlaceholderLocationInfo(String ipAddress) {
        // This is a simple hash-based placeholder to provide consistent results
        // In production, replace with actual geolocation service calls
        
        int hash = Math.abs(ipAddress.hashCode());
        
        String[] countries = {
            "United States", "Canada", "United Kingdom", "Germany", "France", 
            "Japan", "South Korea", "Australia", "Brazil", "India", 
            "China", "Russia", "Italy", "Spain", "Netherlands"
        };
        
        String[] cities = {
            "New York", "Los Angeles", "Chicago", "Toronto", "London", 
            "Berlin", "Paris", "Tokyo", "Seoul", "Sydney", 
            "São Paulo", "Mumbai", "Beijing", "Moscow", "Madrid"
        };
        
        String country = countries[hash % countries.length];
        String city = cities[hash % cities.length];
        
        logger.debug("Generated placeholder location for IP {}: {} - {}", ipAddress, country, city);
        
        return new LocationInfo(country, city);
    }

    /**
     * Location information data class
     */
    public static class LocationInfo {
        private final String country;
        private final String city;

        public LocationInfo(String country, String city) {
            this.country = country;
            this.city = city;
        }

        public String getCountry() {
            return country;
        }

        public String getCity() {
            return city;
        }

        @Override
        public String toString() {
            return String.format("LocationInfo{country='%s', city='%s'}", country, city);
        }
    }

    /**
     * Validate IP address format
     */
    public boolean isValidIpAddress(String ipAddress) {
        if (ipAddress == null || ipAddress.isEmpty()) {
            return false;
        }

        // Simple IPv4 validation
        String[] parts = ipAddress.split("\\.");
        if (parts.length == 4) {
            try {
                for (String part : parts) {
                    int num = Integer.parseInt(part);
                    if (num < 0 || num > 255) {
                        return false;
                    }
                }
                return true;
            } catch (NumberFormatException e) {
                return false;
            }
        }

        // IPv6 basic check
        if (ipAddress.contains(":")) {
            return ipAddress.matches("^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$") ||
                   ipAddress.matches("^::1$") ||
                   ipAddress.matches("^::$");
        }

        return false;
    }

    /**
     * Get country code from country name (placeholder implementation)
     */
    public String getCountryCode(String country) {
        if (country == null) return "XX";
        
        // Simple mapping - extend as needed
        switch (country.toLowerCase()) {
            case "united states": return "US";
            case "canada": return "CA";
            case "united kingdom": return "GB";
            case "germany": return "DE";
            case "france": return "FR";
            case "japan": return "JP";
            case "south korea": return "KR";
            case "australia": return "AU";
            case "brazil": return "BR";
            case "india": return "IN";
            case "china": return "CN";
            case "russia": return "RU";
            case "italy": return "IT";
            case "spain": return "ES";
            case "netherlands": return "NL";
            default: return "XX";
        }
    }
}
