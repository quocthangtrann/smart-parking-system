import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import pytest

def test_admin_slot_monitoring(driver, base_url):
    # 1. Login as Admin
    driver.get(base_url)
    
    WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//span[contains(text(), 'Admin')]"))
    ).click()
    
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//input[@type='text']")))
    driver.find_element(By.XPATH, "//input[@type='text']").send_keys("admin1")
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
        
    # 2. Verify Admin Dashboard
    WebDriverWait(driver, 10).until(EC.url_contains("/admin"))
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Daily Revenue')]")))

    # 3. Navigate to Real-time Map
    WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//span[contains(text(), 'Real-time Parking')]"))
    ).click()
    WebDriverWait(driver, 10).until(EC.url_contains("/realtime-parking"))

    # 4. Verify Slot Grid
    # Check if we can find slot buttons
    slots = WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located((By.XPATH, "//button[contains(@class, 'h-16')]"))
    )
    assert len(slots) > 0
    print(f"Verified {len(slots)} slots visible on dashboard")

def test_admin_device_monitoring(driver, base_url):
    # Navigate to Devices
    WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//*[contains(text(), 'Devices')]"))
    ).click()
    WebDriverWait(driver, 10).until(EC.url_contains("/devices"))
    
    # Assert online status for Gate A (should be sent by heartbeat)
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//*[translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')='online']")))
    print("Admin flow test passed!")
