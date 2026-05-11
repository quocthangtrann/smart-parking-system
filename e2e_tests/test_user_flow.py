import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import pytest

def test_user_login_and_add_vehicle(driver, base_url):
    # 1. Navigate to landing page
    driver.get(base_url)
    
    # 2. Select User Role
    WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//span[contains(text(), 'HCMUT account')]"))
    ).click()
    
    # 3. Login
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//input[@type='text']")))
    driver.find_element(By.XPATH, "//input[@type='text']").send_keys("student1")
    driver.find_element(By.XPATH, "//input[@type='password']").send_keys("123")
    driver.find_element(By.XPATH, "//button[contains(., 'Login')]").click()
    
    # Handle potential login failure alert
    try:
        WebDriverWait(driver, 3).until(EC.alert_is_present())
        alert = driver.switch_to.alert
        error_msg = alert.text
        alert.accept()
        pytest.fail(f"Login Failed with alert: '{error_msg}'. Please ensure you have run 'npm run seed' in the backend to populate the test users.")
    except TimeoutException:
        pass # No alert appeared, login hopefully successful
    
    # 4. Verify Redirect to Student Home
    WebDriverWait(driver, 10).until(EC.url_contains("/student"))
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Parking Availability')]")))

    # 5. Navigate to My Vehicles
    WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//*[contains(text(), 'Vehicle') and not(contains(text(), 'Type'))]"))
    ).click()
    WebDriverWait(driver, 10).until(EC.url_contains("/vehicles"))

    # 6. Add a Vehicle
    initial_count = len(driver.find_elements(By.XPATH, "//div[contains(@class, 'bg-white/5')]"))
    
    WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Add Vehicle')]"))
    ).click()
    
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Ex: 59A1-123.45']")))
    driver.find_element(By.XPATH, "//input[@placeholder='Ex: 59A1-123.45']").send_keys("TEST-999")
    driver.find_element(By.XPATH, "//input[@placeholder='Ex: Honda, Yamaha...']").send_keys("Tesla")
    
    WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Register Vehicle')]"))
    ).click()
    
    # 7. Assertion
    time.sleep(2) # Wait for animation
    new_count = len(driver.find_elements(By.XPATH, "//div[contains(@class, 'bg-white/5')]"))
    assert new_count > initial_count or "TEST-999" in driver.page_source
    print("User flow test passed!")
