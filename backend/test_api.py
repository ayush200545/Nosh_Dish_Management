import requests
import time
import sys

BASE_URL = "http://localhost:8000/api/v1"

# 1. Login to get token
print("1. Logging in as admin...")
login_response = requests.post(f"{BASE_URL}/auth/login", data={"username": "admin@nosh.com", "password": "adminpassword"})
if login_response.status_code != 200:
    print(f"Login failed: {login_response.text}")
    sys.exit(1)
    
token = login_response.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}
print("Login successful.")

# 2. Create a dish
print("\n2. Creating a test dish...")
dish_data = {
    "dishName": "Test API Dish",
    "imageUrl": "https://example.com/image.jpg",
    "category": "Main Course",
    "isPublished": False,
    "description": "A test dish",
    "prepTime": "15 mins",
    "ingredients": ["Test"],
    "recipe": "Test recipe",
    "orderIndex": 0
}
create_response = requests.post(f"{BASE_URL}/dishes", json=dish_data, headers=headers)
if create_response.status_code != 200:
    print(f"Create failed: {create_response.text}")
    sys.exit(1)

created_dish = create_response.json()
dish_id = created_dish["dishId"]
print(f"Created dish successfully with ID: {dish_id}")

# 3. Publish the dish
print(f"\n3. Publishing dish {dish_id}...")
publish_response = requests.patch(f"{BASE_URL}/dishes/{dish_id}/toggle", json={"isPublished": True}, headers=headers)
if publish_response.status_code != 200:
    print(f"Publish failed: {publish_response.text}")
    sys.exit(1)
print("Publish successful.")

# 4. Verify it's published
print("\n4. Verifying dish status...")
get_response = requests.get(f"{BASE_URL}/dishes/{dish_id}")
if get_response.status_code != 200:
    print(f"Get failed: {get_response.text}")
    sys.exit(1)
if get_response.json()["isPublished"] is True:
    print("Verification successful: Dish is published.")
else:
    print("Verification failed: Dish is not published.")
    sys.exit(1)

# 5. Delete the dish
print(f"\n5. Deleting dish {dish_id}...")
delete_response = requests.delete(f"{BASE_URL}/dishes/{dish_id}", headers=headers)
if delete_response.status_code != 200:
    print(f"Delete failed: {delete_response.text}")
    sys.exit(1)
print("Delete successful.")

# 6. Verify deletion
print("\n6. Verifying deletion...")
verify_delete_response = requests.get(f"{BASE_URL}/dishes/{dish_id}")
if verify_delete_response.status_code == 404:
    print("Verification successful: Dish not found (deleted).")
else:
    print(f"Verification failed: Expected 404, got {verify_delete_response.status_code}")
    sys.exit(1)

print("\nAll tests passed perfectly!")
