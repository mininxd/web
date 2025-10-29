from playwright.sync_api import Page, expect

def test_qr_code_layout(page: Page):
    """
    This test verifies that the QR code stickers are displayed in a masonry layout.
    """
    print("Starting verification script...")
    # 1. Arrange: Go to the application.
    page.goto("http://localhost:5173")

    # The page requires a QRIS code to be entered to proceed.
    # I'll use a dummy QRIS code to log in.
    page.get_by_placeholder("0002010...").fill("00020101021126580015ID.OR.ID1000103A00000054321015303360520458020515UMINXD.COM000000070201A580303IRE5907MININXD6006MEJOBO6105613306304A8A6")
    page.get_by_role("button", name="Login").click()

    # 2. Assert: Wait for the grid to be visible and then take a screenshot.
    list_qris_canvas = page.locator("#listQrisCanvas")
    expect(list_qris_canvas).to_be_visible()

    # Wait for the masonry layout to be applied
    page.wait_for_timeout(2000)

    # 3. Screenshot: Capture the final result for visual verification.
    print("Taking screenshot...")
    page.screenshot(path="jules-scratch/verification/verification.png")
    print("Screenshot taken.")
