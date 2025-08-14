package com.mytechfolio.portfolio.config;

import com.mytechfolio.portfolio.domain.VisitorLog;
import com.mytechfolio.portfolio.domain.PageViewStatistics;
import com.mytechfolio.portfolio.domain.VisitorStatistics;
import com.mytechfolio.portfolio.domain.VisitorStatistics.StatisticsType;
import com.mytechfolio.portfolio.repository.VisitorLogRepository;
import com.mytechfolio.portfolio.repository.PageViewStatisticsRepository;
import com.mytechfolio.portfolio.repository.VisitorStatisticsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Random;

@Component
@Order(2) // Run after the main DataInitializer
public class VisitorAnalyticsDataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(VisitorAnalyticsDataInitializer.class);

    private final VisitorLogRepository visitorLogRepository;
    private final PageViewStatisticsRepository pageViewStatisticsRepository;
    private final VisitorStatisticsRepository visitorStatisticsRepository;

    @Autowired
    public VisitorAnalyticsDataInitializer(
            VisitorLogRepository visitorLogRepository,
            PageViewStatisticsRepository pageViewStatisticsRepository,
            VisitorStatisticsRepository visitorStatisticsRepository) {
        this.visitorLogRepository = visitorLogRepository;
        this.pageViewStatisticsRepository = pageViewStatisticsRepository;
        this.visitorStatisticsRepository = visitorStatisticsRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        logger.info("Initializing visitor analytics data...");

        // Only initialize if tables are empty
        if (visitorLogRepository.count() == 0) {
            initializeVisitorLogs();
        }

        if (pageViewStatisticsRepository.count() == 0) {
            initializePageViewStatistics();
        }

        if (visitorStatisticsRepository.count() == 0) {
            initializeVisitorStatistics();
        }

        logger.info("Visitor analytics data initialization completed");
    }

    private void initializeVisitorLogs() {
        logger.info("Creating sample visitor logs...");

        String[] pages = {"/", "/projects", "/skills", "/about", "/contact", "/academics"};
        String[] pageTitles = {"Home", "Projects", "Skills", "About", "Contact", "Academic Background"};
        String[] countries = {"South Korea", "United States", "Japan", "Germany", "United Kingdom", "Canada", "Australia", "France", "Brazil", "India"};
        String[] countryCodes = {"KR", "US", "JP", "DE", "GB", "CA", "AU", "FR", "BR", "IN"};
        String[] cities = {"Seoul", "New York", "Tokyo", "Berlin", "London", "Toronto", "Sydney", "Paris", "São Paulo", "Mumbai"};
        String[] browsers = {"Chrome", "Safari", "Firefox", "Edge", "Opera"};
        String[] os = {"Windows", "macOS", "Linux", "iOS", "Android"};
        String[] deviceTypes = {"Desktop", "Mobile", "Tablet"};
        String[] referrers = {null, "https://google.com", "https://github.com", "https://linkedin.com", "https://stackoverflow.com", "https://dev.to"};

        Random random = new Random();
        LocalDateTime now = LocalDateTime.now();

        // Generate logs for the last 30 days
        for (int day = 0; day < 30; day++) {
            LocalDateTime dayStart = now.minusDays(day).withHour(0).withMinute(0).withSecond(0);
            int visitsPerDay = random.nextInt(20) + 10; // 10-30 visits per day

            for (int visit = 0; visit < visitsPerDay; visit++) {
                VisitorLog log = new VisitorLog();
                
                // Random IP address
                log.setIpAddress(String.format("192.168.%d.%d", 
                    random.nextInt(256), random.nextInt(256)));
                
                // Random page
                int pageIndex = random.nextInt(pages.length);
                log.setPagePath(pages[pageIndex]);
                log.setPageTitle(pageTitles[pageIndex]);
                
                // Random time during the day
                log.setVisitTime(dayStart.plusHours(random.nextInt(24))
                    .plusMinutes(random.nextInt(60)));
                
                // Random session ID
                log.setSessionId("session_" + random.nextInt(100000));
                
                // Random location
                int locationIndex = random.nextInt(countries.length);
                log.setCountry(countries[locationIndex]);
                log.setCountryCode(countryCodes[locationIndex]);
                log.setCity(cities[locationIndex]);
                
                // Random browser and OS
                log.setBrowser(browsers[random.nextInt(browsers.length)]);
                log.setOperatingSystem(os[random.nextInt(os.length)]);
                log.setDeviceType(deviceTypes[random.nextInt(deviceTypes.length)]);
                log.setIsMobile(log.getDeviceType().equals("Mobile"));
                
                // Random referrer
                log.setReferrer(referrers[random.nextInt(referrers.length)]);
                
                // Random user agent
                log.setUserAgent("Mozilla/5.0 (compatible; TestBot/1.0)");
                
                // Random visit duration (1-10 minutes)
                log.setVisitDuration((long) (random.nextInt(600) + 60) * 1000);

                visitorLogRepository.save(log);
            }
        }

        logger.info("Created {} visitor log entries", visitorLogRepository.count());
    }

    private void initializePageViewStatistics() {
        logger.info("Creating sample page view statistics...");

        String[] pages = {"/", "/projects", "/skills", "/about", "/contact", "/academics"};
        String[] pageTitles = {"Home", "Projects", "Skills", "About", "Contact", "Academic Background"};
        Random random = new Random();

        // Generate statistics for the last 30 days
        for (int day = 0; day < 30; day++) {
            LocalDate date = LocalDate.now().minusDays(day);

            for (int i = 0; i < pages.length; i++) {
                PageViewStatistics stats = new PageViewStatistics(pages[i], pageTitles[i], date);
                
                // Random statistics with some realistic patterns
                long baseViews = (long) (random.nextInt(50) + 10);
                if (pages[i].equals("/")) {
                    baseViews *= 2; // Home page gets more views
                }
                
                stats.setTotalViews(baseViews);
                stats.setUniqueVisitors((long) (baseViews * (0.7 + random.nextDouble() * 0.3))); // 70-100% unique
                stats.setTotalDuration(baseViews * (2000 + random.nextInt(3000))); // 2-5 seconds average
                stats.setBounceRate(20.0 + random.nextDouble() * 40.0); // 20-60% bounce rate

                pageViewStatisticsRepository.save(stats);
            }
        }

        logger.info("Created {} page view statistics entries", pageViewStatisticsRepository.count());
    }

    private void initializeVisitorStatistics() {
        logger.info("Creating sample visitor statistics...");

        Random random = new Random();
        String[] countries = {"South Korea", "United States", "Japan", "Germany", "United Kingdom"};
        String[] cities = {"Seoul", "New York", "Tokyo", "Berlin", "London"};

        // Generate daily statistics for the last 30 days
        for (int day = 0; day < 30; day++) {
            LocalDate date = LocalDate.now().minusDays(day);

            // Daily statistics
            VisitorStatistics dailyStats = new VisitorStatistics(date, StatisticsType.DAILY);
            dailyStats.setTotalVisitors((long) (random.nextInt(100) + 50));
            dailyStats.setUniqueVisitors((long) (dailyStats.getTotalVisitors() * (0.8 + random.nextDouble() * 0.2)));
            dailyStats.setTotalPageViews(dailyStats.getTotalVisitors() + random.nextInt(50));
            dailyStats.setBounceRate(25.0 + random.nextDouble() * 30.0);
            dailyStats.setAverageSessionDuration(120.0 + random.nextDouble() * 300.0);
            dailyStats.setNewVisitors((long) (dailyStats.getUniqueVisitors() * (0.3 + random.nextDouble() * 0.4)));
            dailyStats.setReturningVisitors(dailyStats.getUniqueVisitors() - dailyStats.getNewVisitors());

            visitorStatisticsRepository.save(dailyStats);

            // Country statistics for the last 7 days
            if (day < 7) {
                for (String country : countries) {
                    VisitorStatistics countryStats = new VisitorStatistics(date, StatisticsType.COUNTRY);
                    countryStats.setCountry(country);
                    countryStats.setTotalVisitors((long) (random.nextInt(20) + 5));
                    countryStats.setUniqueVisitors((long) (countryStats.getTotalVisitors() * (0.8 + random.nextDouble() * 0.2)));
                    countryStats.setTotalPageViews(countryStats.getTotalVisitors() + random.nextInt(10));

                    visitorStatisticsRepository.save(countryStats);
                }

                // City statistics for the last 7 days
                for (String city : cities) {
                    VisitorStatistics cityStats = new VisitorStatistics(date, StatisticsType.CITY);
                    cityStats.setCity(city);
                    cityStats.setTotalVisitors((long) (random.nextInt(15) + 3));
                    cityStats.setUniqueVisitors((long) (cityStats.getTotalVisitors() * (0.8 + random.nextDouble() * 0.2)));
                    cityStats.setTotalPageViews(cityStats.getTotalVisitors() + random.nextInt(8));

                    visitorStatisticsRepository.save(cityStats);
                }
            }

            // Hourly statistics for today only
            if (day == 0) {
                for (int hour = 0; hour < 24; hour++) {
                    VisitorStatistics hourlyStats = new VisitorStatistics(date, StatisticsType.HOURLY);
                    hourlyStats.setHourOfDay(hour);
                    
                    // Simulate realistic hourly patterns (more activity during business hours)
                    int baseVisitors;
                    if (hour >= 9 && hour <= 17) {
                        baseVisitors = random.nextInt(10) + 5; // 5-15 during business hours
                    } else if (hour >= 18 && hour <= 22) {
                        baseVisitors = random.nextInt(8) + 3; // 3-11 in the evening
                    } else {
                        baseVisitors = random.nextInt(3) + 1; // 1-4 during night/early morning
                    }
                    
                    hourlyStats.setTotalVisitors((long) baseVisitors);
                    hourlyStats.setUniqueVisitors((long) (baseVisitors * (0.8 + random.nextDouble() * 0.2)));
                    hourlyStats.setTotalPageViews((long) (baseVisitors + random.nextInt(3)));

                    visitorStatisticsRepository.save(hourlyStats);
                }
            }
        }

        logger.info("Created {} visitor statistics entries", visitorStatisticsRepository.count());
    }
}
