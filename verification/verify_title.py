from playwright.sync_api import sync_playwright

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app
        page.goto("http://localhost:5173")

        # Verify title change
        title = page.title()
        print(f"Page title: {title}")

        if title != "RTC File Transfer":
            print("Title verification failed!")
            browser.close()
            return

        print("Title verification passed!")

        # Take a screenshot of the landing page
        page.screenshot(path="verification/landing_page.png")

        # Go to receiver mode
        page.click("#receiver-mode-btn")
        page.screenshot(path="verification/receiver_mode.png")

        browser.close()

if __name__ == "__main__":
    verify_frontend()
