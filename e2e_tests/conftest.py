import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options

@pytest.fixture(scope="module")
def driver():
    """Initialize Chrome WebDriver."""
    options = Options()
    # options.add_argument("--headless")  # Uncomment for headless mode
    options.add_argument("--window-size=1920,1080")
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    
    yield driver
    
    driver.quit()

@pytest.fixture
def base_url():
    """Return the frontend base URL."""
    return "http://localhost:5173"
